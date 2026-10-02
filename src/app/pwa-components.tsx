'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

type SwStatus = { ok: number; total: number; version: string };

export function ServiceWorkerRegistration() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [status, setStatus] = useState<SwStatus | null>(null);

  useEffect(() => {
    // 개발 서버에서는 캐시가 수정 사항을 가리므로 등록하지 않는다
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    const sw = navigator.serviceWorker;
    let reg: ServiceWorkerRegistration | undefined;

    const watch = (worker: ServiceWorker | null) => {
      if (!worker) return;
      const check = () => {
        // 이미 쓰던 버전이 있을 때만 "새 버전" 을 알린다(첫 설치는 바로 적용됨)
        if (worker.state === 'installed' && sw.controller) setWaiting(worker);
      };
      check();
      worker.addEventListener('statechange', check);
    };
    const askStatus = () => sw.controller?.postMessage('STATUS');
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SW_STATUS') setStatus(e.data.status);
    };
    // iOS 홈 화면 앱은 페이지 이동 없이 다시 열려 업데이트 확인을 놓치기 쉽다
    const onVisible = () => {
      if (document.visibilityState === 'visible') reg?.update().catch(() => {});
    };
    let reloading = false;
    const onControllerChange = () => {
      askStatus();
      if (reloading) window.location.reload();
    };

    sw.addEventListener('message', onMessage);
    sw.addEventListener('controllerchange', onControllerChange);
    document.addEventListener('visibilitychange', onVisible);
    sw.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((r) => {
        reg = r;
        watch(r.waiting);
        r.addEventListener('updatefound', () => watch(r.installing));
        askStatus();
      })
      .catch(() => {
        // 등록 실패해도 온라인 사용에는 지장 없음
      });
    (window as unknown as { __cgReload?: () => void }).__cgReload = () => {
      reloading = true;
    };

    return () => {
      sw.removeEventListener('message', onMessage);
      sw.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const applyUpdate = () => {
    if (!waiting) return;
    (window as unknown as { __cgReload?: () => void }).__cgReload?.();
    waiting.postMessage('SKIP_WAITING');
    setWaiting(null);
  };

  const incomplete = status && status.ok < status.total;

  if (!waiting && !incomplete) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9999] flex justify-center px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
      {waiting ? (
        <button
          onClick={applyUpdate}
          className="min-h-12 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg"
        >
          새 버전이 있습니다 — 눌러서 새로고침
        </button>
      ) : (
        <p className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          오프라인 준비 {status!.ok}/{status!.total} — 연결된 상태에서 다시 열어 주세요
        </p>
      )}
    </div>
  );
}

const subscribeOnline = (cb: () => void) => {
  window.addEventListener('offline', cb);
  window.addEventListener('online', cb);
  return () => {
    window.removeEventListener('offline', cb);
    window.removeEventListener('online', cb);
  };
};

export function OfflineIndicator() {
  const offline = useSyncExternalStore(subscribeOnline, () => !navigator.onLine, () => false);

  if (!offline) return null;

  // 탭바 바로 위 한 줄. 색만이 아니라 글자로도 상태를 알린다
  return (
    <p role="status" className="bg-amber-600 px-4 py-1 text-center text-sm font-semibold text-white">
      오프라인 — 저장된 물질 정보만 사용 · AI·지도 배경 제한
    </p>
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    if (localStorage.getItem('chemguard_install_dismissed') || isStandalone()) return;

    // iOS Safari 는 설치 이벤트가 없어 직접 방법을 알려준다
    if (isIos()) {
      const t = setTimeout(() => setShow('ios'), 0);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow('android');
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as unknown as { prompt: () => void }).prompt();
    setShow(null);
  };

  const dismiss = () => {
    setShow(null);
    localStorage.setItem('chemguard_install_dismissed', '1');
  };

  if (!show) return null;

  return (
    <div className="fixed left-4 right-4 z-[9999] max-w-md mx-auto rounded-2xl bg-white border border-slate-300 p-4 shadow-xl" style={{ bottom: 'calc(var(--tabbar-h) + 0.75rem)' }}>
      <p className="text-base font-semibold text-slate-900 mb-1">앱으로 설치</p>
      {show === 'ios' ? (
        <p className="text-sm text-slate-700 mb-3">
          Safari 아래쪽 <b>공유</b> 버튼 → <b>홈 화면에 추가</b>. 설치 후 <b>인터넷이 될 때 한 번</b> 열어 두어야
          오프라인에서도 열립니다.
        </p>
      ) : (
        <p className="text-sm text-slate-700 mb-3">홈 화면에 추가하면 오프라인에서도 사용할 수 있습니다</p>
      )}
      <div className="flex gap-2">
        {show === 'android' && (
          <button onClick={install} className="min-h-12 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">설치</button>
        )}
        <button onClick={dismiss} className="min-h-12 flex-1 rounded-xl bg-slate-100 px-4 text-sm text-slate-700 hover:bg-slate-200 transition-colors">닫기</button>
      </div>
    </div>
  );
}
