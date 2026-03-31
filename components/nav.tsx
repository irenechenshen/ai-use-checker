'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/checker', label: 'Checker' },
  { href: '/scenarios', label: 'Examples' },
  { href: '/teacher', label: 'For Teachers' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-4 border-b border-stone-200 mb-8 flex-wrap gap-3">
      <Link href="/" className="flex items-center gap-2 font-semibold text-stone-900 hover:text-stone-700 transition-colors">
        <span className="bg-blue-700 text-white w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0">
          AI
        </span>
        AI Use Checker
      </Link>

      <div className="flex gap-1 flex-wrap">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-white'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
