'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const CHEMICAL_LIST = Object.keys(ERG_ZONES);

const WIND_DIRS = [
  { label: 'N', labelKo: '북', deg: 0 },
  { label: 'NE', labelKo: '북동', deg: 45 },
  { label: 'E', labelKo: '동', deg: 90 },
  { label: 'SE', labelKo: '남동', deg: 135 },
  { label: 'S', labelKo: '남', deg: 180 },
  { label: 'SW', labelKo: '남서', deg: 225 },
  { label: 'W', labelKo: '서', deg: 270 },
  { label: 'NW', labelKo: '북서', deg: 315 },
] as const;

export default function MapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<L.Circle[]>([]);
  const markerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const windArrowRef = useRef<L.Polyline | null>(null);

  const [chemical, setChemical] = useState('기본값');
  const [windDir, setWindDir] = useState(0);
  const [showChemList, setShowChemList] = useState(false);
  const [incidentPos, setIncidentPos] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [userDistance, setUserDistance] = useState<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.5665, 126.978],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Click to set incident location
    map.on('click', (e: L.LeafletMouseEvent) => {
      setIncidentPos([e.latlng.lat, e.latlng.lng]);
    });

    mapRef.current = map;

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(latlng);
        setIncidentPos(latlng);
        map.setView(latlng, 15);
      },
      () => {
        // Default to Seoul if geolocation fails
      },
      { enableHighAccuracy: true }
    );

    // Watch user position
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw zones
  const drawZones = useCallback(() => {
    const map = mapRef.current;
    if (!map || !incidentPos) return;

    // Clear previous
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];
    if (markerRef.current) markerRef.current.remove();
    if (windArrowRef.current) windArrowRef.current.remove();

    const zone = ERG_ZONES[chemical] ?? ERG_ZONES['기본값'];

    // Draw COLD → WARM → HOT (so HOT is on top)
    const zones = [
      { radius: zone.cold, color: '#eab308', fillColor: '#eab30830', label: 'COLD' },
      { radius: zone.warm, color: '#f97316', fillColor: '#f9731630', label: 'WARM' },
      { radius: zone.hot, color: '#ef4444', fillColor: '#ef444440', label: 'HOT' },
    ];

    zones.forEach((z) => {
      const circle = L.circle(incidentPos, {
        radius: z.radius,
        color: z.color,
        fillColor: z.fillColor,
        fillOpacity: 0.3,
        weight: 2,
        dashArray: z.label === 'COLD' ? '5,5' : undefined,
      }).addTo(map);
      circle.bindTooltip(`${z.label} ${z.radius}m`, { permanent: false, direction: 'top' });
      circlesRef.current.push(circle);
    });

    // Incident marker
    const incidentIcon = L.divIcon({
      html: '<div style="background:#ef4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(239,68,68,0.8)"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: '',
    });
    markerRef.current = L.marker(incidentPos, { icon: incidentIcon }).addTo(map);
    markerRef.current.bindTooltip(`⚠ 사고 지점 · ${chemical}`, { direction: 'top', offset: [0, -10] });

    // Wind direction arrow
    const windRad = ((windDir + 180) * Math.PI) / 180; // downwind
    const arrowLen = zone.cold * 1.2;
    const endLat = incidentPos[0] + (arrowLen / 111320) * Math.cos(windRad);
    const endLng = incidentPos[1] + (arrowLen / (111320 * Math.cos((incidentPos[0] * Math.PI) / 180))) * Math.sin(windRad);
    windArrowRef.current = L.polyline(
      [incidentPos, [endLat, endLng]],
      { color: '#06b6d4', weight: 3, dashArray: '8,6', opacity: 0.7 }
    ).addTo(map);
    windArrowRef.current.bindTooltip('풍하방향 →', { permanent: false });

  }, [chemical, windDir, incidentPos]);

  useEffect(() => {
    drawZones();
  }, [drawZones]);

  // Update user marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userPos) return;

    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.circleMarker(userPos, {
      radius: 8,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 1,
      weight: 3,
    }).addTo(map);
    userMarkerRef.current.bindTooltip('내 위치', { direction: 'top', offset: [0, -10] });

    // Calculate distance to incident
    if (incidentPos) {
      const dist = map.distance(L.latLng(userPos[0], userPos[1]), L.latLng(incidentPos[0], incidentPos[1]));
      setUserDistance(Math.round(dist));
    }
  }, [userPos, incidentPos]);

  const zone = ERG_ZONES[chemical] ?? ERG_ZONES['기본값'];

  const getMyZone = () => {
    if (userDistance === null) return null;
    if (userDistance <= zone.hot) return { zone: 'HOT', color: '#ef4444' };
    if (userDistance <= zone.warm) return { zone: 'WARM', color: '#f97316' };
    if (userDistance <= zone.cold) return { zone: 'COLD', color: '#eab308' };
    return { zone: 'SAFE', color: '#22c55e' };
  };

  const myZone = getMyZone();

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col">
      {/* Map */}
      <div ref={mapContainerRef} className="flex-1 z-0" />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] safe-area-top">
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <a href="/" className="w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white text-lg no-underline">
            ←
          </a>
          <div className="flex-1" />
          {myZone && userDistance !== null && (
            <div className="rounded-full px-4 py-1.5 backdrop-blur font-bold text-sm" style={{ backgroundColor: `${myZone.color}33`, color: myZone.color, border: `2px solid ${myZone.color}` }}>
              {myZone.zone} · {userDistance}m
            </div>
          )}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="shrink-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 z-[1000] safe-area-bottom">
        <div className="px-4 pt-3 pb-4 space-y-3 max-w-lg mx-auto">
          {/* Chemical selector */}
          <button
            onClick={() => setShowChemList(!showChemList)}
            className="w-full rounded-xl bg-zinc-800 ring-1 ring-zinc-700 px-3 py-2.5 text-left flex items-center gap-2"
          >
            <span className="text-base">🧪</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-zinc-500">선택 물질</p>
              <p className="text-sm font-semibold text-zinc-100 truncate">{chemical}</p>
            </div>
            <span className="text-zinc-500 text-xs">{showChemList ? '▲' : '▼'}</span>
          </button>

          {showChemList && (
            <div className="rounded-xl bg-zinc-800 ring-1 ring-zinc-700 p-2 max-h-32 overflow-y-auto space-y-0.5">
              {CHEMICAL_LIST.map((c) => (
                <button
                  key={c}
                  onClick={() => { setChemical(c); setShowChemList(false); }}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-xs transition-colors ${chemical === c ? 'bg-blue-600/20 text-blue-300' : 'text-zinc-300 hover:bg-zinc-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Wind direction */}
          <div>
            <p className="text-[11px] text-zinc-500 font-semibold mb-1.5">💨 바람 방향</p>
            <div className="grid grid-cols-8 gap-1">
              {WIND_DIRS.map((w) => (
                <button
                  key={w.label}
                  onClick={() => setWindDir(w.deg)}
                  className={`rounded-lg py-1.5 text-center transition-all ${windDir === w.deg
                    ? 'bg-cyan-600/25 ring-1 ring-cyan-500/50 text-cyan-300'
                    : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                  }`}
                >
                  <p className="text-[11px] font-bold">{w.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Zone distances */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/30 p-2 text-center">
              <p className="text-[10px] text-red-400 font-semibold">HOT</p>
              <p className="text-sm font-bold text-red-300">{zone.hot}m</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30 p-2 text-center">
              <p className="text-[10px] text-amber-400 font-semibold">WARM</p>
              <p className="text-sm font-bold text-amber-300">{zone.warm}m</p>
            </div>
            <div className="rounded-xl bg-blue-500/10 ring-1 ring-blue-500/30 p-2 text-center">
              <p className="text-[10px] text-blue-400 font-semibold">COLD</p>
              <p className="text-sm font-bold text-blue-300">{zone.cold}m</p>
            </div>
          </div>

          {zone.note && (
            <div className="rounded-xl bg-amber-500/8 ring-1 ring-amber-500/25 px-3 py-2">
              <p className="text-[11px] text-amber-400">⚠ {zone.note}</p>
            </div>
          )}

          <p className="text-[10px] text-zinc-600 text-center">지도를 탭하여 사고 지점 설정 · GPS로 내 위치 자동 추적</p>
        </div>
      </div>
    </div>
  );
}
