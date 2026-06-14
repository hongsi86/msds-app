export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface WeatherSnapshot {
  wind_direction_deg: number;
  wind_speed_ms: number;
  temperature_c?: number;
  observed_at: string;
  source: 'kma' | 'manual';
}

export interface SiteConditions {
  position?: GeoPoint;
  weather?: WeatherSnapshot;
  address?: string;
  error?: string;
}

const KMA_RE = 6371.00877;
const KMA_GRID = 5.0;
const KMA_SLAT1 = 30.0;
const KMA_SLAT2 = 60.0;
const KMA_OLON = 126.0;
const KMA_OLAT = 38.0;
const KMA_XO = 43;
const KMA_YO = 136;
const DEG = Math.PI / 180.0;

export function toKmaGrid({ lat, lon }: GeoPoint): { x: number; y: number } {
  const re = KMA_RE / KMA_GRID;
  const slat1 = KMA_SLAT1 * DEG;
  const slat2 = KMA_SLAT2 * DEG;
  const olon = KMA_OLON * DEG;
  const olat = KMA_OLAT * DEG;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEG * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEG - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    x: Math.floor(ra * Math.sin(theta) + KMA_XO + 0.5),
    y: Math.floor(ro - ra * Math.cos(theta) + KMA_YO + 0.5),
  };
}

const COMPASS_16 = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동',
  '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서'];

export function degToCompass16(deg: number): string {
  const idx = Math.floor(((deg + 11.25) % 360) / 22.5);
  return COMPASS_16[idx];
}

export function windDownwindDeg(windFromDeg: number): number {
  return (windFromDeg + 180) % 360;
}

export function getCurrentLocation(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('이 기기는 위치 정보를 지원하지 않습니다.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(new Error(err.message || '위치 권한이 거부되었습니다.')),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  });
}

const CACHE_KEY = 'chemguard_weather_cache';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedEntry {
  position: GeoPoint;
  weather: WeatherSnapshot;
  cached_at: number;
}

function readCache(): CachedEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedEntry;
    if (Date.now() - parsed.cached_at > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(position: GeoPoint, weather: WeatherSnapshot) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ position, weather, cached_at: Date.now() } satisfies CachedEntry)
    );
  } catch {
    /* ignore */
  }
}

export async function fetchWeather(point: GeoPoint): Promise<WeatherSnapshot> {
  const cached = readCache();
  if (cached && Math.abs(cached.position.lat - point.lat) < 0.02 && Math.abs(cached.position.lon - point.lon) < 0.02) {
    return cached.weather;
  }
  const res = await fetch(`/api/weather?lat=${point.lat}&lon=${point.lon}`, { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || '기상청 API 호출 실패');
  }
  const data = (await res.json()) as WeatherSnapshot;
  writeCache(point, data);
  return data;
}
