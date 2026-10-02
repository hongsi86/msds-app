import type { Chemical } from '@/lib/types';
import { formatDistance, getErgZones } from '@/lib/erg';
import { UnPlate } from '@/components/un-plate';

// 상세 첫 화면, 스크롤 없이 보이는 한 장: 절대 금지 → PPE·초기 이격 → 물 반응·BLEVE.
// 머리띠는 ERG 책자의 주황색 지침 페이지를 따랐다(현장 대원이 이미 아는 모양).

export function CoreCard({ chemical }: { chemical: Chemical }) {
  const res = chemical.res_protocol;
  const small = getErgZones(chemical, { spill: 'small', dayNight: 'day' });
  const large = getErgZones(chemical, { spill: 'large', dayNight: 'day' });
  const fromTable = small?.source === 'table';
  const prohibitions = res.absolute_prohibitions.slice(0, 2);

  return (
    <section aria-label="진입 전 핵심" className="overflow-hidden rounded-xl border-2 border-slate-900 bg-white">
      <div className="flex items-center justify-between gap-3 bg-erg px-3 py-1.5 text-erg-ink">
        <span className="font-placard text-2xl font-bold leading-none tracking-wide">
          {res.erg_guide_number ? `ERG 지침 ${res.erg_guide_number}` : 'ERG 지침 미지정'}
        </span>
        {chemical.un_number && <UnPlate un={chemical.un_number} />}
      </div>

      {prohibitions.length > 0 && (
        <div className="bg-hazard px-3 py-2.5 text-hazard-ink">
          <p className="mb-1 text-sm font-bold opacity-90">절대 금지</p>
          <ul className="space-y-1">
            {prohibitions.map((p) => (
              <li key={p} className="flex gap-2 text-lg font-bold leading-snug">
                <span aria-hidden>✕</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-[auto_1fr] divide-x divide-slate-300">
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-slate-600">보호복</p>
          <p className="font-placard text-5xl font-bold leading-none text-slate-900">
            <span className="text-2xl">레벨 </span>
            {res.ppe_level}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-slate-600">초기 이격 (전 방향)</p>
          {small && large ? (
            fromTable ? (
              <p className="flex flex-wrap items-baseline gap-x-4 font-placard font-bold leading-none text-slate-900 tabular">
                <span>
                  <span className="text-base font-semibold text-slate-600">소량 </span>
                  <span className="text-4xl">{formatDistance(small.isolationM)}</span>
                </span>
                <span>
                  <span className="text-base font-semibold text-slate-600">대량 </span>
                  <span className="text-4xl">{formatDistance(large.isolationM)}</span>
                </span>
              </p>
            ) : (
              <p className="font-placard text-4xl font-bold leading-none text-slate-900 tabular">
                {formatDistance(small.isolationM)}
                <span className="ml-1 text-base font-semibold text-slate-600">지침 권고</span>
              </p>
            )
          ) : (
            <p className="text-base font-semibold text-slate-800">ERG 지침 본문 확인</p>
          )}
        </div>
      </div>

      {(res.water_reactive || res.bleve_risk || small?.fireIsolationM) && (
        <div className="flex flex-wrap gap-2 border-t border-slate-300 px-3 py-2">
          {res.water_reactive && (
            <span className="rounded-md bg-caution px-2 py-1 text-sm font-bold text-caution-ink">물 반응 — 직접 주수 주의</span>
          )}
          {res.bleve_risk && (
            <span className="rounded-md bg-caution px-2 py-1 text-sm font-bold text-caution-ink">
              BLEVE 위험{res.bleve_evacuation_m ? ` · 대피 ${formatDistance(res.bleve_evacuation_m)}` : ''}
            </span>
          )}
          {small?.fireIsolationM && (
            <span className="rounded-md border border-slate-400 px-2 py-1 text-sm font-semibold text-slate-800">
              화재 시 전 방향 {formatDistance(small.fireIsolationM)}
            </span>
          )}
        </div>
      )}

      <p className="border-t border-slate-200 px-3 py-1.5 text-xs text-slate-500">
        {fromTable ? 'ERG 2024 표1' : 'ERG 2024 지침 권고'} · 낮/밤 방호거리는 구조 탭·지도
      </p>
    </section>
  );
}
