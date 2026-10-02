'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { Chemical } from '@/lib/types';
import { searchChemicals } from '@/lib/chemicals-data';
import { HomeQuickStart } from '@/components/home-quick-start';
import { DisplayControls } from '@/components/display-controls';
import { AiDbLink } from '@/components/ai-db-link';
import { AiDisclaimer } from '@/components/ai-disclaimer';

interface SearchResult {
  id: string;
  name: string;
  cas_number?: string;
  un_number?: string;
  description?: string;
}

interface AISearchResult {
  name_ko: string;
  name_en: string;
  cas_number: string;
  un_number?: string;
  formula?: string;
  hazard_class: string;
  appearance?: string;
  odor?: string;
}

interface AIEstimation {
  chemical_name: string;
  cas_number?: string;
  confidence: '높음' | '중간' | '낮음';
  reasoning: string;
}

function toSearchResult(c: Chemical): SearchResult {
  return {
    id: c.id,
    name: c.name_ko,
    cas_number: c.cas_number,
    un_number: c.un_number,
    description: `${c.name_en} · ${c.hazard_class}`,
  };
}

function confidenceBadge(c: AIEstimation['confidence']) {
  if (c === '높음') return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
  if (c === '중간') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  return 'bg-slate-100 text-slate-500 ring-1 ring-slate-200';
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-4 space-y-2.5 animate-pulse shadow-sm">
      <div className="flex gap-2">
        <div className="h-4 w-1/2 rounded-full bg-slate-100" />
        <div className="h-4 w-16 rounded-full bg-slate-100 ml-auto" />
      </div>
      <div className="h-3 w-full rounded-full bg-slate-50" />
      <div className="h-3 w-4/5 rounded-full bg-slate-50" />
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-4xl">{icon}</span>
      <p className="text-xs text-slate-400 text-center max-w-[200px] leading-relaxed">{text}</p>
    </div>
  );
}

function SearchResultCard({ result, onClick }: { result: SearchResult; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-white border border-slate-200 p-4 active:scale-[0.98] hover:border-slate-300 hover:shadow-md transition-all duration-150 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="font-semibold text-slate-800 text-sm leading-snug">{result.name}</p>
        <div className="flex shrink-0 gap-1 flex-wrap justify-end">
          {result.cas_number && (
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs text-sky-700 font-mono">
              {result.cas_number}
            </span>
          )}
          {result.un_number && (
            <span className="rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-xs text-violet-700 font-mono">
              {result.un_number}
            </span>
          )}
        </div>
      </div>
      {result.description && (
        <p className="text-xs text-slate-400 line-clamp-1">{result.description}</p>
      )}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs text-slate-400">상세 보기</span>
        <span className="text-xs text-slate-400">&rarr;</span>
      </div>
    </button>
  );
}

// AI 가 만든 응급처치 문장은 보여주지도 읽어주지도 않는다 — 검증 카드나 공식 자료로만 보낸다
function AISearchResultCard({ item }: { item: AISearchResult }) {
  return (
    <div className="w-full rounded-2xl bg-white border border-amber-200 p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-xs font-semibold text-amber-700">AI</span>
          <p className="font-semibold text-slate-800 text-sm leading-snug">{item.name_ko}</p>
        </div>
        <div className="flex shrink-0 gap-1 flex-wrap justify-end">
          {item.cas_number && (
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs text-sky-700 font-mono">
              {item.cas_number}
            </span>
          )}
          {item.un_number && (
            <span className="rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-xs text-violet-700 font-mono">
              {item.un_number}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2">
        {item.name_en}{item.formula ? ` (${item.formula})` : ''}{item.hazard_class ? ` · ${item.hazard_class}` : ''}
      </p>
      <AiDbLink cas={item.cas_number} name={item.name_ko} />
    </div>
  );
}

function AIEstimationCard({ item, index, onNameClick }: {
  item: AIEstimation;
  index: number;
  onNameClick: (name: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
            {index + 1}
          </span>
          <button
            onClick={() => onNameClick(item.chemical_name)}
            className="font-semibold text-slate-800 text-sm hover:text-blue-700 transition-colors text-left leading-snug"
          >
            {item.chemical_name}
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {item.cas_number && (
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs text-sky-700 font-mono hidden sm:inline">
              {item.cas_number}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${confidenceBadge(item.confidence)}`}>
            {item.confidence}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{item.reasoning}</p>

      <AiDbLink cas={item.cas_number} name={item.chemical_name} />
    </div>
  );
}

function useVoice() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((onResult: (text: string) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const text = e.results[0]?.[0]?.transcript;
      if (text) onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { listening, speaking, startListening, stopListening, speak, stopSpeaking };
}

function WindowA({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResults, setAiResults] = useState<AISearchResult[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState<string | null>(null);
  const [aiError, setAiError] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const voice = useVoice();

  // AI 검색은 비용·환각 위험이 있어 키 입력마다 부르지 않는다 — 버튼을 누르거나 검증 데이터가 0건일 때만.
  const runAi = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setAiQuery(q);
    setAiError('');
    setAiResults([]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/search-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
        signal: abort.signal,
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        setAiError(err?.error ?? `AI 검색 오류 (${res.status})`);
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const match = accumulated.match(/\[[\s\S]*\]/);
          if (match) {
            try { setAiResults(JSON.parse(match[0])); } catch { /* incomplete */ }
          }
        }
        const final = accumulated.match(/\[[\s\S]*\]/);
        if (final) {
          try { setAiResults(JSON.parse(final[0])); } catch { /* parse error */ }
        }
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setAiError('네트워크 오류로 AI 검색을 하지 못했습니다.');
    }
    setAiLoading(false);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    abortRef.current?.abort();
    // 검색어가 바뀌면 이전 AI 결과를 즉시 비워야 다른 물질 결과가 남지 않는다(B 단계에서 검색 개편 시 정리)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAiResults([]);
    setAiQuery(null);
    setAiError('');
    setAiLoading(false);
    const q = query.trim();
    if (!q) { setResults([]); return; }

    // 검증 데이터 검색은 브라우저에서 바로 한다 — 오프라인에서도 동작해야 하므로 서버를 거치지 않는다
    timerRef.current = setTimeout(() => {
      const local = q.length >= 2 ? searchChemicals(q).map(toSearchResult) : [];
      setResults(local);
      if (local.length === 0 && q.length >= 2) {
        aiTimerRef.current = setTimeout(() => runAi(q), 500);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      abortRef.current?.abort();
    };
  }, [query, runAi]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">&#128269;</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="물질명, CAS 번호, UN 번호..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => {
            if (voice.listening) { voice.stopListening(); }
            else { voice.startListening((text) => setQuery(text)); }
          }}
          className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
            voice.listening
              ? 'bg-rose-50 ring-2 ring-rose-300 animate-pulse'
              : 'bg-white border border-slate-200 hover:bg-slate-50'
          }`}
          title="음성 검색"
        >
          <span className="text-lg">{voice.listening ? '⏹' : '🎤'}</span>
        </button>
        {voice.speaking && (
          <button
            onClick={() => voice.stopSpeaking()}
            className="shrink-0 w-12 h-12 rounded-2xl bg-blue-50 ring-2 ring-blue-300 flex items-center justify-center animate-pulse"
            title="읽기 중지"
          >
            <span className="text-lg">🔇</span>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pb-2">

        {!aiLoading && !query.trim() && <HomeQuickStart onAskAi={setQuery} />}

        {results.length > 0 && (
          <>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider px-1">검증 데이터</p>
            {results.map((r) => (
              <SearchResultCard key={r.id} result={r} onClick={() => router.push(`/chemical/${r.id}`)} />
            ))}
          </>
        )}

        {!aiLoading && query.trim().length >= 2 && results.length > 0 && aiQuery !== query.trim() && (
          <button
            onClick={() => runAi(query.trim())}
            className="w-full rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50"
          >
            검증 데이터 밖의 관련 물질 AI로 찾기
          </button>
        )}

        {aiError && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="text-xs text-rose-700">{aiError}</p>
          </div>
        )}

        {query.trim() && (aiLoading || aiResults.length > 0) && (
          <>
            <div className="flex items-center gap-2 px-1 mt-2">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider">AI 검색 결과</p>
              {aiLoading && (
                <span className="inline-block w-3 h-3 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              )}
            </div>
            <AiDisclaimer />
            {aiLoading && aiResults.length === 0 && <><SkeletonCard /><SkeletonCard /></>}
            {aiResults.map((item, i) => (
              <AISearchResultCard key={`${item.cas_number}-${i}`} item={item} />
            ))}
          </>
        )}

        {!aiLoading && query.trim() && results.length === 0 && aiResults.length === 0 && (
          <EmptyState icon="&#128270;" text="검색 결과가 없습니다" />
        )}
      </div>
    </div>
  );
}

function WindowB({ onSearchName }: { onSearchName: (name: string) => void }) {
  const [description, setDescription] = useState('');
  const [estimations, setEstimations] = useState<AIEstimation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    const desc = description.trim();
    if (!desc || loading) return;
    setLoading(true);
    setEstimations([]);
    setError('');
    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        setError(errBody?.error ?? `오류 (${res.status})`);
        return;
      }
      if (!res.body) { setError('응답 스트림 없음'); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const match = accumulated.match(/\[[\s\S]*\]/);
        if (match) {
          try { setEstimations(JSON.parse(match[0])); } catch { /* incomplete */ }
        }
      }
      const final = accumulated.match(/\[[\s\S]*\]/);
      if (final) {
        try { setEstimations(JSON.parse(final[0])); }
        catch { setError('AI 응답 파싱 실패. 다시 시도해 주세요.'); }
      } else if (estimations.length === 0) {
        setError('추정 결과를 찾을 수 없습니다.');
      }
    } catch { setError('네트워크 오류가 발생했습니다.'); }
    finally { setLoading(false); }
  }, [description, estimations.length, loading]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="space-y-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSubmit(); } }}
          placeholder="예시: 창고에서 노란 연기 발생, 눈이 따갑고 숨쉬기 힘들며 달걀 썩는 냄새가 남..."
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !description.trim()}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              분석 중...
            </span>
          ) : '추정 시작'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pb-2">
        {loading && <><SkeletonCard /><SkeletonCard /></>}
        {!loading && estimations.length === 0 && !error && (
          <EmptyState icon="&#128173;" text="증상, 냄새, 색깔, 장소 등을 자세히 설명할수록 정확도가 높아집니다" />
        )}
        {estimations.length > 0 && <AiDisclaimer />}
        {estimations.map((item, i) => (
          <AIEstimationCard
            key={`${item.chemical_name}-${i}`}
            item={item}
            index={i}
            onNameClick={onSearchName}
          />
        ))}
      </div>
    </div>
  );
}

/** /?q=염소 로 들어오면(사진 식별 결과 등) 검색창을 채운다 */
function QueryParamSync({ onQuery }: { onQuery: (q: string) => void }) {
  const q = useSearchParams().get('q');
  useEffect(() => {
    if (q) onQuery(q);
  }, [q, onQuery]);
  return null;
}

export default function Home() {
  const [tab, setTab] = useState<'a' | 'b'>('a');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFromEstimation = useCallback((name: string) => {
    setSearchQuery(name);
    setTab('a');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Suspense fallback={null}>
        <QueryParamSync onQuery={handleSearchFromEstimation} />
      </Suspense>

      {/* 헤더 */}
      <header className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-3">
          <img src="/logo.png" alt="대한화학손상연구회" className="h-9 object-contain" />
          <div className="flex-1" />
          <DisplayControls />
        </div>

        {/* 검색 / 증상 추정 전환 — 헤더와 한 덩어리로 붙어 다닌다 */}
        <div className="max-w-4xl mx-auto px-4 flex md:hidden">
          {[
            { key: 'a', label: '물질 검색' },
            { key: 'b', label: '증상으로 추정' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as 'a' | 'b')}
              aria-pressed={tab === key}
              className={`flex-1 py-2 text-base border-b-[3px] ${
                tab === key ? 'border-erg text-slate-900 font-bold' : 'border-transparent text-slate-500 font-medium'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* 데스크톱: 2분할 / 모바일: 탭 전환 */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex overflow-hidden">
        <section className={`flex-1 min-w-0 flex flex-col p-4 ${tab !== 'a' ? 'hidden md:flex' : ''}`}>
          <WindowA query={searchQuery} setQuery={setSearchQuery} />
        </section>

        <div className="hidden md:block w-px bg-slate-200 my-4" />

        <section className={`flex-1 min-w-0 flex flex-col p-4 ${tab !== 'b' ? 'hidden md:flex' : ''}`}>
          <WindowB onSearchName={handleSearchFromEstimation} />
        </section>
      </main>

      {/* 푸터 */}
      <footer className="shrink-0 border-t border-slate-200 py-4 px-4 space-y-0.5 bg-white">
        <p className="text-center text-xs text-slate-400 tracking-wide">대한화학손상연구회</p>
        <p className="text-center text-xs text-slate-500">만든이 정회원 정기홍</p>
      </footer>

    </div>
  );
}
