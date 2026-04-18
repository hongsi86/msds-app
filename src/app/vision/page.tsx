'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

interface VisionResult {
  chemical_name: string;
  name_en?: string;
  cas_number?: string;
  confidence: '높음' | '중간' | '낮음';
  identified_from: string;
  hazard_class?: string;
  danger_level?: number;
  immediate_actions: string[];
}

function confidenceBadge(c: string) {
  if (c === '높음') return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
  if (c === '중간') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  return 'bg-slate-100 text-slate-500 ring-1 ring-slate-200';
}

function dangerBadge(level: number) {
  if (level === 4) return 'bg-rose-50 text-rose-700 ring-rose-200';
  if (level === 3) return 'bg-orange-50 text-orange-700 ring-orange-200';
  if (level === 2) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
}

export default function VisionPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [results, setResults] = useState<VisionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCapturedImage(null);
        setResults([]);
        setError('');
      }
    } catch {
      setError('카메라 접근 권한이 필요합니다');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      setResults([]);
      setError('');
      stopCamera();
    };
    reader.readAsDataURL(file);
  }, [stopCamera]);

  const analyzeImage = useCallback(async () => {
    if (!capturedImage || loading) return;
    setLoading(true);
    setResults([]);
    setError('');

    try {
      const base64 = capturedImage.split(',')[1];
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error ?? `오류 (${res.status})`);
        return;
      }

      const text = await res.text();
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        setResults(JSON.parse(match[0]));
      } else {
        setError('분석 결과를 파싱할 수 없습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [capturedImage, loading]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 헤더 */}
      <header className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
            ←
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">📸 사진 식별</h1>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">라벨·GHS·UN 마크 분석</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-4">
        {/* 카메라/이미지 영역 */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] shadow-sm">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${!cameraActive || capturedImage ? 'hidden' : ''}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {capturedImage && (
            <img src={capturedImage} alt="captured" className="absolute inset-0 w-full h-full object-contain bg-slate-900" />
          )}

          {!cameraActive && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="text-6xl">📷</span>
              <p className="text-sm text-slate-400">카메라 또는 갤러리에서 이미지를 선택하세요</p>
            </div>
          )}

          {cameraActive && !capturedImage && (
            <button
              onClick={capturePhoto}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white ring-4 ring-white/50 active:scale-90 transition-transform shadow-lg"
            />
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2">
          {!capturedImage ? (
            <>
              <button
                onClick={cameraActive ? stopCamera : startCamera}
                className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
              >
                {cameraActive ? '⏹ 카메라 중지' : '📷 카메라 시작'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
              >
                🖼 갤러리
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </>
          ) : (
            <>
              <button
                onClick={analyzeImage}
                disabled={loading}
                className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 transition-all shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    분석 중...
                  </span>
                ) : '🔍 분석 시작'}
              </button>
              <button
                onClick={() => { setCapturedImage(null); setResults([]); setError(''); }}
                className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
              >
                다시 찍기
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider px-1">식별 결과</p>
            {results.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <button
                      onClick={() => router.push(`/?q=${encodeURIComponent(item.chemical_name)}`)}
                      className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors text-left"
                    >
                      {item.chemical_name}
                    </button>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {item.danger_level && (
                      <span className={`rounded-full ring-1 px-2 py-0.5 text-[11px] font-semibold ${dangerBadge(item.danger_level)}`}>
                        위험도 {item.danger_level}
                      </span>
                    )}
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${confidenceBadge(item.confidence)}`}>
                      {item.confidence}
                    </span>
                  </div>
                </div>

                {item.name_en && (
                  <p className="text-xs text-slate-400">
                    {item.name_en} {item.cas_number ? `· ${item.cas_number}` : ''} {item.hazard_class ? `· ${item.hazard_class}` : ''}
                  </p>
                )}

                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="text-slate-400 font-semibold">식별 근거: </span>{item.identified_from}
                </p>

                {item.immediate_actions.length > 0 && (
                  <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3 space-y-1.5">
                    <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">즉각 조치</p>
                    {item.immediate_actions.map((action, j) => (
                      <p key={j} className="text-xs text-slate-700 flex gap-2">
                        <span className="text-amber-500 shrink-0">&bull;</span>
                        {action}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!capturedImage && results.length === 0 && !error && (
          <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">💡 촬영 팁</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">• GHS 라벨이나 위험물 표지가 선명하게 보이도록 촬영</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">• NFPA 다이아몬드, UN 번호가 있으면 정확도 향상</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">• 용기 전체가 보이도록 촬영하면 형태 분석 가능</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">• 누출 현장의 색상, 상태도 분석 가능</p>
          </div>
        )}
      </main>
    </div>
  );
}
