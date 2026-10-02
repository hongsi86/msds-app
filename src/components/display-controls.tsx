'use client';

import { useSyncExternalStore } from 'react';
import { notifyDisplay, readDisplay, setScale, setTheme, subscribeDisplay, THEMES, type Scale } from '@/lib/display';

const SCALE_NEXT: Record<Scale, Scale> = { '0': '1', '1': '2', '2': '0' };
const SCALE_LABEL: Record<Scale, string> = { '0': '가', '1': '가+', '2': '가++' };

/** 헤더용: 화면 모드 한 번 누를 때마다 주간→야간→고대비, 글자 크기 3단계 */
export function DisplayControls() {
  const snap = useSyncExternalStore(
    subscribeDisplay,
    () => `${readDisplay().theme}|${readDisplay().scale}`,
    () => 'day|0',
  );
  const [theme, scale] = snap.split('|') as [string, Scale];
  const idx = THEMES.findIndex((t) => t.key === theme);
  const next = THEMES[(idx + 1) % THEMES.length];
  const current = THEMES[idx] ?? THEMES[0];

  return (
    <div className="flex shrink-0 items-center gap-1.5" suppressHydrationWarning>
      <button
        onClick={() => {
          setTheme(next.key);
          notifyDisplay();
        }}
        aria-label={`화면 모드: ${current.label}. 누르면 ${next.label}`}
        className="min-w-14 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-semibold text-slate-800"
      >
        {current.label}
      </button>
      <button
        onClick={() => {
          setScale(SCALE_NEXT[scale]);
          notifyDisplay();
        }}
        aria-label="글자 크기 바꾸기"
        className="min-w-12 rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-slate-800"
      >
        {SCALE_LABEL[scale]}
      </button>
    </div>
  );
}
