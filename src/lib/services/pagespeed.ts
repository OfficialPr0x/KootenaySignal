export interface PSIResult {
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  firstContentfulPaint: string;
  largestContentfulPaint: string;
  totalBlockingTime: string;
  cumulativeLayoutShift: string;
  speedIndex: string;
  isMobileFriendly: boolean;
  diagnostics: string[];
  error?: string;
}

export async function runPageSpeedInsights(url: string): Promise<PSIResult> {
  const result: PSIResult = {
    performanceScore: 0,
    seoScore: 0,
    accessibilityScore: 0,
    bestPracticesScore: 0,
    firstContentfulPaint: '',
    largestContentfulPaint: '',
    totalBlockingTime: '',
    cumulativeLayoutShift: '',
    speedIndex: '',
    isMobileFriendly: false,
    diagnostics: [],
  };

  try {
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Use Google's free PageSpeed Insights API (no key required for basic use)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalizedUrl)}&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      result.error = `PSI API error: ${response.status}`;
      return result;
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
      result.error = 'No Lighthouse data returned';
      return result;
    }

    // Scores (0-1 from API, convert to 0-100)
    result.performanceScore = Math.round((lighthouse.categories?.performance?.score || 0) * 100);
    result.seoScore = Math.round((lighthouse.categories?.seo?.score || 0) * 100);
    result.accessibilityScore = Math.round((lighthouse.categories?.accessibility?.score || 0) * 100);
    result.bestPracticesScore = Math.round((lighthouse.categories?.['best-practices']?.score || 0) * 100);

    // Core Web Vitals
    const audits = lighthouse.audits || {};
    result.firstContentfulPaint = audits['first-contentful-paint']?.displayValue || '';
    result.largestContentfulPaint = audits['largest-contentful-paint']?.displayValue || '';
    result.totalBlockingTime = audits['total-blocking-time']?.displayValue || '';
    result.cumulativeLayoutShift = audits['cumulative-layout-shift']?.displayValue || '';
    result.speedIndex = audits['speed-index']?.displayValue || '';

    // Mobile friendly check
    result.isMobileFriendly = result.seoScore >= 80;

    // Key diagnostics
    const diagnosticAudits = [
      'render-blocking-resources',
      'uses-responsive-images',
      'unminified-css',
      'unminified-javascript',
      'unused-css-rules',
      'unused-javascript',
      'uses-text-compression',
      'uses-optimized-images',
    ];

    for (const auditKey of diagnosticAudits) {
      const audit = audits[auditKey];
      if (audit && audit.score !== null && audit.score < 1) {
        result.diagnostics.push(`${audit.title}: ${audit.displayValue || 'Needs improvement'}`);
      }
    }

  } catch (err: unknown) {
    result.error = err instanceof Error ? err.message : 'PSI check failed';
  }

  return result;
}
