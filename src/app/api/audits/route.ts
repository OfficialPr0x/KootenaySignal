import { auth } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/db';
import { crawlWebsite } from '@/lib/services/crawler';
import { runSerpEnrichment } from '@/lib/services/serp';
import { runPageSpeedInsights } from '@/lib/services/pagespeed';
import { analyzeWithDeepSeek } from '@/lib/services/deepseek';
import { z } from 'zod';

const auditSchema = z.object({
  businessName: z.string().min(1).max(200),
  websiteUrl: z.string().min(1).max(500),
  city: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  goals: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  // Rate limit: max 3 audits per user
  const { count } = await supabase
    .from('audits')
    .select('*', { count: 'exact', head: true })
    .eq('clerk_user_id', userId);
  if ((count ?? 0) >= 3) {
    return Response.json({ error: 'Audit limit reached. Contact Kootenay Signal for unlimited audits.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = auditSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { businessName, websiteUrl, city, industry, goals } = parsed.data;

  // Create audit record
  const { data: audit, error: insertError } = await supabase
    .from('audits')
    .insert({
      clerk_user_id: userId,
      business_name: businessName,
      website_url: websiteUrl,
      city,
      industry,
      goals,
      status: 'crawling',
    })
    .select()
    .single();

  if (insertError || !audit) {
    console.error('Insert error:', insertError);
    return Response.json({ error: 'Failed to create audit' }, { status: 500 });
  }

  // Run the audit pipeline
  try {
    // Step 1: Crawl
    const crawlData = await crawlWebsite(websiteUrl);
    await supabase
      .from('audits')
      .update({ crawl_data: crawlData, status: 'enriching' })
      .eq('id', audit.id);

    // Step 2: SERP + PageSpeed in parallel
    const [serpData, psiData] = await Promise.all([
      runSerpEnrichment(businessName, websiteUrl, city, industry),
      runPageSpeedInsights(websiteUrl),
    ]);

    await supabase
      .from('audits')
      .update({ serp_data: serpData, psi_data: psiData, status: 'analyzing' })
      .eq('id', audit.id);

    // Step 3: DeepSeek analysis
    const report = await analyzeWithDeepSeek(
      businessName, websiteUrl, city, industry,
      crawlData, serpData, psiData
    );

    // Step 4: Save report
    const { data: updatedAudit } = await supabase
      .from('audits')
      .update({
        status: 'complete',
        signal_score: report.signal_score,
        visibility_score: report.visibility_score,
        trust_score: report.trust_score,
        conversion_score: report.conversion_score,
        local_presence_score: report.local_presence_score,
        offer_clarity_score: report.offer_clarity_score,
        paid_readiness_score: report.paid_readiness_score,
        seo_score: report.seo_score,
        report_data: report,
      })
      .eq('id', audit.id)
      .select()
      .single();

    return Response.json({ audit: updatedAudit });
  } catch (err) {
    console.error('Audit pipeline error:', err);
    await supabase
      .from('audits')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Unknown error',
      })
      .eq('id', audit.id);
    return Response.json({ error: 'Audit failed. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  const { data: audits } = await supabase
    .from('audits')
    .select('id, business_name, website_url, city, industry, status, signal_score, created_at')
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false });

  return Response.json({ audits: audits ?? [] });
}
