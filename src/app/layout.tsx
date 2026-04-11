import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Vollkorn } from 'next/font/google';
import './globals.css';

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
  title: 'Kootenay Signal | Digital Growth for Local Kootenay Business',
  description: 'The Kootenay\'s Go-To agency for high-conversion web development, AI infrastructure, and local-first marketing.',
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
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
