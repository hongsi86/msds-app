'use client';

import { useMemo, useState } from 'react';
import type { Chemical } from '@/lib/types';
import { useClientNow } from '@/lib/use-client-now';
import { composeRadio, type IncidentContext, type RadioKind } from '@/lib/radio-template';
import type { GeoPoint, WeatherSnapshot } from '@/lib/weather';

interface Props {
  chemical: Chemical;
  position?: GeoPoint;
  weather?: WeatherSnapshot;
  onToast?: (msg: string) => void;
}

const TABS: { key: RadioKind; label: string }[] = [
  { key: 'initial', label: '초기 보고' },
  { key: 'update', label: '상황 변경' },
  { key: 'closing', label: '종료 보고' },
];

const toNum = (v: string) => (v.trim() === '' ? undefined : Math.max(0, Number(v)) || 0);

export function RadioCard({ chemical, position, weather, onToast }: Props) {
  const [kind, setKind] = useState<RadioKind>('initial');
  const now = useClientNow();
  // 기본값을 채워 두면 확인하지 않은 숫자가 무전으로 나간다 — 빈 칸은 "확인 중" 으로 적는다
  const [spillVolumeL, setSpillVolumeL] = useState('');
  const [patientsExposed, setPatientsExposed] = useState('');
  const [patientsTransport, setPatientsTransport] = useState('');
  const [hospitalNotified, setHospitalNotified] = useState(false);
  const [changedSince, setChangedSince] = useState('');
  const [closingSummary, setClosingSummary] = useState('');

  const text = useMemo(() => {
    const ctx: IncidentContext = {
      chemical,
      position,
      weather,
      reportedAt: now ?? undefined,
      spillVolumeL: toNum(spillVolumeL),
      patientsExposed: toNum(patientsExposed),
      patientsTransport: toNum(patientsTransport),
      hospitalNotified,
      changedSince: changedSince.trim() || undefined,
      closingSummary: closingSummary.trim() || undefined,
    };
    // 서버 렌더와 시각이 달라 화면이 어긋나지 않게, 브라우저에서 시각을 읽은 뒤에 문안을 만든다
    return now ? composeRadio(kind, ctx) : '';
  }, [now, chemical, position, weather, kind, spillVolumeL, patientsExposed, patientsTransport, hospitalNotified, changedSince, closingSummary]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onToast?.('무전 문안 복사됨');
    } catch {
      onToast?.('복사 실패 — 길게 눌러 직접 복사하세요');
    }
  };

  return (
    <div className="mt-4 rounded-lg bg-white border border-slate-200 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">📻 표준 무전 양식</p>
        <button onClick={copy} className="text-xs text-blue-700 hover:underline">복사</button>
      </div>

      <div className="flex gap-1 mb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setKind(t.key)}
            className={`flex-1 rounded px-2 py-1.5 text-xs font-medium border ${
              kind === t.key
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {kind === 'initial' && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <label className="text-xs text-slate-500 col-span-1 self-center">누출량(L)</label>
          <input
            type="number"
            inputMode="numeric"
            value={spillVolumeL}
            placeholder="모르면 비움"
            onChange={(e) => setSpillVolumeL(e.target.value)}
            className="col-span-2 rounded border border-slate-200 px-2 py-1 text-xs"
          />
          <label className="text-xs text-slate-500 col-span-1 self-center">노출 환자</label>
          <input
            type="number"
            inputMode="numeric"
            value={patientsExposed}
            placeholder="노출"
            onChange={(e) => setPatientsExposed(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-xs"
          />
          <input
            type="number"
            inputMode="numeric"
            value={patientsTransport}
            onChange={(e) => setPatientsTransport(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-xs"
            placeholder="이송"
          />
          <label className="col-span-3 flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={hospitalNotified}
              onChange={(e) => setHospitalNotified(e.target.checked)}
              className="h-5 w-5"
            />
            응급실 사전 통보 했음
          </label>
        </div>
      )}

      {kind === 'update' && (
        <textarea
          value={changedSince}
          onChange={(e) => setChangedSince(e.target.value)}
          placeholder="변경 사항(예: 누출량 증가, 환자 추가, 풍향 변경 등)"
          rows={2}
          className="w-full rounded border border-slate-200 px-2 py-1 text-xs mb-3"
        />
      )}

      {kind === 'closing' && (
        <textarea
          value={closingSummary}
          onChange={(e) => setClosingSummary(e.target.value)}
          placeholder="종료 요약(예: 누출 통제, 환자 모두 인계, 환경 측정 종료)"
          rows={2}
          className="w-full rounded border border-slate-200 px-2 py-1 text-xs mb-3"
        />
      )}

      <pre className="whitespace-pre-wrap text-xs text-slate-800 bg-slate-50 border border-slate-100 rounded p-3 font-mono leading-relaxed">
{text}
      </pre>
    </div>
  );
}
