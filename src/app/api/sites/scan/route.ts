import { auth } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/db';
import { crawlWebsite } from '@/lib/services/crawler';
import { runSerpEnrichment } from '@/lib/services/serp';
import { runPageSpeedInsights } from '@/lib/services/pagespeed';
import { analyzeWithDeepSeek } from '@/lib/services/deepseek';
import { generateActionItems } from '@/lib/services/actions';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();

  // Get the user's site
  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (!site) return Response.json({ error: 'No site found' }, { status: 404 });

  // Rate limit: max 1 scan per day
  if (site.last_scan_at) {
    const lastScan = new Date(site.last_scan_at);
    const hoursSince = (Date.now() - lastScan.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 20) {
      return Response.json({
        error: 'Your site was scanned recently. Next scan available in ' + Math.ceil(20 - hoursSince) + ' hours.'
      }, { status: 429 });
    }
  }

  try {
    const crawlData = await crawlWebsite(site.website_url);
    const [serpData, psiData] = await Promise.all([
      runSerpEnrichment(site.business_name, site.website_url, site.city, site.industry),
      runPageSpeedInsights(site.website_url),
    ]);
    const report = await analyzeWithDeepSeek(
      site.business_name, site.website_url, site.city, site.industry,
      crawlData, serpData, psiData
    );

    const brandPos = serpData.keywordRankings.find((k: { keyword: string }) => k.keyword === site.business_name);
    const industryKey = serpData.keywordRankings.find((k: { keyword: string }) => k.keyword !== site.business_name && !k.keyword.includes('Local Pack'));
    const localPackEntry = serpData.keywordRankings.find((k: { keyword: string }) => k.keyword.includes('Local Pack'));
    const reviews = serpData.localPack.localResults.find((r: { title: string }) =>
      r.title.toLowerCase().includes(site.business_name.toLowerCase())
    );

    const { data: snapshot } = await supabase.from('snapshots').insert({
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
    }).select().single();

    // Generate new action items
    const actions = generateActionItems(report, crawlData, serpData, psiData);
    if (actions.length > 0) {
      await supabase.from('action_items').insert(
        actions.map(a => ({ site_id: site.id, ...a }))
      );
    }

    await supabase.from('sites').update({ last_scan_at: new Date().toISOString() }).eq('id', site.id);

    return Response.json({ snapshot, report });
  } catch (err) {
    console.error('Scan error:', err);
    return Response.json({ error: 'Scan failed. Please try again.' }, { status: 500 });
  }
}
