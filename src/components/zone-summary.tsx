import { formatDistance, type ErgZones } from '@/lib/erg';

/** 지도·Zone 하단의 거리 요약. 거리 수치가 없는 물질에는 수치를 보여주지 않는다. */
export function ZoneSummary({ zones, guide, summary }: { zones: ErgZones | null; guide?: string; summary?: string }) {
  if (!zones) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
        <p className="text-sm text-slate-700">이 물질은 거리 수치가 등록되어 있지 않습니다. ERG 지침 {guide ?? '—'} 본문을 확인하세요.</p>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-2 text-center">
          <p className="text-xs text-rose-600 font-semibold">초기 이격 (전 방향)</p>
          <p className="text-sm font-bold text-rose-700">{formatDistance(zones.isolationM)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-2 text-center">
          <p className="text-xs text-amber-600 font-semibold">풍하 방호활동</p>
          <p className="text-sm font-bold text-amber-700">{zones.protectiveM ? formatDistance(zones.protectiveM) : '표 없음'}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500">근거: {zones.basis}</p>
      {zones.source === 'guide' && summary && <p className="text-xs text-slate-600">지침 권고: {summary}</p>}
      {zones.fireIsolationM && <p className="text-xs text-slate-600">화재 시 전 방향 {formatDistance(zones.fireIsolationM)} 격리</p>}
      <p className="text-xs text-slate-400">초기 대응용 기준입니다. 실제 통제선은 측정값·지형·지휘관 판단으로 조정하세요.</p>
    </div>
  );
}
