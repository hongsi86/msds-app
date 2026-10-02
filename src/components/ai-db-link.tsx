'use client';

import Link from 'next/link';
import { matchAiCandidate } from '@/lib/ai/match';

/**
 * AI 후보 아래에 붙는 다음 행동. 검증 데이터에 있으면 그 카드로 보내고,
 * 없으면 AI 가 조치를 대신 말하지 않고 공식 자료로 안내한다.
 */
export function AiDbLink({ cas, name }: { cas?: string; name?: string }) {
  const chem = matchAiCandidate({ cas, name });
  if (chem) {
    return (
      <Link
        href={`/chemical/${chem.id}`}
        className="flex min-h-12 items-center justify-between rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
      >
        <span>검증 카드 열기 — {chem.name_ko}</span>
        <span aria-hidden>→</span>
      </Link>
    );
  }
  return (
    <p className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
      검증 데이터에 없는 물질입니다. 응급처치·거리는{' '}
      <a href="https://msds.kosha.or.kr" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
        KOSHA MSDS
      </a>
      ·ERG 책자·의료지도로 확인하십시오.
    </p>
  );
}
