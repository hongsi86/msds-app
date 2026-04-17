'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl">🗺️</span>
        <span className="text-zinc-500 text-sm">지도 로딩 중...</span>
        <span className="inline-block w-5 h-5 border-2 border-zinc-600 border-t-blue-400 rounded-full animate-spin" />
      </div>
    </div>
  ),
});

export default function MapPage() {
  return <MapComponent />;
}
