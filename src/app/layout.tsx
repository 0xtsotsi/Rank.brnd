import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Rank.brnd - AI-Powered SEO Platform',
    template: '%s | Rank.brnd',
  },
  description:
    'Rank.brnd is an AI-powered SEO platform that helps you create, optimize, and publish content that ranks.',
  keywords: [
    'SEO',
    'AI content',
    'content optimization',
    'keyword research',
    'backlink exchange',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
