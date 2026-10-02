import { CHEMICALS } from '@/lib/chemicals-data';

// 서비스워커를 빌드마다 새로 만든다: 캐시 이름에 커밋을 넣어 배포 후 옛 화면이 남지 않게 하고,
// 사전 캐시 목록을 물질 데이터에서 뽑아 새 물질이 추가돼도 손으로 고칠 일이 없게 한다.
export const dynamic = 'force-static';

// CLI 배포에는 커밋 SHA 가 없을 수 있고, 같은 SHA 로 다시 배포해도 sw.js 가 바뀌어야 업데이트되므로 빌드 시각을 항상 붙인다
const VERSION = `${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'}-${Date.now().toString(36)}`;

const PAGES = [
  '/',
  '/offline',
  '/map',
  '/zone',
  '/vision',
  '/dashboard',
  '/dashboard/report-preview',
  ...CHEMICALS.map((c) => `/chemical/${c.id}`),
];

const SW_SOURCE = String.raw`
const CACHE = 'chemguard-' + VERSION;
// HTML 안 script/link 와 RSC 페이로드 문자열 속 청크 경로를 모두 잡는다(역슬래시·따옴표에서 끊음)
const ASSET_RE = /\/_next\/static\/[^"'\\\s)]+/g;
const CHUNK_RE = /["'](static\/(?:chunks|media)\/[^"'\\\s]+)["']/g;
const OFFLINE_JSON = JSON.stringify({ error: '오프라인 상태입니다. 이 기능은 인터넷 연결이 필요합니다.' });

async function precache() {
  const cache = await caches.open(CACHE);
  let pagesOk = 0;
  const assets = new Set(['/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/logo.png']);
  await Promise.all(PAGES.map(async (path) => {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return;
      const html = await res.clone().text();
      await cache.put(path, res);
      pagesOk++;
      for (const m of html.matchAll(ASSET_RE)) assets.add(m[0]);
    } catch (e) { /* 한 페이지 실패로 설치 전체를 막지 않는다 */ }
  }));
  // 동적 import 청크(지도의 Leaflet 등)는 HTML 에 없고 부모 JS 안에 "static/chunks/…" 로만 적혀 있어 한 단계 더 훑는다
  const nested = new Set();
  const fetchAll = (urls, scan) => Promise.all([...urls].map(async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      if (scan && url.endsWith('.js')) {
        const js = await res.clone().text();
        for (const m of js.matchAll(CHUNK_RE)) {
          const path = '/_next/' + m[1];
          if (!assets.has(path)) nested.add(path);
        }
      }
      await cache.put(url, res);
    } catch (e) { /* 무시 */ }
  }));
  await fetchAll(assets, true);
  await fetchAll(nested, false);
  // 핵심 화면이 없으면 설치를 실패시켜 이전 버전을 계속 쓰게 한다
  if (!(await cache.match('/')) || !(await cache.match('/offline'))) {
    throw new Error('precache incomplete');
  }
  // 일부 물질 화면이 빠져도 설치는 하되, 화면에 "오프라인 준비 n/N" 으로 알린다
  await cache.put(STATUS_KEY, new Response(JSON.stringify({ ok: pagesOk, total: PAGES.length, version: VERSION })));
}

const STATUS_KEY = '/__sw-status';

async function readStatus() {
  // 옛 버전 캐시도 남겨 두므로 반드시 이번 버전 캐시에서 읽는다
  const res = await (await caches.open(CACHE)).match(STATUS_KEY);
  return res ? res.json() : null;
}

self.addEventListener('install', (event) => {
  // 처음 설치면 바로 쓴다. 이미 쓰던 버전이 있으면 화면의 "새로고침" 을 누를 때까지 기다린다
  // (사용 중인 화면이 옛 청크를 못 찾아 깨지는 것을 막는다)
  event.waitUntil(precache().then(async () => {
    if (!(await self.clients.matchAll()).length) await self.skipWaiting();
  }));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'STATUS') {
    readStatus().then((status) => event.source && event.source.postMessage({ type: 'SW_STATUS', status }));
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 바로 앞 버전 하나는 남겨 열려 있던 화면이 옛 청크를 계속 받을 수 있게 한다
    const old = (await caches.keys()).filter((k) => k.startsWith('chemguard-') && k !== CACHE);
    await Promise.all(old.slice(0, -1).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

async function networkFirstPage(req, url) {
  const cache = await caches.open(CACHE);
  // 3초 뒤에 도착한 응답도 저장해 다음 번엔 최신 화면을 쓰게 한다
  const network = fetch(req).then((res) => {
    if (res.ok && res.type === 'basic') cache.put(url.pathname, res.clone());
    return res;
  });
  network.catch(() => {});
  try {
    // 현장 통신이 느리면 3초 뒤 저장된 화면을 먼저 보여준다
    return await withTimeout(network, 3000);
  } catch (e) {
    const cached = (await cache.match(url.pathname)) || (await cache.match(req, { ignoreSearch: true }));
    if (cached) return cached;
    const offline = await cache.match('/offline');
    return offline || new Response('오프라인', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  // 옛 버전 캐시까지 찾는다(업데이트 직후 열려 있던 화면의 청크)
  const cached = await caches.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const update = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  });
  if (cached) {
    update.catch(() => {});
    return cached;
  }
  return update;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 지도 타일 등 외부 요청은 건드리지 않는다
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req).catch(() =>
      new Response(OFFLINE_JSON, { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(req));
    return;
  }
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstPage(req, url));
    return;
  }
  // 클라이언트 이동용 RSC 요청: 실패하거나 3초 넘게 걸리면 오류로 돌려 Next 라우터가
  // 전체 페이지 이동으로 되돌아가게 하고, 그 요청을 위 navigate 분기가 캐시에서 받는다.
  if (req.headers.get('RSC') === '1' || url.searchParams.has('_rsc')) {
    event.respondWith(withTimeout(fetch(req), 3000).catch(() => Response.error()));
    return;
  }

  event.respondWith(staleWhileRevalidate(req));
});
`;

export function GET() {
  const body = `const VERSION = ${JSON.stringify(VERSION)};\nconst PAGES = ${JSON.stringify(PAGES)};\n${SW_SOURCE}`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
