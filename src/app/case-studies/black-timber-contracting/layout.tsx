import type { Metadata } from 'next';

const PAGE_URL = 'https://www.kootenaysignal.com/case-studies/black-timber-contracting';
const OG_IMAGE = 'https://res.cloudinary.com/doajstql7/image/upload/q_auto/f_auto/v1777520127/ChatGPT_Image_Apr_29_2026_09_27_06_PM_jd81sf.png';
const LOGO = 'https://res.cloudinary.com/doajstql7/image/upload/v1777003162/f3d21215-ada9-4ea3-b86d-510a6885c8f5-removebg-preview_uat1ay.png';
const PUBLISHED = '2026-06-13T00:00:00-06:00';
const MODIFIED = '2026-06-13T00:00:00-06:00';

const TITLE = 'Black Timber Contracting Case Study | Kootenay Signal';
const DESCRIPTION =
  'See how Kootenay Signal turned Black Timber Contracting into a conversion-first website with 5 customer-facing AI tools, an 18-chapter field guide, and a full back-office system — a $15,000+ build, graded 9.4/10 against the source code.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'contractor website design',
    'AI website for contractors',
    'Kootenay web design',
    'contractor marketing BC',
    'web design Sparwood',
    'web design Fernie',
    'web design Cranbrook',
    'Next.js contractor website',
    'lead generation for contractors',
    'AI quote tool',
    'construction website case study',
    'Black Timber Contracting',
    'Kootenay Signal',
  ],
  authors: [{ name: 'Kootenay Signal', url: 'https://www.kootenaysignal.com' }],
  creator: 'Kootenay Signal',
  publisher: 'Kootenay Signal',
  category: 'Case Study',
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Black Timber Contracting — Built by Kootenay Signal',
    description:
      'Not a contractor website — a revenue machine that books the job, prices it, signs it, and files the paperwork. Five AI tools, a full back-office OS, and a 9.4/10 build scorecard.',
    url: PAGE_URL,
    siteName: 'Kootenay Signal',
    type: 'article',
    locale: 'en_CA',
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ['https://www.kootenaysignal.com'],
    section: 'Case Studies',
    tags: ['Contractor Website', 'AI Tools', 'Web Design', 'Kootenays', 'Lead Generation'],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Black Timber Contracting case study by Kootenay Signal — graded 9.4 out of 10',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Timber Contracting — Built by Kootenay Signal',
    description:
      'A conversion-first contractor site with 5 AI tools and a full back-office OS. A $15,000+ build, graded 9.4/10 against the source code.',
    images: [OG_IMAGE],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.kootenaysignal.com/#organization',
      name: 'Kootenay Signal',
      url: 'https://www.kootenaysignal.com',
      logo: LOGO,
      description:
        'Brand, web, marketing systems, and applied AI for contractors and trades in the Kootenays.',
      areaServed: {
        '@type': 'GeoShape',
        name: 'Kootenays, British Columbia',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sparwood',
        addressRegion: 'BC',
        addressCountry: 'CA',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.kootenaysignal.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Black Timber Contracting Case Study',
          item: PAGE_URL,
        },
      ],
    },
    {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'Black Timber Contracting — Agency Case Study',
      description: DESCRIPTION,
      image: [OG_IMAGE],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      inLanguage: 'en-CA',
      isAccessibleForFree: true,
      author: { '@id': 'https://www.kootenaysignal.com/#organization' },
      publisher: { '@id': 'https://www.kootenaysignal.com/#organization' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
      about: {
        '@type': 'WebSite',
        name: 'Black Timber Contracting',
        url: 'https://www.blacktimber.ca',
        description:
          'A rugged premium Kootenay contractor serving Fernie, Sparwood, Elkford, Cranbrook, and Nelson, BC.',
      },
      keywords:
        'contractor website, AI tools for contractors, web design, Kootenays, lead generation, Next.js',
    },
  ],
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </>
  );
}
