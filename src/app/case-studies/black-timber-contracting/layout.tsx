import type { Metadata } from 'next';

const OG_IMAGE = 'https://res.cloudinary.com/doajstql7/image/upload/q_auto/f_auto/v1777520127/ChatGPT_Image_Apr_29_2026_09_27_06_PM_jd81sf.png';

export const metadata: Metadata = {
  title: 'Black Timber Contracting — Case Study | Kootenay Signal',
  description:
    'A full teardown of what we built for Black Timber Contracting: a conversion-first website, five customer-facing AI tools, an 18-chapter field guide, and a complete back-office operating system. A $15,000+ build, graded 9.4/10 against the source code.',
  openGraph: {
    title: 'Black Timber Contracting — Built by Kootenay Signal',
    description:
      'Not a contractor website — a revenue machine that books the job, prices it, signs it, and files the paperwork. See the build, the AI tools, and the 9.4/10 scorecard.',
    url: 'https://www.kootenaysignal.com/case-studies/black-timber-contracting',
    siteName: 'Kootenay Signal',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Black Timber Contracting — Case Study by Kootenay Signal',
      },
    ],
    type: 'article',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Timber Contracting — Built by Kootenay Signal',
    description:
      'A conversion-first contractor site with five AI tools and a full back-office OS. Graded 9.4/10 against the source code.',
    images: [OG_IMAGE],
  },
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
