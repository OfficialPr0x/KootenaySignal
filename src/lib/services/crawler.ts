import * as cheerio from 'cheerio';

export interface CrawlResult {
  url: string;
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  ctaButtons: string[];
  services: string[];
  testimonials: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasAddress: boolean;
  hasBookingFlow: boolean;
  hasSchemaMarkup: boolean;
  socialLinks: string[];
  imageCount: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  hasSSL: boolean;
  wordCount: number;
  metaKeywords: string;
  canonicalUrl: string;
  ogTags: Record<string, string>;
  robotsMeta: string;
  error?: string;
}

export async function crawlWebsite(url: string): Promise<CrawlResult> {
  const result: CrawlResult = {
    url,
    title: '',
    metaDescription: '',
    headings: { h1: [], h2: [], h3: [] },
    ctaButtons: [],
    services: [],
    testimonials: false,
    hasPhone: false,
    hasEmail: false,
    hasAddress: false,
    hasBookingFlow: false,
    hasSchemaMarkup: false,
    socialLinks: [],
    imageCount: 0,
    imagesWithAlt: 0,
    imagesWithoutAlt: 0,
    internalLinks: 0,
    externalLinks: 0,
    hasSSL: url.startsWith('https'),
    wordCount: 0,
    metaKeywords: '',
    canonicalUrl: '',
    ogTags: {},
    robotsMeta: '',
  };

  try {
    // Normalize URL
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'KootenaySignalBot/1.0 (+https://kootenaysignal.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Title
    result.title = $('title').first().text().trim();

    // Meta description
    result.metaDescription = $('meta[name="description"]').attr('content') || '';

    // Meta keywords
    result.metaKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Canonical
    result.canonicalUrl = $('link[rel="canonical"]').attr('href') || '';

    // Robots meta
    result.robotsMeta = $('meta[name="robots"]').attr('content') || '';

    // OG tags
    $('meta[property^="og:"]').each((_, el) => {
      const prop = $(el).attr('property') || '';
      const content = $(el).attr('content') || '';
      result.ogTags[prop] = content;
    });

    // Headings
    $('h1').each((_, el) => { result.headings.h1.push($(el).text().trim()); });
    $('h2').each((_, el) => { result.headings.h2.push($(el).text().trim()); });
    $('h3').each((_, el) => { result.headings.h3.push($(el).text().trim()); });

    // CTA buttons
    const ctaPattern = /book|call|contact|schedule|free|quote|get started|sign up|request|buy|order/i;
    $('a, button').each((_, el) => {
      const text = $(el).text().trim();
      if (ctaPattern.test(text) && text.length < 100) {
        result.ctaButtons.push(text);
      }
    });

    // Check for phone
    const bodyText = $('body').text();
    result.hasPhone = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(bodyText) ||
      $('a[href^="tel:"]').length > 0;

    // Check for email
    result.hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(bodyText) ||
      $('a[href^="mailto:"]').length > 0;

    // Check for address
    result.hasAddress = /\b(street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd|suite|ste|unit)\b/i.test(bodyText) ||
      $('[itemtype*="PostalAddress"]').length > 0;

    // Testimonials
    result.testimonials = /testimonial|review|client says|what (our|my) (clients|customers)/i.test(bodyText) ||
      $('[class*="testimonial"], [class*="review"], [id*="testimonial"], [id*="review"]').length > 0;

    // Booking flow
    result.hasBookingFlow = /book(ing)?|appointment|schedule|calendly|acuity|cal\.com/i.test(html);

    // Schema markup
    result.hasSchemaMarkup = $('script[type="application/ld+json"]').length > 0;

    // Social links
    const socialDomains = ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'linkedin.com', 'youtube.com', 'tiktok.com'];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      for (const domain of socialDomains) {
        if (href.includes(domain)) {
          result.socialLinks.push(href);
          break;
        }
      }
    });

    // Images
    const images = $('img');
    result.imageCount = images.length;
    images.each((_, el) => {
      if ($(el).attr('alt')?.trim()) {
        result.imagesWithAlt++;
      } else {
        result.imagesWithoutAlt++;
      }
    });

    // Links
    const baseHost = new URL(normalizedUrl).hostname;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      try {
        if (href.startsWith('/') || href.startsWith('#') || new URL(href).hostname === baseHost) {
          result.internalLinks++;
        } else if (href.startsWith('http')) {
          result.externalLinks++;
        }
      } catch {
        result.internalLinks++;
      }
    });

    // Word count
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    result.wordCount = textContent.split(' ').filter(w => w.length > 0).length;

    // Services (from headings and list items in service-related sections)
    $('h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (/service|what we (do|offer)|our work/i.test(text)) {
        $(el).nextAll('ul, ol').first().find('li').each((_, li) => {
          result.services.push($(li).text().trim());
        });
      }
    });

  } catch (err: unknown) {
    result.error = err instanceof Error ? err.message : 'Crawl failed';
  }

  return result;
}
