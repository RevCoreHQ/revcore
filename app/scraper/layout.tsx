import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RevCore Scraper',
  robots: 'noindex,nofollow',
};

export default function ScraperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
