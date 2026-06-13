import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Vollkorn } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Navbar from "@/components/Navbar";

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne'
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pjs'
});

const vollkorn = Vollkorn({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '800'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kootenaysignal.com'),
  title: 'Kootenay Signal | I Help Kootenay Businesses Get More Business',
  description: 'More calls. More jobs. Less guesswork. I help local Kootenay businesses get found, get chosen, and never miss a lead. Based in Sparwood, serving the Kootenays.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    images: ['https://res.cloudinary.com/doajstql7/image/upload/q_auto/f_auto/v1775887668/ChatGPT_Image_Apr_11_2026_02_07_33_AM_y2qtos.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://res.cloudinary.com/doajstql7/image/upload/q_auto/f_auto/v1775887668/ChatGPT_Image_Apr_11_2026_02_07_33_AM_y2qtos.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${plusJakarta.variable} ${vollkorn.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
      </head>
      <body style={{ margin: 0 }}>
        <ClerkProvider>
          <Navbar />
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
