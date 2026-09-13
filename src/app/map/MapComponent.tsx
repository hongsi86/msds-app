'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CHEMICALS } from '@/lib/chemicals-data';
import {
  ZONE_LABEL,
  bearingDeg,
  classifyPosition,
  defaultDayNight,
  distanceM,
  getErgZones,
  offsetLatLng,
  protectiveAreaPolygon,
  type DayNight,
  type SpillSize,
} from '@/lib/erg';
import { ChemicalPicker, SpillDayNightToggle, resolveChemParam } from '@/components/chemical-picker';
import { ZoneSummary } from '@/components/zone-summary';

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
  const layersRef = useRef<L.Layer[]>([]);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  // ssr:false 로 불러오므로 window 를 바로 읽을 수 있다
  const [chemId, setChemId] = useState(() =>
    resolveChemParam(new URLSearchParams(window.location.search).get('chem')),
  );
  const [spill, setSpill] = useState<SpillSize>('large');
  const [dayNight, setDayNight] = useState<DayNight>(() => defaultDayNight());
  const [windDir, setWindDir] = useState(0);
  const [incidentPos, setIncidentPos] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  const chemical = CHEMICALS.find((c) => c.id === chemId);
  const zones = getErgZones(chemical, { spill, dayNight });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.5665, 126.978],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      setIncidentPos([e.latlng.lat, e.latlng.lng]);
    });

    mapRef.current = map;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(latlng);
        setIncidentPos((prev) => prev ?? latlng);
        map.setView(latlng, 15);
      },
      () => {},
      { enableHighAccuracy: true }
    );

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
  const isolationM = zones?.isolationM;
  const protectiveM = zones?.protectiveM;
  const chemLabel = chemical?.name_ko ?? '미확인 물질';
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !incidentPos) return;

    layersRef.current.forEach((l) => l.remove());
    layersRef.current = [];

    const bounds = L.latLngBounds([incidentPos, incidentPos]);

    if (protectiveM) {
      const poly = L.polygon(protectiveAreaPolygon(incidentPos, windDir, protectiveM), {
        color: '#ea580c',
        fillColor: '#ea580c',
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);
      poly.bindTooltip(`풍하 방호활동구역 ${protectiveM >= 1000 ? `${(protectiveM / 1000).toFixed(1)}km` : `${protectiveM}m`}`);
      layersRef.current.push(poly);
      bounds.extend(poly.getBounds());
    }

    if (isolationM) {
      const circle = L.circle(incidentPos, {
        radius: isolationM,
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map);
      circle.bindTooltip(`초기 이격 ${isolationM}m`, { direction: 'top' });
      layersRef.current.push(circle);
      bounds.extend(circle.getBounds());
    }

    const incidentIcon = L.divIcon({
      html: '<div style="background:#dc2626;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(220,38,38,0.6)"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: '',
    });
    const marker = L.marker(incidentPos, { icon: incidentIcon }).addTo(map);
    marker.bindTooltip(`⚠ 사고 지점 · ${chemLabel}`, { direction: 'top', offset: [0, -10] });
    layersRef.current.push(marker);

    const arrowLen = (protectiveM ?? (isolationM ?? 100) * 3) * 1.1;
    const arrow = L.polyline([incidentPos, offsetLatLng(incidentPos, (windDir + 180) % 360, arrowLen)], {
      color: '#0891b2',
      weight: 3,
      dashArray: '8,6',
      opacity: 0.7,
    }).addTo(map);
    arrow.bindTooltip('풍하방향 →');
    layersRef.current.push(arrow);

    map.fitBounds(bounds.pad(0.15), { maxZoom: 17 });
  }, [isolationM, protectiveM, chemLabel, windDir, incidentPos]);

  // Update user marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userPos) return;

    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.circleMarker(userPos, {
      radius: 8,
      color: '#2563eb',
      fillColor: '#2563eb',
      fillOpacity: 1,
      weight: 3,
    }).addTo(map);
    userMarkerRef.current.bindTooltip('내 위치', { direction: 'top', offset: [0, -10] });
  }, [userPos]);

  const userDistance = userPos && incidentPos ? Math.round(distanceM(incidentPos, userPos)) : null;
  const myZone =
    zones && userPos && incidentPos && userDistance !== null
      ? ZONE_LABEL[classifyPosition(zones, userDistance, bearingDeg(incidentPos, userPos), windDir).status]
      : null;

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col">
      {/* Map */}
      <div ref={mapContainerRef} className="flex-1 z-0" />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] safe-area-top">
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <a href={chemId ? `/chemical/${chemId}` : '/'} className="w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-600 text-lg no-underline border border-slate-200">
            ←
          </a>
          <div className="flex-1" />
          {myZone && userDistance !== null && (
            <div className="rounded-full px-4 py-1.5 backdrop-blur font-bold text-sm bg-white/90 shadow-md border" style={{ color: myZone.color, borderColor: myZone.color }}>
              내 위치 {myZone.short} · {userDistance}m
            </div>
          )}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="shrink-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-[1000] safe-area-bottom max-h-[55vh] overflow-y-auto">
        <div className="px-4 pt-3 pb-4 space-y-3 max-w-lg mx-auto">
          <ChemicalPicker value={chemId} onChange={setChemId} />
          <SpillDayNightToggle
            spill={spill}
            dayNight={dayNight}
            onSpill={setSpill}
            onDayNight={setDayNight}
            disabled={zones?.source !== 'table'}
          />

          {/* Wind direction */}
          <div>
            <p className="text-xs text-slate-500 font-semibold mb-1.5">💨 바람 방향 (불어오는 쪽)</p>
            <div className="grid grid-cols-8 gap-1">
              {WIND_DIRS.map((w) => (
                <button
                  key={w.label}
                  onClick={() => setWindDir(w.deg)}
                  className={`rounded-lg py-1.5 text-center transition-all ${windDir === w.deg
                    ? 'bg-teal-50 ring-1 ring-teal-300 text-teal-700'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{w.label}</p>
                </button>
              ))}
            </div>
          </div>

          <ZoneSummary zones={zones} guide={chemical?.res_protocol.erg_guide_number} summary={chemical?.res_protocol.erg_action_summary} />

          <p className="text-xs text-slate-400 text-center">지도를 탭하여 사고 지점 설정 · GPS로 내 위치 자동 추적 · 지도 타일은 인터넷 연결 필요</p>
        </div>
      </div>
    </div>
  );
}
