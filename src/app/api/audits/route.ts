import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
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

  // Rate limit: max 3 audits per user
  const auditCount = await prisma.audit.count({ where: { clerkUserId: userId } });
  if (auditCount >= 3) {
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
  const audit = await prisma.audit.create({
    data: {
      clerkUserId: userId,
      businessName,
      websiteUrl,
      city,
      industry,
      goals,
      status: 'crawling',
    },
  });

  // Run the audit pipeline (sync for MVP — can move to background jobs later)
  try {
    // Step 1: Crawl
    const crawlData = await crawlWebsite(websiteUrl);
    await prisma.audit.update({
      where: { id: audit.id },
      data: { crawlData: JSON.stringify(crawlData), status: 'enriching' },
    });

    // Step 2: SERP + PageSpeed in parallel
    const [serpData, psiData] = await Promise.all([
      runSerpEnrichment(businessName, websiteUrl, city, industry),
      runPageSpeedInsights(websiteUrl),
    ]);

    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        serpData: JSON.stringify(serpData),
        psiData: JSON.stringify(psiData),
        status: 'analyzing',
      },
    });

    // Step 3: DeepSeek analysis
    const report = await analyzeWithDeepSeek(
      businessName, websiteUrl, city, industry,
      crawlData, serpData, psiData
    );

    // Step 4: Save report
    const updatedAudit = await prisma.audit.update({
      where: { id: audit.id },
      data: {
        status: 'complete',
        signalScore: report.signal_score,
        visibilityScore: report.visibility_score,
        trustScore: report.trust_score,
        conversionScore: report.conversion_score,
        localPresenceScore: report.local_presence_score,
        offerClarityScore: report.offer_clarity_score,
        paidReadinessScore: report.paid_readiness_score,
        seoScore: report.seo_score,
        reportData: JSON.stringify(report),
      },
    });

    return Response.json({ audit: updatedAudit });
  } catch (err) {
    console.error('Audit pipeline error:', err);
    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      },
    });
    return Response.json({ error: 'Audit failed. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const audits = await prisma.audit.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      businessName: true,
      websiteUrl: true,
      city: true,
      industry: true,
      status: true,
      signalScore: true,
      createdAt: true,
    },
  });

  return Response.json({ audits });
}
