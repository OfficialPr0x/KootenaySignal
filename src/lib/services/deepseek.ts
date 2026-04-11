import { CrawlResult } from './crawler';
import { SerpResult } from './serp';
import { PSIResult } from './pagespeed';

export interface SignalReport {
  signal_score: number;
  visibility_score: number;
  trust_score: number;
  conversion_score: number;
  local_presence_score: number;
  offer_clarity_score: number;
  paid_readiness_score: number;
  seo_score: number;
  summary: string;
  headline: string;
  strengths: string[];
  weaknesses: string[];
  quick_wins: string[];
  seo_issues: string[];
  keyword_insights: string[];
  recommended_services: string[];
  cta_message: string;
}

export async function analyzeWithDeepSeek(
  businessName: string,
  websiteUrl: string,
  city: string | undefined,
  industry: string | undefined,
  crawlData: CrawlResult,
  serpData: SerpResult,
  psiData: PSIResult
): Promise<SignalReport> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  const context = {
    business_name: businessName,
    website_url: websiteUrl,
    city: city || 'Unknown',
    industry: industry || 'Unknown',
    site_findings: {
      title: crawlData.title,
      meta_description: crawlData.metaDescription,
      headings_h1: crawlData.headings.h1,
      headings_h2: crawlData.headings.h2,
      cta_count: crawlData.ctaButtons.length,
      cta_examples: crawlData.ctaButtons.slice(0, 5),
      services_found: crawlData.services.slice(0, 10),
      has_testimonials: crawlData.testimonials,
      has_phone: crawlData.hasPhone,
      has_email: crawlData.hasEmail,
      has_address: crawlData.hasAddress,
      has_booking_flow: crawlData.hasBookingFlow,
      has_schema_markup: crawlData.hasSchemaMarkup,
      has_ssl: crawlData.hasSSL,
      social_links_count: crawlData.socialLinks.length,
      image_count: crawlData.imageCount,
      images_with_alt: crawlData.imagesWithAlt,
      images_without_alt: crawlData.imagesWithoutAlt,
      internal_links: crawlData.internalLinks,
      external_links: crawlData.externalLinks,
      word_count: crawlData.wordCount,
      has_canonical: !!crawlData.canonicalUrl,
      has_og_tags: Object.keys(crawlData.ogTags).length > 0,
      robots_meta: crawlData.robotsMeta,
      crawl_error: crawlData.error || null,
    },
    serp_findings: {
      brand_search_results: serpData.brandSearch.organicResults.length,
      brand_found_in_results: serpData.brandSearch.organicResults.some(r =>
        r.link.includes(new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`).hostname.replace('www.', ''))
      ),
      local_pack_results: serpData.localPack.localResults.length,
      in_local_pack: serpData.localPack.localResults.some(r =>
        r.title.toLowerCase().includes(businessName.toLowerCase())
      ),
      review_results: serpData.reviewSearch.organicResults.slice(0, 3).map(r => ({ title: r.title, snippet: r.snippet })),
      competitor_count: serpData.competitorSearch.organicResults.length,
      top_competitors: serpData.competitorSearch.organicResults.slice(0, 5).map(r => ({ title: r.title, domain: r.domain })),
      keyword_rankings: serpData.keywordRankings,
    },
    pagespeed: {
      performance_score: psiData.performanceScore,
      seo_score: psiData.seoScore,
      accessibility_score: psiData.accessibilityScore,
      best_practices_score: psiData.bestPracticesScore,
      fcp: psiData.firstContentfulPaint,
      lcp: psiData.largestContentfulPaint,
      tbt: psiData.totalBlockingTime,
      cls: psiData.cumulativeLayoutShift,
      is_mobile_friendly: psiData.isMobileFriendly,
      diagnostics: psiData.diagnostics,
      error: psiData.error || null,
    },
  };

  const systemPrompt = `You are the Kootenay Signal Check AI — an expert digital marketing analyst for local businesses in the Kootenay region of British Columbia.

You analyze website crawl data, Google search results, and PageSpeed performance data to produce a comprehensive Signal Check report.

SCORING RUBRIC:
- Visibility (20%): Is the business discoverable on Google? Does it appear in search results and local pack?
- Trust (20%): Reviews, testimonials, legitimacy signals, contact details, SSL
- Conversion (20%): Clear CTAs, booking flow, forms, landing page quality
- Local SEO (15%): Map presence, city relevance, branded search presence, schema markup
- Offer Clarity (15%): Does the site quickly explain what this business does? Clear services, messaging
- Paid Readiness (10%): Is the site ready to receive paid traffic (billboard, ads)? Landing flow, speed, mobile
- SEO (bonus): Technical SEO score from PageSpeed, meta tags, headings, alt tags, links

Each score should be 0–100.

Signal Score = weighted average: 20% Visibility + 20% Trust + 20% Conversion + 15% Local SEO + 15% Offer Clarity + 10% Paid Readiness

You MUST respond with ONLY valid JSON matching this exact structure:
{
  "signal_score": <number 0-100>,
  "visibility_score": <number 0-100>,
  "trust_score": <number 0-100>,
  "conversion_score": <number 0-100>,
  "local_presence_score": <number 0-100>,
  "offer_clarity_score": <number 0-100>,
  "paid_readiness_score": <number 0-100>,
  "seo_score": <number 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "headline": "<one punchy headline like 'Visible but Leaking Leads'>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "quick_wins": ["<actionable quick win 1>", "<quick win 2>", ...],
  "seo_issues": ["<seo issue 1>", "<seo issue 2>", ...],
  "keyword_insights": ["<insight about keyword rankings>", ...],
  "recommended_services": ["<Kootenay Signal service that would help>", ...],
  "cta_message": "<personalized pitch for why they should hire Kootenay Signal>"
}

Be honest, specific, and actionable. Reference actual findings from the data. Don't be generic.`;

  const userPrompt = `Analyze this business and produce the Signal Check report:\n\n${JSON.stringify(context, null, 2)}`;

  // If no API key, generate a fallback report based on the data
  if (!apiKey) {
    return generateFallbackReport(context);
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status);
      return generateFallbackReport(context);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return generateFallbackReport(context);
    }

    const parsed = JSON.parse(content);
    return parsed as SignalReport;
  } catch (err) {
    console.error('DeepSeek analysis error:', err);
    return generateFallbackReport(context);
  }
}

// Algorithmic fallback when no DeepSeek API key is configured
function generateFallbackReport(context: Record<string, unknown>): SignalReport {
  const site = context.site_findings as Record<string, unknown>;
  const serp = context.serp_findings as Record<string, unknown>;
  const psi = context.pagespeed as Record<string, unknown>;

  // Visibility: based on SERP presence
  const visibilityScore = Math.min(100, (
    ((serp.brand_found_in_results as boolean) ? 40 : 0) +
    ((serp.in_local_pack as boolean) ? 30 : 0) +
    ((serp.brand_search_results as number) > 3 ? 20 : 10) +
    ((serp.local_pack_results as number) > 0 ? 10 : 0)
  ));

  // Trust: testimonials, contact info, SSL, reviews
  const trustScore = Math.min(100, (
    ((site.has_testimonials as boolean) ? 25 : 0) +
    ((site.has_phone as boolean) ? 15 : 0) +
    ((site.has_email as boolean) ? 10 : 0) +
    ((site.has_address as boolean) ? 15 : 0) +
    ((site.has_ssl as boolean) ? 15 : 0) +
    ((site.social_links_count as number) > 0 ? 10 : 0) +
    ((serp.review_results as unknown[])?.length > 0 ? 10 : 0)
  ));

  // Conversion: CTAs, booking, forms
  const ctaCount = site.cta_count as number;
  const conversionScore = Math.min(100, (
    (ctaCount > 3 ? 30 : ctaCount > 0 ? 15 : 0) +
    ((site.has_booking_flow as boolean) ? 30 : 0) +
    ((site.has_phone as boolean) ? 15 : 0) +
    ((site.has_email as boolean) ? 10 : 0) +
    ((site.word_count as number) > 300 ? 15 : 5)
  ));

  // Local presence
  const localPresenceScore = Math.min(100, (
    ((serp.in_local_pack as boolean) ? 40 : 0) +
    ((site.has_schema_markup as boolean) ? 20 : 0) +
    ((site.has_address as boolean) ? 20 : 0) +
    ((serp.brand_found_in_results as boolean) ? 20 : 0)
  ));

  // Offer clarity
  const offerClarityScore = Math.min(100, (
    ((site.title as string)?.length > 10 ? 20 : 5) +
    ((site.meta_description as string)?.length > 50 ? 20 : 5) +
    ((site.headings_h1 as string[])?.length > 0 ? 20 : 0) +
    ((site.services_found as string[])?.length > 0 ? 20 : 0) +
    ((site.word_count as number) > 200 ? 20 : 10)
  ));

  // Paid readiness
  const perfScore = psi.performance_score as number || 0;
  const paidReadinessScore = Math.min(100, (
    (perfScore > 70 ? 30 : perfScore > 40 ? 15 : 5) +
    ((psi.is_mobile_friendly as boolean) ? 25 : 0) +
    (ctaCount > 0 ? 20 : 0) +
    ((site.has_ssl as boolean) ? 15 : 0) +
    ((site.has_booking_flow as boolean) ? 10 : 0)
  ));

  // SEO score
  const seoScore = Math.min(100, (
    (psi.seo_score as number || 0) * 0.4 +
    ((site.has_canonical as boolean) ? 10 : 0) +
    ((site.has_og_tags as boolean) ? 10 : 0) +
    ((site.images_with_alt as number) > (site.images_without_alt as number) ? 15 : 0) +
    ((site.meta_description as string)?.length > 50 ? 10 : 0) +
    ((site.headings_h1 as string[])?.length === 1 ? 10 : 0) +
    ((site.internal_links as number) > 5 ? 5 : 0)
  ));

  // Weighted signal score
  const signalScore = Math.round(
    visibilityScore * 0.20 +
    trustScore * 0.20 +
    conversionScore * 0.20 +
    localPresenceScore * 0.15 +
    offerClarityScore * 0.15 +
    paidReadinessScore * 0.10
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const quickWins: string[] = [];
  const seoIssues: string[] = [];

  if (site.has_ssl) strengths.push('Website has SSL/HTTPS enabled');
  if (site.has_phone) strengths.push('Phone number is visible on the website');
  if (site.has_testimonials) strengths.push('Testimonials/reviews are displayed');
  if (site.has_booking_flow) strengths.push('Online booking flow is available');
  if (serp.brand_found_in_results) strengths.push('Business appears in Google search results');
  if (serp.in_local_pack) strengths.push('Visible in Google Local Pack');

  if (!site.has_testimonials) weaknesses.push('No testimonials or reviews visible on site');
  if (!site.has_booking_flow) { weaknesses.push('No online booking or scheduling system'); quickWins.push('Add a booking/scheduling tool (Cal.com, Calendly)'); }
  if (!site.has_schema_markup) { weaknesses.push('Missing structured data (Schema markup)'); quickWins.push('Add LocalBusiness schema markup for better local SEO'); }
  if (!site.has_address) weaknesses.push('No physical address visible');
  if (ctaCount === 0) { weaknesses.push('No clear call-to-action buttons'); quickWins.push('Add prominent CTA buttons above the fold'); }
  if (!serp.in_local_pack) { weaknesses.push('Not appearing in Google Local Pack'); quickWins.push('Claim and optimize your Google Business Profile'); }
  if (perfScore < 50) { weaknesses.push(`Site speed needs improvement (Performance: ${perfScore}/100)`); quickWins.push('Optimize images and reduce render-blocking resources'); }

  if ((site.images_without_alt as number) > 0) seoIssues.push(`${site.images_without_alt} images missing alt text`);
  if (!(site.meta_description as string)) seoIssues.push('Missing meta description');
  if ((site.headings_h1 as string[])?.length === 0) seoIssues.push('Missing H1 heading');
  if ((site.headings_h1 as string[])?.length > 1) seoIssues.push(`Multiple H1 headings found (${(site.headings_h1 as string[]).length})`);
  if (!site.has_canonical) seoIssues.push('Missing canonical URL');
  if (!site.has_og_tags) seoIssues.push('Missing Open Graph tags for social sharing');

  const businessName = context.business_name as string;

  return {
    signal_score: signalScore,
    visibility_score: visibilityScore,
    trust_score: trustScore,
    conversion_score: conversionScore,
    local_presence_score: localPresenceScore,
    offer_clarity_score: offerClarityScore,
    paid_readiness_score: paidReadinessScore,
    seo_score: seoScore,
    summary: `${businessName} has a Signal Score of ${signalScore}/100. ${signalScore >= 70 ? 'The business has a solid foundation but has room for growth.' : signalScore >= 40 ? 'The business is visible but has significant gaps in trust, conversion, and local search presence.' : 'The business has critical gaps in online visibility and needs immediate attention.'}`,
    headline: signalScore >= 70 ? 'Strong Foundation, Room to Dominate' : signalScore >= 40 ? 'Visible But Leaking Leads' : 'Invisible to Your Market',
    strengths: strengths.length > 0 ? strengths : ['Website is live and accessible'],
    weaknesses,
    quick_wins: quickWins,
    seo_issues: seoIssues,
    keyword_insights: (serp.keyword_rankings as Array<Record<string, unknown>>)?.map(k =>
      k.position ? `Ranking #${k.position} for "${k.keyword}"` : `Not ranking for "${k.keyword}"`) || [],
    recommended_services: [
      signalScore < 50 ? 'SignalForge™ — Complete digital foundation rebuild' : null,
      !serp.in_local_pack ? 'SearchLock™ — Local search domination' : null,
      !site.has_booking_flow ? 'GhostOps AI™ — Automated lead capture and follow-up' : null,
      'Kootenay Broadcast™ — Total local visibility',
    ].filter(Boolean) as string[],
    cta_message: `${businessName} is ${signalScore >= 50 ? 'on the map but not dominating' : 'being missed by customers every day'}. Kootenay Signal can ${signalScore >= 50 ? 'turn your visibility into dominance' : 'fix these gaps and put you in front of every local customer'}. Book a free Signal Strategy Call to see the full plan.`,
  };
}
