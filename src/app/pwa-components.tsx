'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failed silently
      });
    }
  }, []);
  return null;
}

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-600/90 backdrop-blur px-4 py-2 text-center safe-area-top">
      <p className="text-xs font-semibold text-white">📡 오프라인 모드 — 로컬 데이터만 사용 가능, AI 기능 제한</p>
    </div>
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('chemguard_install_dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as unknown as { prompt: () => void }).prompt();
    setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('chemguard_install_dismissed', '1');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-md mx-auto rounded-2xl bg-zinc-800/95 backdrop-blur ring-1 ring-zinc-700 p-4 shadow-xl safe-area-bottom">
      <p className="text-sm font-semibold text-zinc-100 mb-1">📱 앱으로 설치</p>
      <p className="text-xs text-zinc-400 mb-3">홈 화면에 추가하면 오프라인에서도 사용할 수 있습니다</p>
      <div className="flex gap-2">
        <button onClick={install} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors">설치</button>
        <button onClick={dismiss} className="rounded-xl bg-zinc-700 px-4 py-2.5 text-xs text-zinc-400 hover:bg-zinc-600 transition-colors">닫기</button>
      </div>
    </div>
  );
}
