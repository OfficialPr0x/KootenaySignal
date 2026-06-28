import type { Metadata } from 'next';

const OG_IMAGE = 'https://res.cloudinary.com/doajstql7/image/upload/v1776285464/ChatGPT_Image_Apr_12_2026_11_04_25_PM_xi7ewb.png';

export const metadata: Metadata = {
  title: 'Talk With Jaryd — Book Your Free Strategy Call | Kootenay Signal',
  description: 'Three quick questions, then pick a time. A free 30-minute call with Jaryd to map out how to get your Kootenay business more calls, more jobs, and less guesswork.',
  openGraph: {
    title: 'Talk With Jaryd — Book Your Free Strategy Call',
    description: 'Answer 3 quick questions and book a free 30-minute strategy call with Jaryd. No pressure, no fluff — just a clear plan to grow your business.',
    url: 'https://www.kootenaysignal.com/talk-with-jaryd',
    siteName: 'Kootenay Signal',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Talk With Jaryd — Kootenay Signal' }],
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talk With Jaryd — Book Your Free Strategy Call',
    description: 'Answer 3 quick questions and book a free 30-minute strategy call with Jaryd.',
    images: [OG_IMAGE],
  },
};

export default function TalkWithJarydLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
