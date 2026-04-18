'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ZoneData {
  hot: number;
  warm: number;
  cold: number;
  windSpread: number;
  note?: string;
}

const ERG_ZONES: Record<string, ZoneData> = {
  '기본값':        { hot: 25,  warm: 50,  cold: 100, windSpread: 2.0, note: '미확인 물질 — 보수적 접근' },
  '황산':          { hot: 25,  warm: 50,  cold: 100, windSpread: 1.5 },
  '염산':          { hot: 30,  warm: 60,  cold: 100, windSpread: 2.0 },
  '암모니아':      { hot: 30,  warm: 100, cold: 200, windSpread: 2.5, note: '가스 누출 시 풍하방향 800m 확대 고려' },
  '염소':          { hot: 60,  warm: 200, cold: 400, windSpread: 3.0, note: '소량 누출도 넓은 격리 필요' },
  '황화수소':      { hot: 30,  warm: 100, cold: 300, windSpread: 2.5, note: '무취감지점(100ppm) 이상 시 즉시 대피' },
  '톨루엔':        { hot: 25,  warm: 50,  cold: 100, windSpread: 1.5 },
  '불화수소':      { hot: 30,  warm: 100, cold: 200, windSpread: 2.5, note: 'HF — 극소량도 치명적, 최대 격리' },
  '시안화수소':    { hot: 60,  warm: 200, cold: 400, windSpread: 3.0, note: 'HCN — 즉시 치명, 최대 격리' },
  '일산화탄소':    { hot: 25,  warm: 50,  cold: 100, windSpread: 2.0 },
  '메탄올':        { hot: 25,  warm: 50,  cold: 100, windSpread: 1.5 },
  '벤젠':          { hot: 30,  warm: 60,  cold: 150, windSpread: 2.0 },
  '포스겐':        { hot: 100, warm: 300, cold: 600, windSpread: 3.0, note: 'COCl₂ — 지연성 폐부종, 최대 격리' },
  '가솔린':        { hot: 50,  warm: 100, cold: 200, windSpread: 2.0, note: '화재·폭발 위험 — 점화원 제거' },
  '휘발유':        { hot: 50,  warm: 100, cold: 200, windSpread: 2.0, note: '화재·폭발 위험 — 점화원 제거' },
  'LPG':           { hot: 100, warm: 200, cold: 400, windSpread: 2.5, note: '폭발 위험 — BLEVE 가능' },
  'LNG':           { hot: 100, warm: 200, cold: 400, windSpread: 2.5, note: '극저온 + 폭발 위험' },
  '수산화나트륨':  { hot: 10,  warm: 25,  cold: 50,  windSpread: 1.0, note: '비휘발성 — 접촉 위험 위주' },
  '과산화수소':    { hot: 25,  warm: 50,  cold: 100, windSpread: 1.5 },
  '포름알데히드':  { hot: 25,  warm: 50,  cold: 100, windSpread: 2.0 },
  '아세톤':        { hot: 25,  warm: 50,  cold: 100, windSpread: 1.5 },
  '자일렌':        { hot: 25,  warm: 50,  cold: 100, windSpread: 1.5 },
  '질산':          { hot: 30,  warm: 60,  cold: 150, windSpread: 2.0, note: 'NOx 발생 가능 — 갈색 연기 주의' },
};

const CHEMICAL_LIST = Object.keys(ERG_ZONES).filter(k => k !== '기본값');

const WIND_DIRS = [
  { label: 'N',  labelKo: '북',   deg: 0 },
  { label: 'NE', labelKo: '북동', deg: 45 },
  { label: 'E',  labelKo: '동',   deg: 90 },
  { label: 'SE', labelKo: '남동', deg: 135 },
  { label: 'S',  labelKo: '남',   deg: 180 },
  { label: 'SW', labelKo: '남서', deg: 225 },
  { label: 'W',  labelKo: '서',   deg: 270 },
  { label: 'NW', labelKo: '북서', deg: 315 },
] as const;

function getZoneInfo(distance: number, zone: ZoneData, windAngle: number, facingAngle: number) {
  const downwind = (windAngle + 180) % 360;
  let angleDiff = Math.abs(facingAngle - downwind);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;
  const isDownwind = angleDiff <= 60;
  const multiplier = isDownwind ? zone.windSpread : 1.0;

  const hotDist = zone.hot * multiplier;
  const warmDist = zone.warm * multiplier;
  const coldDist = zone.cold * multiplier;

  if (distance <= hotDist) return { zone: 'HOT', color: '#dc2626', bgColor: 'rgba(220,38,38,0.20)', label: 'HOT ZONE — 즉시위험구역', hotDist, warmDist, coldDist, isDownwind };
  if (distance <= warmDist) return { zone: 'WARM', color: '#ea580c', bgColor: 'rgba(234,88,12,0.15)', label: 'WARM ZONE — 제독/대기구역', hotDist, warmDist, coldDist, isDownwind };
  if (distance <= coldDist) return { zone: 'COLD', color: '#2563eb', bgColor: 'rgba(37,99,235,0.12)', label: 'COLD ZONE — 안전구역 경계', hotDist, warmDist, coldDist, isDownwind };
  return { zone: 'SAFE', color: '#16a34a', bgColor: 'rgba(22,163,74,0.10)', label: '안전거리 — 격리구역 외부', hotDist, warmDist, coldDist, isDownwind };
}

export default function ZonePage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center"><span className="text-slate-400 text-sm">로딩 중...</span></div>}>
      <ZoneContent />
    </Suspense>
  );
}

interface RefObject { id: string; label: string; icon: string; heightCm: number; }

const REFERENCE_OBJECTS: RefObject[] = [
  { id: 'person', label: '사람', icon: '🧍', heightCm: 170 },
  { id: 'car', label: '승용차', icon: '🚗', heightCm: 150 },
  { id: 'truck', label: '화물차', icon: '🚛', heightCm: 350 },
  { id: 'barrel', label: '드럼통', icon: '🛢', heightCm: 90 },
  { id: 'door', label: '문', icon: '🚪', heightCm: 200 },
];

const CAMERA_VFOV_DEG = 55;
const CAMERA_VFOV_RAD = (CAMERA_VFOV_DEG * Math.PI) / 180;

function estimateDistance(objectHeightCm: number, barHeightPx: number, viewHeightPx: number): number {
  if (barHeightPx <= 0 || viewHeightPx <= 0) return 999;
  const angleRatio = barHeightPx / viewHeightPx;
  const objectAngleRad = angleRatio * CAMERA_VFOV_RAD;
  const dist = (objectHeightCm / 100 / 2) / Math.tan(objectAngleRad / 2);
  return Math.max(1, Math.round(dist));
}

function DistanceMeasureBar({ onDistanceChange, viewHeight }: { onDistanceChange: (d: number) => void; viewHeight: number }) {
  const [active, setActive] = useState(false);
  const [refObj, setRefObj] = useState(REFERENCE_OBJECTS[0]);
  const [barTop, setBarTop] = useState(0.3);
  const [barBottom, setBarBottom] = useState(0.7);
  const [dragging, setDragging] = useState<'top' | 'bottom' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const barHeightPx = (barBottom - barTop) * viewHeight;

  useEffect(() => {
    if (!active) return;
    const dist = estimateDistance(refObj.heightCm, barHeightPx, viewHeight);
    onDistanceChange(Math.min(500, dist));
  }, [active, barTop, barBottom, refObj, barHeightPx, viewHeight, onDistanceChange]);

  const handlePointerDown = useCallback((handle: 'top' | 'bottom') => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
    if (dragging === 'top' && ratio < barBottom - 0.05) setBarTop(ratio);
    if (dragging === 'bottom' && ratio > barTop + 0.05) setBarBottom(ratio);
  }, [dragging, barTop, barBottom]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="absolute top-16 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur shadow-md px-3 py-2 text-slate-700 border border-slate-200"
      >
        <span className="text-sm">📏</span>
        <span className="text-xs font-semibold">거리 측정</span>
      </button>
    );
  }

  const dist = estimateDistance(refObj.heightCm, barHeightPx, viewHeight);

  return (
    <>
      {/* 기준 물체 선택 */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setActive(false)}
          className="rounded-full bg-white/80 backdrop-blur shadow-md px-3 py-1.5 text-xs text-slate-600 font-semibold border border-slate-200"
        >
          ✕ 측정 닫기
        </button>
        <div className="flex gap-1">
          {REFERENCE_OBJECTS.map(obj => (
            <button
              key={obj.id}
              onClick={() => setRefObj(obj)}
              className={`rounded-lg px-2 py-1.5 text-center backdrop-blur shadow-sm transition-all border ${refObj.id === obj.id
                ? 'bg-blue-50/90 border-blue-300 text-blue-700'
                : 'bg-white/70 border-slate-200 text-slate-500'}`}
            >
              <span className="text-sm block">{obj.icon}</span>
              <span className="text-[9px] block leading-tight">{obj.label}</span>
              <span className="text-[8px] block text-slate-400">{obj.heightCm}cm</span>
            </button>
          ))}
        </div>
      </div>

      {/* 측정 바 */}
      <div
        ref={containerRef}
        className="absolute right-8 z-10"
        style={{ top: 0, bottom: 0, width: 60 }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1 bg-blue-500/70 rounded-full"
          style={{ top: `${barTop * 100}%`, bottom: `${(1 - barBottom) * 100}%` }}
        />

        <div
          onPointerDown={handlePointerDown('top')}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 flex items-center justify-center cursor-ns-resize touch-none"
          style={{ top: `${barTop * 100}%` }}
        >
          <div className="w-10 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30" />
          <div className="absolute -left-6 w-6 h-px bg-blue-500/50" />
        </div>

        <div
          onPointerDown={handlePointerDown('bottom')}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 flex items-center justify-center cursor-ns-resize touch-none"
          style={{ top: `${barBottom * 100}%` }}
        >
          <div className="w-10 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30" />
          <div className="absolute -left-6 w-6 h-px bg-blue-500/50" />
        </div>

        <div
          className="absolute -left-16 -translate-y-1/2 rounded-lg bg-white/85 backdrop-blur shadow-md px-2 py-1 pointer-events-none border border-slate-200"
          style={{ top: `${(barTop + barBottom) / 2 * 100}%` }}
        >
          <p className="text-blue-600 text-xs font-bold whitespace-nowrap">{dist}m</p>
          <p className="text-[9px] text-slate-500 whitespace-nowrap">{refObj.icon} {refObj.heightCm}cm 기준</p>
        </div>

        <div
          className="absolute -left-16 w-16 border-t border-dashed border-blue-400/30 pointer-events-none"
          style={{ top: `${(barTop + barBottom) / 2 * 100}%` }}
        />
      </div>
    </>
  );
}

function ZoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChem = searchParams.get('chem') ?? '';

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [chemical, setChemical] = useState(initialChem || '기본값');
  const [distance, setDistance] = useState(50);
  const [windDir, setWindDir] = useState(0);
  const [facingDir, setFacingDir] = useState(0);
  const [showChemList, setShowChemList] = useState(false);
  const [chemSearch, setChemSearch] = useState('');
  const [useCompass, setUseCompass] = useState(false);
  const [cameraViewHeight, setCameraViewHeight] = useState(400);

  useEffect(() => {
    const el = cameraContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setCameraViewHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMeasuredDistance = useCallback((d: number) => setDistance(d), []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraError('');
      }
    } catch {
      setCameraError('카메라 접근 권한이 필요합니다');
    }
  }, []);

  useEffect(() => {
    if (!useCompass) return;

    const handler = (e: DeviceOrientationEvent) => {
      const heading = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? (e.alpha != null ? (360 - e.alpha) % 360 : 0);
      setFacingDir(Math.round(heading));
    };

    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('deviceorientation', handler, true);
      });
    } else {
      window.addEventListener('deviceorientation', handler, true);
    }

    return () => window.removeEventListener('deviceorientation', handler, true);
  }, [useCompass]);

  useEffect(() => { startCamera(); }, [startCamera]);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const zone = ERG_ZONES[chemical] ?? ERG_ZONES['기본값'];
  const info = getZoneInfo(distance, zone, windDir, facingDir);
  const filteredChems = CHEMICAL_LIST.filter(c => c.includes(chemSearch));

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* 카메라 뷰 */}
      <div ref={cameraContainerRef} className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-3">
            <span className="text-5xl">📷</span>
            {cameraError ? (
              <p className="text-xs text-rose-400 text-center px-8">{cameraError}</p>
            ) : (
              <p className="text-xs text-slate-400">카메라 연결 중...</p>
            )}
            <button onClick={startCamera} className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              카메라 시작
            </button>
          </div>
        )}

        {/* Zone 오버레이 색상 */}
        <div className="absolute inset-0 pointer-events-none transition-colors duration-500" style={{ backgroundColor: info.bgColor }} />

        {/* 상단: 뒤로가기 + Zone 표시 */}
        <div className="absolute top-0 left-0 right-0 z-10 safe-area-top">
          <div className="flex items-center gap-2 px-4 pt-3 pb-2">
            <button onClick={() => router.push('/')} className="w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-slate-700 text-lg border border-white/50">
              ←
            </button>
            <div className="flex-1" />
            <div className="rounded-full px-4 py-1.5 backdrop-blur font-bold text-sm bg-white/80 shadow-md" style={{ color: info.color, border: `2px solid ${info.color}` }}>
              {info.zone}
            </div>
          </div>
        </div>

        {/* 중앙: Zone 정보 */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none px-4">
          <p className="text-2xl font-black tracking-tight text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            {distance}m
          </p>
          <div className="rounded-2xl px-4 py-2 bg-white/85 backdrop-blur-md shadow-lg border border-white/50">
            <p className="text-sm font-bold text-center" style={{ color: info.color }}>{info.label}</p>
            {info.isDownwind && (
              <p className="text-[11px] text-rose-600 text-center mt-1 font-semibold">⚠ 풍하방향 — 격리거리 {zone.windSpread}배 확대 적용</p>
            )}
          </div>
        </div>

        {/* 나침반 표시 */}
        <div className="absolute top-16 right-4 z-10">
          <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center relative border border-white/50">
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${-facingDir}deg)` }}>
              <div className="absolute" style={{ transform: `rotate(${windDir}deg)` }}>
                <div className="flex flex-col items-center -mt-5">
                  <span className="text-teal-600 text-lg leading-none">↓</span>
                  <span className="text-[8px] text-teal-600 font-bold">풍</span>
                </div>
              </div>
              <span className="absolute -top-0.5 text-[10px] font-bold text-rose-600">N</span>
              <span className="absolute -bottom-0.5 text-[10px] font-bold text-slate-400">S</span>
              <span className="absolute -right-0.5 text-[10px] font-bold text-slate-400">E</span>
              <span className="absolute -left-0.5 text-[10px] font-bold text-slate-400">W</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 z-10" />
          </div>
        </div>

        {/* 거리 측정 바 */}
        <DistanceMeasureBar onDistanceChange={handleMeasuredDistance} viewHeight={cameraViewHeight} />
      </div>

      {/* 하단 컨트롤 패널 */}
      <div className="shrink-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 safe-area-bottom">
        <div className="px-4 pt-3 pb-4 space-y-3 max-w-lg mx-auto">

          {/* 물질 선택 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowChemList(!showChemList)}
              className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-left flex items-center gap-2 shadow-sm"
            >
              <span className="text-base">🧪</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400">선택 물질</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{chemical}</p>
              </div>
              <span className="text-slate-400 text-xs">{showChemList ? '▲' : '▼'}</span>
            </button>
          </div>

          {showChemList && (
            <div className="rounded-xl bg-white border border-slate-200 p-2 max-h-40 overflow-y-auto space-y-1 shadow-sm">
              <input
                type="text"
                value={chemSearch}
                onChange={e => setChemSearch(e.target.value)}
                placeholder="물질명 검색..."
                className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none mb-1"
              />
              {filteredChems.map(c => (
                <button
                  key={c}
                  onClick={() => { setChemical(c); setShowChemList(false); setChemSearch(''); }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${chemical === c ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* 거리 슬라이더 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-slate-500 font-semibold">📏 추정 거리</p>
              <p className="text-sm font-bold text-slate-800">{distance}m</p>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={distance}
              onChange={e => setDistance(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(zone.hot / 500) * 100}%, #ea580c ${(zone.hot / 500) * 100}%, #ea580c ${(zone.warm / 500) * 100}%, #2563eb ${(zone.warm / 500) * 100}%, #2563eb ${(zone.cold / 500) * 100}%, #16a34a ${(zone.cold / 500) * 100}%, #16a34a 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">5m</span>
              <span className="text-[10px] text-slate-400">500m</span>
            </div>
          </div>

          {/* 바람 방향 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-slate-500 font-semibold">💨 바람 방향 (불어오는 쪽)</p>
              <button
                onClick={() => setUseCompass(!useCompass)}
                className={`text-[10px] px-2 py-0.5 rounded-full ${useCompass ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'}`}
              >
                {useCompass ? '🧭 나침반 ON' : '🧭 나침반'}
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {WIND_DIRS.map(w => (
                <button
                  key={w.label}
                  onClick={() => setWindDir(w.deg)}
                  className={`rounded-lg py-2 text-center transition-all ${windDir === w.deg
                    ? 'bg-teal-50 ring-1 ring-teal-300 text-teal-700'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{w.label}</p>
                  <p className="text-[9px]">{w.labelKo}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Zone 거리 요약 */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-2 text-center">
              <p className="text-[10px] text-rose-600 font-semibold">HOT</p>
              <p className="text-sm font-bold text-rose-700">{Math.round(info.hotDist)}m</p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-2 text-center">
              <p className="text-[10px] text-amber-600 font-semibold">WARM</p>
              <p className="text-sm font-bold text-amber-700">{Math.round(info.warmDist)}m</p>
            </div>
            <div className="rounded-xl bg-sky-50 border border-sky-200 p-2 text-center">
              <p className="text-[10px] text-sky-600 font-semibold">COLD</p>
              <p className="text-sm font-bold text-sky-700">{Math.round(info.coldDist)}m</p>
            </div>
          </div>

          {zone.note && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
              <p className="text-[11px] text-amber-700">⚠ {zone.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
