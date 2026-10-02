import type { Metadata } from 'next';
import Link from 'next/link';
import { CHEMICALS } from '@/lib/chemicals-data';

export const metadata: Metadata = { title: '오프라인 — ChemGuard' };

// 서비스워커가 저장해 두지 않은 화면을 오프라인에서 열었을 때 보여준다
export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-lg space-y-5">
        <div>
          <h1 className="text-lg font-bold text-slate-900">📡 인터넷에 연결되어 있지 않습니다</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            이 화면은 기기에 저장되어 있지 않습니다. 물질 검색과 아래 물질별 대응 정보는 오프라인에서도 열립니다.
            AI 추정·사진 식별·지도 배경·기상 정보는 연결이 필요합니다.
          </p>
        </div>

        <Link href="/" className="block rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white">
          물질 검색으로
        </Link>

        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {CHEMICALS.map((c) => (
            <li key={c.id}>
              <Link href={`/chemical/${c.id}`} className="flex items-center justify-between gap-2 px-4 py-3 text-sm hover:bg-slate-50">
                <span className="font-medium text-slate-800">{c.name_ko}</span>
                <span className="font-mono text-xs text-slate-400">
                  {c.un_number ?? ''} · ERG {c.res_protocol.erg_guide_number ?? '—'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
