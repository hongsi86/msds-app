// 최근 연 물질(기기에만 저장). 홈 첫 화면 타일에 쓴다.
const KEY = 'cg_recent';
const MAX = 6;

export function readRecentRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function parseRecent(raw: string): string[] {
  return raw ? raw.split(',').filter(Boolean) : [];
}

export function pushRecent(id: string) {
  try {
    const next = [id, ...parseRecent(readRecentRaw()).filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, next.join(','));
  } catch {
    /* 저장 못 해도 기능엔 지장 없음 */
  }
}
