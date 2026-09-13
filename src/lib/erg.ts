import type { Chemical } from './types';

// ERG 거리의 유일한 출처. 지도·Zone·상세페이지 모두 여기서만 거리를 얻는다.
// 값이 없는 물질에 거리를 지어내지 않는다 — 없으면 null 을 돌려주고 화면은 지침 본문을 안내한다.

export type SpillSize = 'small' | 'large';
export type DayNight = 'day' | 'night';

export interface ErgZones {
  /** table: ERG 표1 수치 / guide: 지침(주황색 페이지) 권고문에서 읽은 초기 격리 / unknown: 미확인 물질 지침 111 */
  source: 'table' | 'guide' | 'unknown';
  guide?: string;
  /** 초기 이격거리(전 방향 반경, m) */
  isolationM: number;
  /** 풍하 방호활동거리(m). 표1 등재 물질만 존재 */
  protectiveM?: number;
  /** 화재 시 전 방향 격리(m), 지침 권고문에 있을 때만 */
  fireIsolationM?: number;
  /** 화면에 그대로 보여줄 근거 문구 */
  basis: string;
}

/** ERG 2024 지침 111(혼합 적재·미확인 화물): 전 방향 최소 100m 격리 */
export const UNKNOWN_ZONES: ErgZones = {
  source: 'unknown',
  guide: '111',
  isolationM: 100,
  basis: 'ERG 2024 지침 111 (미확인 물질) — 전 방향 최소 100m 격리',
};

export function defaultDayNight(date = new Date()): DayNight {
  const h = date.getHours();
  return h >= 6 && h < 19 ? 'day' : 'night';
}

/** "초기 격리 25m(고체)·50m(액체). …" 처럼 첫 문장의 초기 격리 수치 중 가장 큰 값 */
function parseGuideIsolation(summary: string): number | undefined {
  const clause = summary.match(/초기\s*격리([^.]*)/)?.[1];
  if (!clause) return undefined;
  const values = [...clause.matchAll(/(\d+)\s*m/g)].map((m) => Number(m[1]));
  return values.length ? Math.max(...values) : undefined;
}

function parseFireIsolation(summary: string): number | undefined {
  const m = summary.match(/화재\s*시[^.]*?(\d+)\s*m/);
  return m ? Number(m[1]) : undefined;
}

export function getErgZones(
  chem: Chemical | undefined,
  { spill, dayNight }: { spill: SpillSize; dayNight: DayNight },
): ErgZones | null {
  if (!chem) return UNKNOWN_ZONES;
  const res = chem.res_protocol;
  const guide = res.erg_guide_number;
  const summary = res.erg_action_summary;

  if (res.erg_distance) {
    const d = res.erg_distance;
    const key = `${spill}_${dayNight}` as const;
    return {
      source: 'table',
      guide,
      isolationM: spill === 'small' ? d.initial_isolation_m.small_spill : d.initial_isolation_m.large_spill,
      protectiveM: Math.round(d.protective_action_km[key] * 1000),
      fireIsolationM: summary ? parseFireIsolation(summary) : undefined,
      basis: `ERG 2024 표1 · ${spill === 'small' ? '소량' : '대량'} 누출 · ${dayNight === 'day' ? '낮' : '밤'}`,
    };
  }

  if (summary) {
    const isolationM = parseGuideIsolation(summary);
    if (isolationM === undefined) return null;
    return {
      source: 'guide',
      guide,
      isolationM,
      fireIsolationM: parseFireIsolation(summary),
      basis: `ERG 2024 지침 ${guide ?? ''} 권고 — 표1 미등재, 풍하 방호거리 수치 없음`,
    };
  }

  return null;
}

export type ZoneStatus = 'isolation' | 'protective' | 'outside';

export interface ZoneClassification {
  status: ZoneStatus;
  /** 사고 지점 기준 사용자가 풍하 쪽에 있는지 */
  downwind: boolean;
}

/**
 * ERG 도식: 사고 지점 중심 초기 이격 원 + 풍하 방향으로 길이 D·폭 D 인 방호활동 사각형.
 * @param bearingFromSourceDeg 사고 지점에서 사용자 위치를 본 방위(북=0, 시계방향)
 * @param windFromDeg 바람이 불어오는 방위
 */
export function classifyPosition(
  zones: ErgZones,
  distanceM: number,
  bearingFromSourceDeg: number,
  windFromDeg: number,
): ZoneClassification {
  const downwindDeg = (windFromDeg + 180) % 360;
  const theta = ((bearingFromSourceDeg - downwindDeg) * Math.PI) / 180;
  const along = distanceM * Math.cos(theta);
  const across = Math.abs(distanceM * Math.sin(theta));
  // 풍하축 ±45° 안이면 풍하 쪽으로 본다(방호 사각형 판정과는 별개의 안내용)
  const downwind = along > 0 && across <= along;

  if (distanceM <= zones.isolationM) return { status: 'isolation', downwind };
  if (zones.protectiveM && along >= 0 && along <= zones.protectiveM && across <= zones.protectiveM / 2) {
    return { status: 'protective', downwind };
  }
  return { status: 'outside', downwind };
}

export const ZONE_LABEL: Record<ZoneStatus, { short: string; label: string; color: string; bg: string }> = {
  isolation: {
    short: '초기 이격 안',
    label: '초기 이격거리 안 — 보호장비 없이 진입 금지',
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.20)',
  },
  protective: {
    short: '풍하 방호구역',
    label: '풍하 방호활동구역 — 대피·실내대피 대상',
    color: '#ea580c',
    bg: 'rgba(234,88,12,0.15)',
  },
  outside: {
    short: '계산 범위 밖',
    label: '계산 범위 밖 — 안전 보장 아님 · 현장 측정·지휘관 판단',
    color: '#475569',
    bg: 'rgba(71,85,105,0.10)',
  },
};

export function formatDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
}

/** 위경도 두 점 사이 방위(도) */
export function bearingDeg(from: [number, number], to: [number, number]): number {
  const [lat1, lon1] = from.map((v) => (v * Math.PI) / 180);
  const [lat2, lon2] = to.map((v) => (v * Math.PI) / 180);
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** 위경도 두 점 사이 거리(m, haversine) */
export function distanceM(from: [number, number], to: [number, number]): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(to[0] - from[0]);
  const dLon = toRad(to[1] - from[1]);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from[0])) * Math.cos(toRad(to[0])) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 기준점에서 방위·거리만큼 떨어진 위경도(단거리 근사) */
export function offsetLatLng(origin: [number, number], bearing: number, meters: number): [number, number] {
  const rad = (bearing * Math.PI) / 180;
  const north = meters * Math.cos(rad);
  const east = meters * Math.sin(rad);
  return [
    origin[0] + north / 111320,
    origin[1] + east / (111320 * Math.cos((origin[0] * Math.PI) / 180)),
  ];
}

/** 풍하 방호활동 사각형의 네 꼭짓점 */
export function protectiveAreaPolygon(
  origin: [number, number],
  windFromDeg: number,
  protectiveM: number,
): [number, number][] {
  const down = (windFromDeg + 180) % 360;
  const left = (down + 270) % 360;
  const right = (down + 90) % 360;
  const half = protectiveM / 2;
  const far = offsetLatLng(origin, down, protectiveM);
  return [
    offsetLatLng(origin, left, half),
    offsetLatLng(far, left, half),
    offsetLatLng(far, right, half),
    offsetLatLng(origin, right, half),
  ];
}
