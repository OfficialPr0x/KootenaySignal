import type { Metadata } from 'next';

const PAGE_URL = 'https://www.kootenaysignal.com/case-studies/black-timber-contracting';
const OG_IMAGE = 'https://res.cloudinary.com/dkc1pmbma/image/upload/q_auto/f_auto/v1781487645/ChatGPT_Image_Jun_14_2026_07_40_38_PM_z0yz24.png';
const LOGO = 'https://res.cloudinary.com/doajstql7/image/upload/v1777003162/f3d21215-ada9-4ea3-b86d-510a6885c8f5-removebg-preview_uat1ay.png';
const PUBLISHED = '2026-06-13T00:00:00-06:00';
const MODIFIED = '2026-06-14T00:00:00-06:00';

const TITLE = 'Black Timber Contracting: An AI-Powered Contractor System | Kootenay Signal';
const DESCRIPTION =
  'Quotes, e-signatures, leads, AI bookkeeping, and an ops assistant — all under one roof. See the complete AI-powered system Kootenay Signal built for Black Timber Contracting: a $15,000+ build graded 9.4/10 against the source code.';

const OG_ALT =
  'Black Timber Contracting — an AI-powered contractor system by Kootenay Signal: quotes, e-signatures, leads, bookkeeping, and an ops assistant, all under one roof.';

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
    title: 'Black Timber Contracting — Built With an AI-Powered Contractor System',
    description:
      'Quotes. E-signatures. Leads. Bookkeeping. An ops assistant. All under one roof. See the full contractor system Kootenay Signal built — and how it stacks up against the way contractors operate today.',
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
        width: 1536,
        height: 864,
        alt: OG_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Timber Contracting — Built With an AI-Powered Contractor System',
    description:
      'Quotes, e-sign, leads, AI bookkeeping & an ops assistant — all under one roof. The contractor system Kootenay Signal built for Black Timber, graded 9.4/10 against the source code.',
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
