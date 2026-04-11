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
    icon: 'https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png',
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
