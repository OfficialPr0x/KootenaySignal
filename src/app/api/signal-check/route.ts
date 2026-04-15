import { crawlWebsite } from '@/lib/services/crawler';
import { runSerpEnrichment } from '@/lib/services/serp';
import { runPageSpeedInsights } from '@/lib/services/pagespeed';
import { analyzeWithDeepSeek } from '@/lib/services/deepseek';
import { z } from 'zod';

const schema = z.object({
  websiteUrl: z.string().min(1).max(500),
  businessName: z.string().min(1).max(200),
  city: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
});

// Simple in-memory rate limit: 3 checks per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  if (checkRateLimit(ip)) {
    return Response.json(
      { error: 'You\'ve run a few checks already. Try again in an hour.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Please fill in the required fields.' }, { status: 400 });
  }

  const { websiteUrl, businessName, city, industry } = parsed.data;

  try {
    const crawlData = await crawlWebsite(websiteUrl);

    const [serpData, psiData] = await Promise.all([
      runSerpEnrichment(businessName, websiteUrl, city, industry),
      runPageSpeedInsights(websiteUrl),
    ]);

    const report = await analyzeWithDeepSeek(
      businessName, websiteUrl, city, industry,
      crawlData, serpData, psiData
    );

    return Response.json({ report });
  } catch (err) {
    console.error('Signal check error:', err);
    return Response.json(
      { error: 'Check failed. Please try again.' },
      { status: 500 }
    );
  }
}
