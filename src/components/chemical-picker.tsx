'use client';

import { useMemo, useState } from 'react';
import { CHEMICALS } from '@/lib/chemicals-data';

/** 지도·Zone 공용 물질 선택. value '' = 미확인 물질(ERG 지침 111) */
export function ChemicalPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const selected = CHEMICALS.find((c) => c.id === value);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CHEMICALS;
    return CHEMICALS.filter(
      (c) =>
        c.name_ko.includes(s) ||
        c.name_en.toLowerCase().includes(s) ||
        c.synonyms.some((syn) => syn.toLowerCase().includes(s)) ||
        c.un_number?.toLowerCase().includes(s) ||
        c.cas_number.includes(s),
    );
  }, [q]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setQ('');
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-left flex items-center gap-2 shadow-sm"
      >
        <span className="text-base">🧪</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400">선택 물질</p>
          <p className="text-sm font-semibold text-slate-800 truncate">
            {selected ? `${selected.name_ko} · ERG ${selected.res_protocol.erg_guide_number ?? '—'}` : '미확인 물질 (ERG 지침 111)'}
          </p>
        </div>
        <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="rounded-xl bg-white border border-slate-200 p-2 max-h-52 overflow-y-auto space-y-0.5 shadow-sm">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="물질명 · UN · CAS"
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none mb-1"
          />
          <button
            onClick={() => pick('')}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm ${value === '' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            미확인 물질 (ERG 지침 111)
          </button>
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c.id)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm flex justify-between gap-2 ${value === c.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="truncate">{c.name_ko}</span>
              <span className="shrink-0 text-xs text-slate-400 font-mono">
                {c.un_number ?? ''} · {c.res_protocol.erg_guide_number ?? '—'}
              </span>
            </button>
          ))}
          <p className="px-3 pt-1 text-xs text-slate-400">목록에 없는 물질은 미확인 물질로 두고 지휘관이 판단하세요.</p>
        </div>
      )}
    </div>
  );
}

/** ?chem= 값이 id 또는 한글명이어도 id 로 맞춘다 */
export function resolveChemParam(param: string | null): string {
  if (!param) return '';
  const hit = CHEMICALS.find((c) => c.id === param || c.name_ko === param);
  return hit?.id ?? '';
}

export function SpillDayNightToggle({
  spill,
  dayNight,
  onSpill,
  onDayNight,
  disabled,
}: {
  spill: 'small' | 'large';
  dayNight: 'day' | 'night';
  onSpill: (s: 'small' | 'large') => void;
  onDayNight: (d: 'day' | 'night') => void;
  disabled?: boolean;
}) {
  const btn = (active: boolean) =>
    `flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${active ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`;
  return (
    <div className={`grid grid-cols-2 gap-2 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex gap-1">
        <button className={btn(spill === 'small')} onClick={() => onSpill('small')}>소량 ≤208L</button>
        <button className={btn(spill === 'large')} onClick={() => onSpill('large')}>대량</button>
      </div>
      <div className="flex gap-1">
        <button className={btn(dayNight === 'day')} onClick={() => onDayNight('day')}>낮</button>
        <button className={btn(dayNight === 'night')} onClick={() => onDayNight('night')}>밤</button>
      </div>
    </div>
  );
}
