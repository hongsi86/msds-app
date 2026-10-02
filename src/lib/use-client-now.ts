import { useSyncExternalStore } from 'react';

// 현재 시각(분 단위). 서버 렌더·하이드레이션 중엔 null — 빌드 시각이 화면에 박혀 어긋나는 것을 막는다.
const MINUTE = 60_000;
let cached = 0;

function subscribe(cb: () => void) {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
}

function snapshot() {
  const m = Math.floor(Date.now() / MINUTE) * MINUTE;
  if (m !== cached) cached = m;
  return cached;
}

export function useClientNow(): Date | null {
  const t = useSyncExternalStore(subscribe, snapshot, () => 0);
  return t ? new Date(t) : null;
}
