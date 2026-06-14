'use client';

import { useEffect, useState } from 'react';
import {
  degToCompass16,
  fetchWeather,
  getCurrentLocation,
  windDownwindDeg,
  type GeoPoint,
  type WeatherSnapshot,
} from '@/lib/weather';

type Phase = 'idle' | 'locating' | 'fetching' | 'ready' | 'manual' | 'error';

interface Manual {
  windDir: number;
  windSpeed: number;
}

interface Props {
  onChange?: (snapshot: { position?: GeoPoint; weather?: WeatherSnapshot }) => void;
}

const COMPASS_OPTIONS = [
  { deg: 0, label: '북' },
  { deg: 45, label: '북동' },
  { deg: 90, label: '동' },
  { deg: 135, label: '남동' },
  { deg: 180, label: '남' },
  { deg: 225, label: '남서' },
  { deg: 270, label: '서' },
  { deg: 315, label: '북서' },
];

export function SiteConditionsBar({ onChange }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [manual, setManual] = useState<Manual>({ windDir: 0, windSpeed: 3 });

  useEffect(() => {
    onChange?.({
      position: position ?? undefined,
      weather: weather ?? undefined,
    });
  }, [position, weather, onChange]);

  const runAuto = async () => {
    setError(null);
    setPhase('locating');
    try {
      const point = await getCurrentLocation();
      setPosition(point);
      setPhase('fetching');
      const snap = await fetchWeather(point);
      setWeather(snap);
      setPhase('ready');
    } catch (e) {
      setError((e as Error).message);
      setPhase('error');
    }
  };

  const applyManual = () => {
    const snap: WeatherSnapshot = {
      wind_direction_deg: manual.windDir,
      wind_speed_ms: manual.windSpeed,
      observed_at: new Date().toISOString(),
      source: 'manual',
    };
    setWeather(snap);
    setPhase('manual');
  };

  return (
    <div className="rounded-lg bg-white border border-slate-200 p-3 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">현장 조건</p>
        {phase !== 'ready' && phase !== 'manual' && (
          <button
            onClick={runAuto}
            className="text-[11px] text-blue-700 hover:underline"
          >
            {phase === 'locating' ? '위치 확인 중…' : phase === 'fetching' ? '기상청 조회 중…' : '자동 측정'}
          </button>
        )}
        {(phase === 'ready' || phase === 'manual') && (
          <button onClick={runAuto} className="text-[11px] text-slate-500 hover:text-slate-700">
            새로고침
          </button>
        )}
      </div>

      {weather && position && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 leading-tight">위치</p>
            <p className="font-mono text-slate-700 text-[11px]">
              {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 leading-tight">관측 시각</p>
            <p className="font-mono text-slate-700 text-[11px]">{weather.observed_at}</p>
          </div>
          <div className="rounded bg-blue-50 border border-blue-100 px-2 py-1.5">
            <p className="text-[10px] text-blue-700 leading-tight font-semibold">풍향</p>
            <p className="text-sm font-bold text-blue-800">
              {degToCompass16(weather.wind_direction_deg)} ({weather.wind_direction_deg}°)
            </p>
          </div>
          <div className="rounded bg-emerald-50 border border-emerald-100 px-2 py-1.5">
            <p className="text-[10px] text-emerald-700 leading-tight font-semibold">풍속</p>
            <p className="text-sm font-bold text-emerald-800">{weather.wind_speed_ms} m/s</p>
          </div>
          <div className="col-span-2 rounded bg-amber-50 border border-amber-100 px-2 py-1.5">
            <p className="text-[10px] text-amber-700 leading-tight font-semibold">풍하 방향(대피·확산)</p>
            <p className="text-sm font-bold text-amber-800">
              {degToCompass16(windDownwindDeg(weather.wind_direction_deg))} 측 (
              {windDownwindDeg(weather.wind_direction_deg)}°)
            </p>
          </div>
          <p className="col-span-2 text-[10px] text-slate-400">
            출처: {weather.source === 'kma' ? '기상청 단기실황' : '수동 입력'}
          </p>
        </div>
      )}

      {!weather && phase !== 'error' && (
        <p className="text-xs text-slate-500">
          자동 측정 버튼을 누르거나, 아래에서 수동 입력하세요.
        </p>
      )}

      {phase === 'error' && error && (
        <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2 mb-2">
          {error}
        </div>
      )}

      {(phase === 'error' || phase === 'idle' || phase === 'manual') && (
        <div className="mt-3 border-t border-slate-100 pt-3 space-y-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">수동 입력</p>
          <div className="grid grid-cols-4 gap-1">
            {COMPASS_OPTIONS.map((opt) => (
              <button
                key={opt.deg}
                onClick={() => setManual({ ...manual, windDir: opt.deg })}
                className={`rounded px-2 py-1 text-[11px] font-medium border ${
                  manual.windDir === opt.deg
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-500 shrink-0">풍속</label>
            <input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={manual.windSpeed}
              onChange={(e) => setManual({ ...manual, windSpeed: Number(e.target.value) })}
              className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs"
            />
            <span className="text-[11px] text-slate-400">m/s</span>
            <button
              onClick={applyManual}
              className="rounded bg-slate-800 text-white px-3 py-1 text-xs font-medium"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
