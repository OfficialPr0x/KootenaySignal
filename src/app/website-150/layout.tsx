import type { Metadata } from 'next';

const OG_IMAGE = 'https://res.cloudinary.com/doajstql7/image/upload/q_auto/f_auto/v1777520127/ChatGPT_Image_Apr_29_2026_09_27_06_PM_jd81sf.png';

export const metadata: Metadata = {
  title: 'Professional Website for $150 — Kootenay Signal',
  description: 'A handcrafted 5-page website built in 7 days, designed for local businesses in the Kootenays. No templates. No monthly fees. Just a site that gets you found.',
  openGraph: {
    title: 'Professional Website for $150 — Kootenay Signal',
    description: 'A handcrafted 5-page website built in 7 days. No templates. No monthly fees. Just a site that gets your Kootenay business found.',
    url: 'https://kootensaysignal.ca/website-150',
    siteName: 'Kootenay Signal',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Kootenay Signal — $150 Website for Local Businesses',
      },
    ],
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Website for $150 — Kootenay Signal',
    description: 'A handcrafted 5-page website built in 7 days. No monthly fees. Gets your local business found online.',
    images: [OG_IMAGE],
  },
};

export default function Website150Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
