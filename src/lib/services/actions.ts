import { SignalReport } from './deepseek';
import { CrawlResult } from './crawler';
import { SerpResult } from './serp';
import { PSIResult } from './pagespeed';

interface ActionItem {
  title: string;
  description: string;
  category: string;
  priority: string;
  difficulty: string;
  is_locked: boolean;
}

export function generateActionItems(
  report: SignalReport,
  crawl: CrawlResult,
  serp: SerpResult,
  psi: PSIResult
): ActionItem[] {
  const items: ActionItem[] = [];

  // === SEO Actions ===
  if (!crawl.metaDescription) {
    items.push({
      title: 'Add a meta description to your homepage',
      description: 'Your site is missing a meta description. This is the short text that appears under your site name in Google results. A good one can increase clicks by 30%.',
      category: 'seo', priority: 'high', difficulty: 'easy', is_locked: false,
    });
  }

  if (crawl.headings.h1.length === 0) {
    items.push({
      title: 'Add a clear H1 heading to your homepage',
      description: 'Your homepage doesn\'t have a main heading (H1). Google uses this to understand what your page is about. Make it clear and include your main service + location.',
      category: 'seo', priority: 'high', difficulty: 'easy', is_locked: false,
    });
  }

  if (crawl.imagesWithoutAlt > 3) {
    items.push({
      title: `Add alt text to ${crawl.imagesWithoutAlt} images`,
      description: 'Several images on your site are missing alt text. This hurts both SEO and accessibility. Describe what\'s in each image using natural language.',
      category: 'seo', priority: 'medium', difficulty: 'easy', is_locked: false,
    });
  }

  if (!crawl.canonicalUrl) {
    items.push({
      title: 'Set a canonical URL for your homepage',
      description: 'Adding a canonical tag helps Google understand which version of your URL is the "official" one. This prevents duplicate content issues.',
      category: 'seo', priority: 'medium', difficulty: 'medium', is_locked: true,
    });
  }

  // === Local Presence Actions ===
  if (!crawl.hasAddress) {
    items.push({
      title: 'Add your business address to your website',
      description: 'Your site doesn\'t show a physical address. For local businesses, having your address visible (especially in the footer) helps Google connect you to local searches.',
      category: 'local', priority: 'high', difficulty: 'easy', is_locked: false,
    });
  }

  if (!crawl.hasSchemaMarkup) {
    items.push({
      title: 'Add LocalBusiness schema markup',
      description: 'Schema markup helps Google understand your business details (name, address, hours, services). This can get you rich results in search.',
      category: 'local', priority: 'high', difficulty: 'hard', is_locked: true,
    });
  }

  const localPack = serp.localPack.localResults;
  const inPack = localPack.some(r => r.title.toLowerCase().includes(report.headline?.toLowerCase?.() || ''));
  if (!inPack && localPack.length > 0) {
    items.push({
      title: 'Optimize your Google Business Profile',
      description: 'You\'re not showing up in Google\'s local map pack. Make sure your Google Business Profile is claimed, complete, and has recent photos and posts.',
      category: 'local', priority: 'high', difficulty: 'medium', is_locked: false,
    });
  }

  // === Trust Actions ===
  if (!crawl.testimonials) {
    items.push({
      title: 'Add customer testimonials to your website',
      description: 'Your site doesn\'t have visible testimonials. Adding 3-5 real customer quotes with names (and photos if possible) dramatically increases trust.',
      category: 'trust', priority: 'high', difficulty: 'easy', is_locked: false,
    });
  }

  if (!crawl.hasPhone) {
    items.push({
      title: 'Make your phone number visible on every page',
      description: 'Your phone number isn\'t easily found. Add it to your header or make it a sticky element. People who can see a phone number are more likely to reach out.',
      category: 'trust', priority: 'high', difficulty: 'easy', is_locked: false,
    });
  }

  if (crawl.socialLinks.length === 0) {
    items.push({
      title: 'Link your social media profiles',
      description: 'No social media links were found. Even basic Facebook and Instagram profiles show Google (and customers) that you\'re an active, real business.',
      category: 'trust', priority: 'medium', difficulty: 'easy', is_locked: false,
    });
  }

  if (!crawl.hasSSL) {
    items.push({
      title: 'Enable HTTPS on your website',
      description: 'Your site isn\'t using HTTPS. Browsers show a "Not Secure" warning, which scares away customers. Most hosts offer free SSL certificates.',
      category: 'trust', priority: 'high', difficulty: 'medium', is_locked: true,
    });
  }

  // === Conversion Actions ===
  if (crawl.ctaButtons.length < 2) {
    items.push({
      title: 'Add clear call-to-action buttons',
      description: 'Your site has very few calls to action. Add prominent "Call Now", "Get a Quote", or "Book Online" buttons. Make them visible without scrolling.',
      category: 'conversion', priority: 'high', difficulty: 'easy', is_locked: false,
    });
  }

  if (!crawl.hasBookingFlow) {
    items.push({
      title: 'Add an online booking or contact form',
      description: 'There\'s no easy way for people to book or inquire online. Adding a simple form or booking widget captures leads 24/7, even when you can\'t answer the phone.',
      category: 'conversion', priority: 'high', difficulty: 'medium', is_locked: true,
    });
  }

  if (!crawl.hasEmail) {
    items.push({
      title: 'Add a visible email address or contact form',
      description: 'Some customers prefer email over calling. Make sure there\'s an email link or contact form easily accessible on your site.',
      category: 'conversion', priority: 'medium', difficulty: 'easy', is_locked: false,
    });
  }

  // === Speed Actions ===
  if (psi.performanceScore < 50) {
    items.push({
      title: 'Your website is critically slow',
      description: `Your performance score is ${psi.performanceScore}/100. Slow sites lose visitors and rank lower on Google. This usually requires image optimization, code cleanup, and better hosting.`,
      category: 'speed', priority: 'high', difficulty: 'hard', is_locked: true,
    });
  } else if (psi.performanceScore < 75) {
    items.push({
      title: 'Improve your website loading speed',
      description: `Your performance score is ${psi.performanceScore}/100. There's room for improvement. Compressing images and reducing unused code can help.`,
      category: 'speed', priority: 'medium', difficulty: 'medium', is_locked: true,
    });
  }

  if (!psi.isMobileFriendly) {
    items.push({
      title: 'Fix mobile experience issues',
      description: 'Your site isn\'t fully optimized for mobile. Over 60% of local searches happen on phones — if your site is hard to use on mobile, you\'re losing customers.',
      category: 'speed', priority: 'high', difficulty: 'hard', is_locked: true,
    });
  }

  // === Content Actions ===
  if (crawl.wordCount < 300) {
    items.push({
      title: 'Add more content to your homepage',
      description: `Your homepage has only ~${crawl.wordCount} words. Google needs at least 300-500 words to understand what you do. Describe your services, your area, and why people should choose you.`,
      category: 'content', priority: 'high', difficulty: 'medium', is_locked: false,
    });
  }

  if (crawl.services.length === 0 && crawl.headings.h2.length < 3) {
    items.push({
      title: 'List your services clearly on your site',
      description: 'Your site doesn\'t clearly list individual services. Create a section (or page) for each service you offer. This helps both customers and Google.',
      category: 'content', priority: 'high', difficulty: 'medium', is_locked: false,
    });
  }

  if (Object.keys(crawl.ogTags).length === 0) {
    items.push({
      title: 'Add social sharing tags (Open Graph)',
      description: 'When someone shares your site on Facebook or LinkedIn, it won\'t show a preview image or description. Adding OG tags takes 5 minutes and makes shared links look professional.',
      category: 'content', priority: 'low', difficulty: 'easy', is_locked: false,
    });
  }

  // Always add a few "growth" items (locked) to show what's possible
  items.push({
    title: 'Build a content strategy for local SEO',
    description: 'Creating regular blog posts or service pages targeting "[your service] in [your city]" keywords can dramatically increase organic traffic over time.',
    category: 'content', priority: 'medium', difficulty: 'hard', is_locked: true,
  });

  items.push({
    title: 'Set up Google Ads for high-intent keywords',
    description: 'Capture people actively searching for your services right now. A well-managed ad campaign can deliver new customers within days, not months.',
    category: 'conversion', priority: 'medium', difficulty: 'hard', is_locked: true,
  });

  items.push({
    title: 'Build backlinks from local directories',
    description: 'Getting listed on local business directories, chamber of commerce sites, and industry-specific listings boosts your authority with Google.',
    category: 'seo', priority: 'medium', difficulty: 'hard', is_locked: true,
  });

  return items;
}
