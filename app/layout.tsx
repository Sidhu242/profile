import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.vercel.app'),
  title: 'Portfolio | Data Analyst & Web Developer',
  description: 'Personal portfolio showcasing data analytics, web development projects, and professional experience.',
  keywords: ['portfolio', 'data analyst', 'web developer', 'projects', 'skills'],
  authors: [{ name: 'Portfolio Owner' }],
  openGraph: {
    type: 'website',
    title: 'Portfolio | Data Analyst & Web Developer',
    description: 'Personal portfolio showcasing data analytics, web development projects, and professional experience.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Data Analyst & Web Developer',
    description: 'Personal portfolio showcasing data analytics, web development projects, and professional experience.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
