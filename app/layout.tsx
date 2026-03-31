import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Use Checker — Should I use AI for this?',
  description:
    'A practical decision-support tool for students and teachers in higher education. Find out whether a specific use of AI is acceptable, uncertain, or inappropriate.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 min-h-screen antialiased">
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <Nav />
          <main>{children}</main>
          <footer className="mt-16 pt-6 border-t border-stone-200 text-xs text-stone-400 flex justify-between flex-wrap gap-2">
            <span>AI Use Checker — guidance only, not an official institutional ruling.</span>
            <span>No data stored. All processing happens in your browser.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
