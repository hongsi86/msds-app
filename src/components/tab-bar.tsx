'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

// 한 손 엄지로 닿는 하단 고정 탭바. 모든 기능이 여기서 1번, 물질·직군까지 3번 안에 닿는다.
// 물질을 보던 중이면 지도·Zone 으로 그 물질을 들고 간다(?chem=).

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const ICONS: Record<string, ReactNode> = {
  search: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.8-4.8" /></svg>
  ),
  vision: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3" /><rect x="8" y="9" width="8" height="6" rx="1" /></svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M9 4 3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5L9 4Z" /><path d="M9 4v13.5M15 6.5V20" /></svg>
  ),
  zone: (
    // 초기 이격·방호 구역을 뜻하는 동심원
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="5.5" /><circle cx="12" cy="12" r="9" strokeDasharray="2.5 2.5" /></svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM8.5 11.5h7M8.5 15.5h5" /></svg>
  ),
};

const TABS = [
  { href: '/', label: '검색', icon: 'search', match: (p: string) => p === '/' || p.startsWith('/chemical') },
  { href: '/vision', label: '식별', icon: 'vision', match: (p: string) => p.startsWith('/vision') },
  { href: '/map', label: '지도', icon: 'map', match: (p: string) => p.startsWith('/map'), carriesChem: true },
  { href: '/zone', label: 'Zone', icon: 'zone', match: (p: string) => p.startsWith('/zone'), carriesChem: true },
  { href: '/dashboard', label: '상황판', icon: 'board', match: (p: string) => p.startsWith('/dashboard') },
];

/** 지금 보고 있는 물질 id: /chemical/염소 또는 ?chem= */
function currentChem(pathname: string): string | null {
  const m = pathname.match(/^\/chemical\/([^/]+)/);
  if (m) return m[1];
  return new URLSearchParams(window.location.search).get('chem');
}

export function TabBar({ offlineSlot }: { offlineSlot?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname.startsWith('/dashboard/report-preview')) return null;

  const go = (e: MouseEvent, href: string, carriesChem?: boolean) => {
    if (!carriesChem) return;
    const chem = currentChem(pathname);
    if (!chem) return;
    e.preventDefault();
    router.push(`${href}?chem=${encodeURIComponent(chem)}`);
  };

  return (
    <nav
      aria-label="주요 기능"
      className="fixed inset-x-0 bottom-0 z-[900] border-t border-slate-300 bg-white print:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {offlineSlot}
      <ul className="mx-auto flex h-16 max-w-xl">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                onClick={(e) => go(e, t.href, t.carriesChem)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 text-sm ${
                  active ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
                }`}
              >
                {active && <span className="absolute inset-x-3 top-0 h-1 rounded-b bg-erg" aria-hidden />}
                <span className="h-6 w-6" aria-hidden>{ICONS[t.icon]}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
