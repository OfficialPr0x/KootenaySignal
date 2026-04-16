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
  impact_score: number;       // 1-10, estimated signal score boost
  estimated_minutes: number;  // how long this takes to fix
  how_to_fix: string[];       // step-by-step instructions
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
      impact_score: 8, estimated_minutes: 5,
      how_to_fix: [
        'Open your website editor or CMS (WordPress, Wix, Squarespace, etc.)',
        'Find the SEO or meta settings for your homepage',
        'Write a 150-160 character description that includes your main service and location',
        'Example: "Nelson\'s trusted plumbing experts. 24/7 emergency service, drain cleaning, and water heater installation. Call (250) 555-1234 for a free quote."',
        'Save and publish — Google will pick it up within a few days',
      ],
    });
  }

  if (crawl.headings.h1.length === 0) {
    items.push({
      title: 'Add a clear H1 heading to your homepage',
      description: 'Your homepage doesn\'t have a main heading (H1). Google uses this to understand what your page is about. Make it clear and include your main service + location.',
      category: 'seo', priority: 'high', difficulty: 'easy', is_locked: false,
      impact_score: 7, estimated_minutes: 5,
      how_to_fix: [
        'Open your homepage in your website editor',
        'Find the main headline text at the top of the page',
        'Make sure it\'s set to "Heading 1" (H1) format — not just bold text',
        'Include your service + location, e.g. "Reliable Plumbing Services in Nelson, BC"',
        'Only use one H1 per page — use H2 and H3 for sub-sections',
      ],
    });
  }

  if (crawl.imagesWithoutAlt > 3) {
    items.push({
      title: `Add alt text to ${crawl.imagesWithoutAlt} images`,
      description: 'Several images on your site are missing alt text. This hurts both SEO and accessibility. Describe what\'s in each image using natural language.',
      category: 'seo', priority: 'medium', difficulty: 'easy', is_locked: false,
      impact_score: 5, estimated_minutes: 15,
      how_to_fix: [
        'Go through each image on your site in your editor',
        'Click on the image and find the "alt text" or "alternative text" field',
        'Describe what\'s in the image naturally: "Team of plumbers installing a water heater in a Nelson home"',
        'Don\'t stuff keywords — write for a person who can\'t see the image',
        'Decorative images (like dividers) can use empty alt text (alt="")',
      ],
    });
  }

  if (!crawl.canonicalUrl) {
    items.push({
      title: 'Set a canonical URL for your homepage',
      description: 'Adding a canonical tag helps Google understand which version of your URL is the "official" one. This prevents duplicate content issues.',
      category: 'seo', priority: 'medium', difficulty: 'medium', is_locked: true,
      impact_score: 4, estimated_minutes: 30,
      how_to_fix: [
        'Add a canonical link tag in your page\'s <head> section',
        'Use the preferred version of your URL (with or without www)',
        'In WordPress, install Yoast SEO — it handles this automatically',
        'Verify with Google Search Console that the right URL is indexed',
      ],
    });
  }

  // === Local Presence Actions ===
  if (!crawl.hasAddress) {
    items.push({
      title: 'Add your business address to your website',
      description: 'Your site doesn\'t show a physical address. For local businesses, having your address visible (especially in the footer) helps Google connect you to local searches.',
      category: 'local', priority: 'high', difficulty: 'easy', is_locked: false,
      impact_score: 9, estimated_minutes: 10,
      how_to_fix: [
        'Add your full street address to your website footer',
        'Include it on your Contact page as well',
        'Make sure the address exactly matches your Google Business Profile',
        'Consider adding a Google Maps embed on your contact page',
        'Format: Street Address, City, Province/State, Postal/ZIP Code',
      ],
    });
  }

  if (!crawl.hasSchemaMarkup) {
    items.push({
      title: 'Add LocalBusiness schema markup',
      description: 'Schema markup helps Google understand your business details (name, address, hours, services). This can get you rich results in search.',
      category: 'local', priority: 'high', difficulty: 'hard', is_locked: true,
      impact_score: 7, estimated_minutes: 60,
      how_to_fix: [
        'Use Google\'s Structured Data Markup Helper to generate your schema',
        'Include business name, address, phone, hours, and service area',
        'Add the JSON-LD script to your homepage\'s <head> section',
        'Test it with Google\'s Rich Results Test tool',
      ],
    });
  }

  const localPack = serp.localPack.localResults;
  const inPack = localPack.some(r => r.title.toLowerCase().includes(report.headline?.toLowerCase?.() || ''));
  if (!inPack && localPack.length > 0) {
    items.push({
      title: 'Optimize your Google Business Profile',
      description: 'You\'re not showing up in Google\'s local map pack. Make sure your Google Business Profile is claimed, complete, and has recent photos and posts.',
      category: 'local', priority: 'high', difficulty: 'medium', is_locked: false,
      impact_score: 10, estimated_minutes: 30,
      how_to_fix: [
        'Go to business.google.com and claim/verify your listing if you haven\'t',
        'Fill out EVERY field — categories, services, business description, hours',
        'Add at least 10 high-quality photos (storefront, team, work examples)',
        'Post a Google Business update at least once per week',
        'Ask 3-5 happy customers to leave a Google review this week',
        'Respond to every review — positive and negative — within 24 hours',
      ],
    });
  }

  // === Trust Actions ===
  if (!crawl.testimonials) {
    items.push({
      title: 'Add customer testimonials to your website',
      description: 'Your site doesn\'t have visible testimonials. Adding 3-5 real customer quotes with names (and photos if possible) dramatically increases trust.',
      category: 'trust', priority: 'high', difficulty: 'easy', is_locked: false,
      impact_score: 8, estimated_minutes: 20,
      how_to_fix: [
        'Reach out to 5 of your best customers and ask for a short testimonial',
        'Ask specific questions: "What problem did we solve?" and "Would you recommend us?"',
        'Get their permission to use their first name and last initial',
        'Add photos if possible — testimonials with photos are 3x more credible',
        'Place testimonials prominently on your homepage, not buried on a sub-page',
      ],
    });
  }

  if (!crawl.hasPhone) {
    items.push({
      title: 'Make your phone number visible on every page',
      description: 'Your phone number isn\'t easily found. Add it to your header or make it a sticky element. People who can see a phone number are more likely to reach out.',
      category: 'trust', priority: 'high', difficulty: 'easy', is_locked: false,
      impact_score: 8, estimated_minutes: 10,
      how_to_fix: [
        'Add your phone number to the top-right of your website header/navigation',
        'Make it a clickable "tel:" link so mobile users can tap to call',
        'Example HTML: <a href="tel:+12505551234">(250) 555-1234</a>',
        'Consider making it sticky so it stays visible while scrolling',
        'Also add it to your footer on every page',
      ],
    });
  }

  if (crawl.socialLinks.length === 0) {
    items.push({
      title: 'Link your social media profiles',
      description: 'No social media links were found. Even basic Facebook and Instagram profiles show Google (and customers) that you\'re an active, real business.',
      category: 'trust', priority: 'medium', difficulty: 'easy', is_locked: false,
      impact_score: 4, estimated_minutes: 10,
      how_to_fix: [
        'Create a Facebook Business Page and Instagram profile if you don\'t have them',
        'Add social media icon links to your website footer',
        'Make sure each profile has your correct business name, address, and phone number',
        'Post at least once a week — even a quick photo of your work',
      ],
    });
  }

  if (!crawl.hasSSL) {
    items.push({
      title: 'Enable HTTPS on your website',
      description: 'Your site isn\'t using HTTPS. Browsers show a "Not Secure" warning, which scares away customers. Most hosts offer free SSL certificates.',
      category: 'trust', priority: 'high', difficulty: 'medium', is_locked: true,
      impact_score: 9, estimated_minutes: 30,
      how_to_fix: [
        'Contact your web hosting provider — most offer free Let\'s Encrypt SSL',
        'In your hosting dashboard, look for "SSL" or "Security" settings',
        'Enable the free SSL certificate and force HTTPS redirects',
        'Test that all pages load without "mixed content" warnings',
      ],
    });
  }

  // === Conversion Actions ===
  if (crawl.ctaButtons.length < 2) {
    items.push({
      title: 'Add clear call-to-action buttons',
      description: 'Your site has very few calls to action. Add prominent "Call Now", "Get a Quote", or "Book Online" buttons. Make them visible without scrolling.',
      category: 'conversion', priority: 'high', difficulty: 'easy', is_locked: false,
      impact_score: 9, estimated_minutes: 15,
      how_to_fix: [
        'Add a prominent CTA button in your hero section (above the fold)',
        'Use action-oriented text: "Get a Free Quote", "Book Now", "Call Today"',
        'Make the button a contrasting color that stands out from your site design',
        'Add a second CTA button after your services section or testimonials',
        'Link phone CTAs to tel: links and form CTAs to your contact page',
        'Test on mobile — the buttons should be easy to tap with a thumb',
      ],
    });
  }

  if (!crawl.hasBookingFlow) {
    items.push({
      title: 'Add an online booking or contact form',
      description: 'There\'s no easy way for people to book or inquire online. Adding a simple form or booking widget captures leads 24/7, even when you can\'t answer the phone.',
      category: 'conversion', priority: 'high', difficulty: 'medium', is_locked: true,
      impact_score: 8, estimated_minutes: 45,
      how_to_fix: [
        'Add a simple contact form with: Name, Phone, Email, and Message fields',
        'Use a service like Jotform, Typeform, or your CMS\'s built-in form builder',
        'Set up email notifications so you get alerted immediately on new submissions',
        'Consider adding Calendly or Square Appointments for direct booking',
      ],
    });
  }

  if (!crawl.hasEmail) {
    items.push({
      title: 'Add a visible email address or contact form',
      description: 'Some customers prefer email over calling. Make sure there\'s an email link or contact form easily accessible on your site.',
      category: 'conversion', priority: 'medium', difficulty: 'easy', is_locked: false,
      impact_score: 5, estimated_minutes: 5,
      how_to_fix: [
        'Add a clickable email link to your contact page and footer',
        'Use a professional email (info@yourbusiness.com, not a gmail address)',
        'Example HTML: <a href="mailto:info@yourbusiness.com">info@yourbusiness.com</a>',
        'Consider adding a simple contact form as an alternative to email',
      ],
    });
  }

  // === Speed Actions ===
  if (psi.performanceScore < 50) {
    items.push({
      title: 'Your website is critically slow',
      description: `Your performance score is ${psi.performanceScore}/100. Slow sites lose visitors and rank lower on Google. This usually requires image optimization, code cleanup, and better hosting.`,
      category: 'speed', priority: 'high', difficulty: 'hard', is_locked: true,
      impact_score: 9, estimated_minutes: 120,
      how_to_fix: [
        'Run your site through GTmetrix.com to identify the biggest bottlenecks',
        'Compress and convert images to WebP format (use Squoosh.app)',
        'Enable browser caching and GZIP compression on your server',
        'Consider upgrading to faster hosting (SiteGround, Cloudways, or Vercel)',
      ],
    });
  } else if (psi.performanceScore < 75) {
    items.push({
      title: 'Improve your website loading speed',
      description: `Your performance score is ${psi.performanceScore}/100. There's room for improvement. Compressing images and reducing unused code can help.`,
      category: 'speed', priority: 'medium', difficulty: 'medium', is_locked: true,
      impact_score: 6, estimated_minutes: 60,
      how_to_fix: [
        'Compress images — this is usually the #1 speed fix for small business sites',
        'Use Squoosh.app or TinyPNG.com to optimize all images',
        'Remove any plugins, scripts, or widgets you\'re not actively using',
        'Enable lazy loading for images below the fold',
      ],
    });
  }

  if (!psi.isMobileFriendly) {
    items.push({
      title: 'Fix mobile experience issues',
      description: 'Your site isn\'t fully optimized for mobile. Over 60% of local searches happen on phones — if your site is hard to use on mobile, you\'re losing customers.',
      category: 'speed', priority: 'high', difficulty: 'hard', is_locked: true,
      impact_score: 9, estimated_minutes: 120,
      how_to_fix: [
        'Test your site on Google\'s Mobile-Friendly Test tool',
        'Ensure text is readable without zooming (16px minimum font size)',
        'Make buttons and links large enough to tap (44x44px minimum)',
        'Fix any horizontal scrolling issues on mobile',
      ],
    });
  }

  // === Content Actions ===
  if (crawl.wordCount < 300) {
    items.push({
      title: 'Add more content to your homepage',
      description: `Your homepage has only ~${crawl.wordCount} words. Google needs at least 300-500 words to understand what you do. Describe your services, your area, and why people should choose you.`,
      category: 'content', priority: 'high', difficulty: 'medium', is_locked: false,
      impact_score: 7, estimated_minutes: 30,
      how_to_fix: [
        'Add a section describing each of your main services (2-3 sentences each)',
        'Include a paragraph about your service area and the communities you serve',
        'Add a "Why choose us" section with 3-4 bullet points (experience, guarantees, etc.)',
        'Write naturally — imagine you\'re explaining your business to a new customer',
        'Target 500-800 words total on your homepage',
      ],
    });
  }

  if (crawl.services.length === 0 && crawl.headings.h2.length < 3) {
    items.push({
      title: 'List your services clearly on your site',
      description: 'Your site doesn\'t clearly list individual services. Create a section (or page) for each service you offer. This helps both customers and Google.',
      category: 'content', priority: 'high', difficulty: 'medium', is_locked: false,
      impact_score: 8, estimated_minutes: 30,
      how_to_fix: [
        'Create a "Services" section on your homepage with clear headings for each service',
        'Use H2 headings for each service name',
        'Write 2-3 sentences describing each service and what makes yours different',
        'Consider creating individual pages for your top 3-5 services',
        'Include your service area in the descriptions (e.g. "plumbing services in Nelson and the Kootenays")',
      ],
    });
  }

  if (Object.keys(crawl.ogTags).length === 0) {
    items.push({
      title: 'Add social sharing tags (Open Graph)',
      description: 'When someone shares your site on Facebook or LinkedIn, it won\'t show a preview image or description. Adding OG tags takes 5 minutes and makes shared links look professional.',
      category: 'content', priority: 'low', difficulty: 'easy', is_locked: false,
      impact_score: 3, estimated_minutes: 10,
      how_to_fix: [
        'Add Open Graph meta tags to your homepage\'s <head> section',
        'Include og:title, og:description, and og:image tags',
        'Use a 1200x630px image for og:image (your logo or a professional photo)',
        'Test with Facebook\'s Sharing Debugger (developers.facebook.com/tools/debug/)',
      ],
    });
  }

  // Always add a few "growth" items (locked) to show what's possible
  items.push({
    title: 'Build a content strategy for local SEO',
    description: 'Creating regular blog posts or service pages targeting "[your service] in [your city]" keywords can dramatically increase organic traffic over time.',
    category: 'content', priority: 'medium', difficulty: 'hard', is_locked: true,
    impact_score: 8, estimated_minutes: 180,
    how_to_fix: [
      'Identify 10 keywords your customers search for (use Google\'s autocomplete)',
      'Create one blog post or service page per keyword per month',
      'Each page should be 500+ words with local references and photos',
      'Interlink your pages — link each service page to related services',
    ],
  });

  items.push({
    title: 'Set up Google Ads for high-intent keywords',
    description: 'Capture people actively searching for your services right now. A well-managed ad campaign can deliver new customers within days, not months.',
    category: 'conversion', priority: 'medium', difficulty: 'hard', is_locked: true,
    impact_score: 7, estimated_minutes: 120,
    how_to_fix: [
      'Create a Google Ads account and set a daily budget ($10-20/day to start)',
      'Target high-intent keywords like "[your service] near me" and "[your service] [your city]"',
      'Write compelling ad copy with a clear CTA and your phone number',
      'Set up conversion tracking to measure which ads drive real calls and leads',
    ],
  });

  items.push({
    title: 'Build backlinks from local directories',
    description: 'Getting listed on local business directories, chamber of commerce sites, and industry-specific listings boosts your authority with Google.',
    category: 'seo', priority: 'medium', difficulty: 'hard', is_locked: true,
    impact_score: 6, estimated_minutes: 90,
    how_to_fix: [
      'Claim your listing on Yelp, Yellow Pages, and your local Chamber of Commerce',
      'Submit to industry-specific directories (e.g., HomeAdvisor, Houzz for contractors)',
      'Ensure your Name, Address, Phone (NAP) is consistent across all listings',
      'Ask business partners or suppliers to link to your website',
    ],
  });

  return items;
}
