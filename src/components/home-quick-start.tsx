'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { CHEMICALS, getChemicalById } from '@/lib/chemicals-data';
import { parseRecent, readRecentRaw } from '@/lib/recent';
import type { Chemical } from '@/lib/types';
import { UnPlate } from '@/components/un-plate';

// 검색어가 없을 때의 첫 화면: 최근 연 물질 타일 + UN 번호 숫자판.
// 장갑 낀 손으로 키보드를 띄우지 않고 두 번 안에 물질 카드에 닿게 한다.

const COMMON = ['chlorine', 'ammonia', 'sulfuric-acid', 'hydrochloric-acid', 'hydrogen-fluoride', 'carbon-monoxide'];
const noop = () => () => {};

function ChemTile({ c }: { c: Chemical }) {
  return (
    <Link
      href={`/chemical/${c.id}`}
      className="flex min-h-20 flex-col justify-between gap-2 rounded-xl border border-slate-300 bg-white p-3 active:bg-slate-100"
    >
      <span className="text-base font-bold leading-snug text-slate-900">{c.name_ko}</span>
      <span className="flex items-center justify-between gap-2">
        <UnPlate un={c.un_number} />
        <span className="font-placard text-lg font-bold text-slate-700">PPE {c.res_protocol.ppe_level}</span>
      </span>
    </Link>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '지움', '0', '⌫'];

export function HomeQuickStart({ onAskAi }: { onAskAi: (q: string) => void }) {
  const raw = useSyncExternalStore(noop, readRecentRaw, () => '');
  const recent = parseRecent(raw).map(getChemicalById).filter(Boolean) as Chemical[];
  const tiles = recent.length ? recent : (COMMON.map(getChemicalById).filter(Boolean) as Chemical[]);
  const [digits, setDigits] = useState('');

  const press = (k: string) => {
    if (k === '지움') setDigits('');
    else if (k === '⌫') setDigits((d) => d.slice(0, -1));
    else setDigits((d) => (d.length < 4 ? d + k : d));
  };

  const matches = digits
    ? CHEMICALS.filter((c) => c.un_number?.replace(/^UN/i, '').startsWith(digits)).slice(0, 4)
    : [];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-bold text-slate-600">{recent.length ? '최근 본 물질' : '자주 찾는 물질'}</h2>
        <div className="grid grid-cols-2 gap-2">
          {tiles.slice(0, 6).map((c) => (
            <ChemTile key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section aria-label="UN 번호로 찾기">
        <h2 className="mb-2 text-sm font-bold text-slate-600">UN 번호로 찾기 — 차량·용기 주황색 표지판의 아래 숫자</h2>
        <div className="mb-3 flex justify-center">
          <UnPlate un={digits.padEnd(4, '·')} size="lg" />
        </div>

        {digits && (
          <div className="mb-3 space-y-2">
            {matches.map((c) => (
              <Link
                key={c.id}
                href={`/chemical/${c.id}`}
                className="flex min-h-14 items-center justify-between rounded-xl bg-slate-900 px-4 text-base font-bold text-white"
              >
                <span>
                  {c.un_number} {c.name_ko}
                </span>
                <span aria-hidden>→</span>
              </Link>
            ))}
            {digits.length === 4 && matches.length === 0 && (
              <div className="rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700">
                <p>
                  검증 데이터에 UN{digits}가 없습니다. ERG 책자 노란색 페이지에서 지침 번호를 확인하십시오.
                </p>
                <button
                  onClick={() => onAskAi(`UN${digits}`)}
                  className="mt-2 w-full rounded-lg border border-amber-400 bg-amber-50 font-semibold text-amber-800"
                >
                  AI로 물질명 찾아보기
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              aria-label={k === '⌫' ? '한 자리 지우기' : k === '지움' ? '모두 지우기' : k}
              className={`h-14 rounded-xl border border-slate-300 bg-white text-slate-900 active:bg-slate-200 ${
                /\d/.test(k) ? 'font-placard text-3xl font-bold' : 'text-base font-semibold'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </section>

      <Link
        href="/guide"
        className="flex min-h-12 items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-800"
      >
        물질을 모를 때 — 현장 대응 일반 원칙
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
