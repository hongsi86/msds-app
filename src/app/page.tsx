'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  danger_level: number;
  appearance: string;
  odor?: string;
  first_aid_summary: {
    inhalation: string;
    skin: string;
    eye: string;
    ingestion: string;
  };
}

interface AIEstimation {
  chemical_name: string;
  cas_number?: string;
  confidence: '높음' | '중간' | '낮음';
  reasoning: string;
  immediate_actions: string[];
}

function confidenceBadge(c: AIEstimation['confidence']) {
  if (c === '높음') return 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30';
  if (c === '중간') return 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30';
  return 'bg-zinc-700/50 text-zinc-400 ring-1 ring-zinc-600/50';
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-zinc-800/60 p-4 space-y-2.5 animate-pulse">
      <div className="flex gap-2">
        <div className="h-4 w-1/2 rounded-full bg-zinc-700" />
        <div className="h-4 w-16 rounded-full bg-zinc-700 ml-auto" />
      </div>
      <div className="h-3 w-full rounded-full bg-zinc-700/70" />
      <div className="h-3 w-4/5 rounded-full bg-zinc-700/70" />
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-4xl">{icon}</span>
      <p className="text-xs text-zinc-500 text-center max-w-[200px] leading-relaxed">{text}</p>
    </div>
  );
}

function SearchResultCard({ result, onClick }: { result: SearchResult; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-zinc-800/80 ring-1 ring-zinc-700/60 p-4 active:scale-[0.98] hover:bg-zinc-700/80 hover:ring-zinc-600 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="font-semibold text-zinc-100 text-sm leading-snug">{result.name}</p>
        <div className="flex shrink-0 gap-1 flex-wrap justify-end">
          {result.cas_number && (
            <span className="rounded-full bg-blue-500/10 ring-1 ring-blue-500/30 px-2 py-0.5 text-[11px] text-blue-300 font-mono">
              {result.cas_number}
            </span>
          )}
          {result.un_number && (
            <span className="rounded-full bg-violet-500/10 ring-1 ring-violet-500/30 px-2 py-0.5 text-[11px] text-violet-300 font-mono">
              {result.un_number}
            </span>
          )}
        </div>
      </div>
      {result.description && (
        <p className="text-xs text-zinc-500 line-clamp-1">{result.description}</p>
      )}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[11px] text-zinc-600">상세 보기</span>
        <span className="text-[11px] text-zinc-600">&rarr;</span>
      </div>
    </button>
  );
}

function AISearchResultCard({ item }: { item: AISearchResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-2xl bg-zinc-800/80 ring-1 ring-amber-500/30 p-4 active:scale-[0.98] hover:bg-zinc-700/80 hover:ring-amber-500/50 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 rounded-full bg-amber-500/15 ring-1 ring-amber-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">AI</span>
          <p className="font-semibold text-zinc-100 text-sm leading-snug">{item.name_ko}</p>
        </div>
        <div className="flex shrink-0 gap-1 flex-wrap justify-end">
          {item.cas_number && (
            <span className="rounded-full bg-blue-500/10 ring-1 ring-blue-500/30 px-2 py-0.5 text-[11px] text-blue-300 font-mono">
              {item.cas_number}
            </span>
          )}
          {item.un_number && (
            <span className="rounded-full bg-violet-500/10 ring-1 ring-violet-500/30 px-2 py-0.5 text-[11px] text-violet-300 font-mono">
              {item.un_number}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-zinc-500 line-clamp-1">
        {item.name_en}{item.formula ? ` (${item.formula})` : ''} &middot; {item.hazard_class}
      </p>
      {item.appearance && (
        <p className="text-xs text-zinc-600 mt-0.5">{item.appearance}{item.odor ? ` · ${item.odor}` : ''}</p>
      )}

      {expanded && item.first_aid_summary && (
        <div className="mt-3 rounded-xl bg-amber-500/5 ring-1 ring-amber-500/20 p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">응급처치 요약</p>
          {[
            { label: '흡입', icon: '💨', text: item.first_aid_summary.inhalation },
            { label: '피부', icon: '🖐', text: item.first_aid_summary.skin },
            { label: '눈', icon: '👁', text: item.first_aid_summary.eye },
            { label: '섭취', icon: '🍽', text: item.first_aid_summary.ingestion },
          ].map((fa) => (
            <div key={fa.label}>
              <p className="text-[11px] font-semibold text-zinc-400 mb-0.5">{fa.icon} {fa.label}</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{fa.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mt-2">
        <span className="text-[11px] text-zinc-600">{expanded ? '접기' : '응급처치 보기'}</span>
        <span className="text-[11px] text-zinc-600">{expanded ? '▲' : '▼'}</span>
      </div>
    </button>
  );
}

function AIEstimationCard({ item, index, onNameClick }: {
  item: AIEstimation;
  index: number;
  onNameClick: (name: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-zinc-800/80 ring-1 ring-zinc-700/60 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[11px] font-bold text-zinc-400">
            {index + 1}
          </span>
          <button
            onClick={() => onNameClick(item.chemical_name)}
            className="font-semibold text-zinc-100 text-sm hover:text-blue-300 transition-colors text-left leading-snug"
          >
            {item.chemical_name}
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {item.cas_number && (
            <span className="rounded-full bg-blue-500/10 ring-1 ring-blue-500/30 px-2 py-0.5 text-[11px] text-blue-300 font-mono hidden sm:inline">
              {item.cas_number}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${confidenceBadge(item.confidence)}`}>
            {item.confidence}
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed">{item.reasoning}</p>

      {item.immediate_actions.length > 0 && (
        <div className="rounded-xl bg-amber-500/5 ring-1 ring-amber-500/20 p-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">즉각 조치</p>
          {item.immediate_actions.map((action, i) => (
            <p key={i} className="text-xs text-zinc-300 flex gap-2">
              <span className="text-amber-500 shrink-0">&bull;</span>
              {action}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function WindowA({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResults, setAiResults] = useState<AISearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const q = query.trim();
    if (!q) { setResults([]); setAiResults([]); return; }

    timerRef.current = setTimeout(async () => {
      // Abort previous AI search
      if (abortRef.current) abortRef.current.abort();
      const abort = new AbortController();
      abortRef.current = abort;

      setLoading(true);
      setAiLoading(true);
      setAiResults([]);

      // Local DB search
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : data.results ?? []);
        }
      } catch { /* ignore */ }
      setLoading(false);

      // AI search (always runs in parallel conceptually, starts after local finishes for UX)
      try {
        const res = await fetch('/api/search-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
          signal: abort.signal,
        });
        if (!res.ok || !res.body) { setAiLoading(false); return; }

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
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') { /* expected */ }
      }
      setAiLoading(false);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-base pointer-events-none">&#128269;</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="물질명, CAS 번호, UN 번호..."
          className="w-full rounded-2xl border border-zinc-700/60 bg-zinc-900 pl-9 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pb-2">
        {/* Loading state */}
        {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

        {/* Empty state */}
        {!loading && !aiLoading && !query.trim() && <EmptyState icon="&#129514;" text="물질명, CAS 번호, UN 번호를 입력하면 즉시 검색됩니다" />}

        {/* Local DB results */}
        {!loading && results.length > 0 && (
          <>
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider px-1">검증 데이터</p>
            {results.map((r) => (
              <SearchResultCard key={r.id} result={r} onClick={() => router.push(`/chemical/${r.id}`)} />
            ))}
          </>
        )}

        {/* AI results section */}
        {query.trim() && (aiLoading || aiResults.length > 0) && (
          <>
            <div className="flex items-center gap-2 px-1 mt-2">
              <p className="text-[11px] text-amber-400/80 font-semibold uppercase tracking-wider">AI 검색 결과</p>
              {aiLoading && (
                <span className="inline-block w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-zinc-600 px-1 -mt-1">AI 생성 참고용 &middot; 공식 MSDS 확인 필요</p>
            {aiLoading && aiResults.length === 0 && <><SkeletonCard /><SkeletonCard /></>}
            {aiResults.map((item, i) => (
              <AISearchResultCard key={`${item.cas_number}-${i}`} item={item} />
            ))}
          </>
        )}

        {/* No results at all */}
        {!loading && !aiLoading && query.trim() && results.length === 0 && aiResults.length === 0 && (
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
          className="w-full rounded-2xl border border-zinc-700/60 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !description.trim()}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI 분석 중...
            </span>
          ) : '🤖 AI 추정 시작'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/8 ring-1 ring-red-500/25 px-4 py-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pb-2">
        {loading && <><SkeletonCard /><SkeletonCard /></>}
        {!loading && estimations.length === 0 && !error && (
          <EmptyState icon="&#128173;" text="증상, 냄새, 색깔, 장소 등을 자세히 설명할수록 정확도가 높아집니다" />
        )}
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

export default function Home() {
  const [tab, setTab] = useState<'a' | 'b'>('a');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFromEstimation = useCallback((name: string) => {
    setSearchQuery(name);
    setTab('a');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* 헤더 */}
      <header className="shrink-0 sticky top-0 z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <span className="text-white font-black text-sm">CG</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100 leading-tight tracking-tight">ChemGuard</h1>
            <p className="text-[10px] text-zinc-500 leading-none mt-0.5">화학물질 사고 대응 플랫폼</p>
          </div>
        </div>
      </header>

      {/* 탭 바 */}
      <div className="shrink-0 sticky top-[57px] z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/60">
        <div className="max-w-4xl mx-auto px-4 flex">
          {[
            { key: 'a', icon: '🧪', label: '물질 검색', sub: '물질명 · CAS · UN' },
            { key: 'b', icon: '🤖', label: 'AI 추정', sub: '증상·상황 설명' },
          ].map(({ key, icon, label, sub }) => (
            <button
              key={key}
              onClick={() => setTab(key as 'a' | 'b')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all border-b-2 ${
                tab === key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="text-base">{icon}</span>
              <div className="text-left hidden sm:block">
                <p className="font-semibold leading-tight">{label}</p>
                <p className="text-[10px] opacity-70 leading-none mt-0.5">{sub}</p>
              </div>
              <span className="sm:hidden font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 데스크톱: 2분할 / 모바일: 탭 전환 */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex overflow-hidden">
        {/* 창구 A */}
        <section className={`flex-1 min-w-0 flex flex-col p-4 ${tab !== 'a' ? 'hidden md:flex' : ''}`}>
          <WindowA query={searchQuery} setQuery={setSearchQuery} />
        </section>

        {/* 구분선 (데스크톱) */}
        <div className="hidden md:block w-px bg-zinc-800/80 my-4" />

        {/* 창구 B */}
        <section className={`flex-1 min-w-0 flex flex-col p-4 ${tab !== 'b' ? 'hidden md:flex' : ''}`}>
          <WindowB onSearchName={handleSearchFromEstimation} />
        </section>
      </main>

      {/* 푸터 */}
      <footer className="shrink-0 border-t border-zinc-800/60 py-4 px-4 space-y-0.5">
        <p className="text-center text-[11px] text-zinc-600 tracking-wide">대한화학손상연구회</p>
        <p className="text-center text-[10px] text-zinc-700">만든이 정회원 정기홍</p>
      </footer>

    </div>
  );
}
