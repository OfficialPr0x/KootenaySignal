import { auth } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/db';
import { crawlWebsite } from '@/lib/services/crawler';
import { runSerpEnrichment } from '@/lib/services/serp';
import { runPageSpeedInsights } from '@/lib/services/pagespeed';
import { analyzeWithDeepSeek } from '@/lib/services/deepseek';
import { generateActionItems } from '@/lib/services/actions';
import { z } from 'zod';

const siteSchema = z.object({
  businessName: z.string().min(1).max(200),
  websiteUrl: z.string().min(1).max(500),
  city: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  goals: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();

  // Check if user already has a site
  const { data: existing } = await supabase
    .from('sites')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (existing) {
    return Response.json({ error: 'You already have a monitored site. Delete it first to start fresh.' }, { status: 409 });
  }

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = siteSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });

  const { businessName, websiteUrl, city, industry, goals } = parsed.data;

  // Create the site
  const { data: site, error: insertError } = await supabase
    .from('sites')
    .insert({
      clerk_user_id: userId,
      business_name: businessName,
      website_url: websiteUrl,
      city, industry, goals,
    })
    .select()
    .single();

  if (insertError || !site) {
    return Response.json({ error: 'Failed to create site' }, { status: 500 });
  }

  // Run initial scan
  try {
    const crawlData = await crawlWebsite(websiteUrl);
    const [serpData, psiData] = await Promise.all([
      runSerpEnrichment(businessName, websiteUrl, city, industry),
      runPageSpeedInsights(websiteUrl),
    ]);
    const report = await analyzeWithDeepSeek(businessName, websiteUrl, city, industry, crawlData, serpData, psiData);

    // Extract SERP tracking data
    const brandPos = serpData.keywordRankings.find(k => k.keyword === businessName);
    const industryKey = serpData.keywordRankings.find(k => k.keyword !== businessName && !k.keyword.includes('Local Pack'));
    const localPackEntry = serpData.keywordRankings.find(k => k.keyword.includes('Local Pack'));
    const reviews = serpData.localPack.localResults.find(r =>
      r.title.toLowerCase().includes(businessName.toLowerCase())
    );

    // Create initial snapshot
    await supabase.from('snapshots').insert({
      site_id: site.id,
      signal_score: report.signal_score,
      visibility_score: report.visibility_score,
      trust_score: report.trust_score,
      conversion_score: report.conversion_score,
      local_presence_score: report.local_presence_score,
      seo_score: report.seo_score,
      performance_score: psiData.performanceScore,
      brand_position: brandPos?.position ?? null,
      industry_position: industryKey?.position ?? null,
      in_local_pack: localPackEntry?.position !== null,
      competitor_count: serpData.competitorSearch.organicResults.length,
      review_count: reviews?.reviews ?? null,
      avg_rating: reviews?.rating ?? null,
      lcp: psiData.largestContentfulPaint,
      fcp: psiData.firstContentfulPaint,
      cls: psiData.cumulativeLayoutShift,
      mobile_friendly: psiData.isMobileFriendly,
      crawl_data: crawlData,
      serp_data: serpData,
      psi_data: psiData,
    });

    // Generate initial action items
    const actions = generateActionItems(report, crawlData, serpData, psiData);
    if (actions.length > 0) {
      await supabase.from('action_items').insert(
        actions.map(a => ({ site_id: site.id, ...a }))
      );
    }

    // Update last_scan_at
    await supabase.from('sites').update({ last_scan_at: new Date().toISOString() }).eq('id', site.id);

    return Response.json({ site, snapshot: true });
  } catch (err) {
    console.error('Initial scan error:', err);
    // Site is created but scan failed — they can trigger a manual scan
    return Response.json({ site, snapshot: false, scanError: 'Initial scan failed. You can trigger a new scan from the dashboard.' });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();
  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  return Response.json({ site: site ?? null });
}
