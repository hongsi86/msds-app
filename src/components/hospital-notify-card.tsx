'use client';

import { useMemo, useState } from 'react';
import type { Chemical } from '@/lib/types';
import type { GeoPoint } from '@/lib/weather';

interface Props {
  chemical: Chemical;
  position?: GeoPoint;
  onToast?: (msg: string) => void;
}

interface Exposure {
  inhalation: boolean;
  skin: boolean;
  eye: boolean;
  ingestion: boolean;
}

const ROUTE_LABEL: Record<keyof Exposure, string> = {
  inhalation: '흡입',
  skin: '피부',
  eye: '눈',
  ingestion: '섭취',
};

function buildMessage({
  chemical,
  patients,
  exposure,
  etaMin,
  position,
  note,
}: {
  chemical: Chemical;
  patients: number;
  exposure: Exposure;
  etaMin: number;
  position?: GeoPoint;
  note: string;
}): string {
  const routes = (Object.keys(exposure) as (keyof Exposure)[])
    .filter((k) => exposure[k])
    .map((k) => ROUTE_LABEL[k])
    .join(' · ');
  const erg = chemical.res_protocol.erg_guide_number ? `/ ERG ${chemical.res_protocol.erg_guide_number}` : '';
  const loc = position
    ? `위도 ${position.lat.toFixed(4)}, 경도 ${position.lon.toFixed(4)}`
    : '위치 확인 중';
  const now = new Date();
  const stamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return [
    '[ChemGuard 응급실 사전 통보]',
    `물질: ${chemical.name_ko} (${chemical.name_en})`,
    `CAS: ${chemical.cas_number}${chemical.un_number ? ` / ${chemical.un_number}` : ''} ${erg}`.trim(),
    `위험: ${chemical.danger_level}등급 / ${chemical.hazard_class}`,
    `환자: ${patients}명${routes ? ` (${routes})` : ''}`,
    `ETA: ${etaMin}분`,
    `위치: ${loc}`,
    `시각: ${stamp}`,
    note.trim() ? `비고: ${note.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export function HospitalNotifyCard({ chemical, position, onToast }: Props) {
  const [patients, setPatients] = useState<number>(1);
  const [etaMin, setEtaMin] = useState<number>(10);
  const [note, setNote] = useState('');
  const [exposure, setExposure] = useState<Exposure>({
    inhalation: true,
    skin: false,
    eye: false,
    ingestion: false,
  });

  const message = useMemo(
    () => buildMessage({ chemical, patients, exposure, etaMin, position, note }),
    [chemical, patients, exposure, etaMin, position, note]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      onToast?.('통보 문안 복사됨');
    } catch {
      onToast?.('복사 실패 — 길게 눌러 직접 복사하세요');
    }
  };

  const sendSms = () => {
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: 'ChemGuard 사전 통보', text: message });
        return;
      } catch {
        /* fall through */
      }
    }
    onToast?.('공유 미지원 — 복사 후 카카오톡에 붙여넣으세요');
  };

  const toggle = (key: keyof Exposure) => setExposure({ ...exposure, [key]: !exposure[key] });

  return (
    <div className="mt-4 rounded-lg bg-white border border-slate-200 p-3 shadow-sm">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
        🏥 응급실 사전 통보
      </p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-[10px] text-slate-500">환자 수</label>
          <input
            type="number"
            value={patients}
            min={0}
            onChange={(e) => setPatients(Number(e.target.value))}
            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500">ETA(분)</label>
          <input
            type="number"
            value={etaMin}
            min={0}
            onChange={(e) => setEtaMin(Number(e.target.value))}
            className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[10px] text-slate-500 mb-1">노출 경로</p>
        <div className="grid grid-cols-4 gap-1">
          {(Object.keys(ROUTE_LABEL) as (keyof Exposure)[]).map((key) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`rounded px-2 py-1 text-[11px] font-medium border ${
                exposure[key]
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {ROUTE_LABEL[key]}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="비고(의식 수준, 처치 진행 상태 등)"
        rows={2}
        className="w-full rounded border border-slate-200 px-2 py-1 text-xs mb-2"
      />

      <pre className="whitespace-pre-wrap text-xs text-slate-800 bg-rose-50 border border-rose-100 rounded p-3 font-mono leading-relaxed mb-2">
{message}
      </pre>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={copy} className="rounded bg-slate-800 text-white px-2 py-2 text-xs font-medium">
          복사
        </button>
        <button onClick={shareNative} className="rounded bg-yellow-500 text-slate-900 px-2 py-2 text-xs font-medium">
          공유(카톡)
        </button>
        <button onClick={sendSms} className="rounded bg-emerald-600 text-white px-2 py-2 text-xs font-medium">
          SMS
        </button>
      </div>
    </div>
  );
}
