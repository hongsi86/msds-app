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
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[11px] text-sky-700 font-mono">
              {result.cas_number}
            </span>
          )}
          {result.un_number && (
            <span className="rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-[11px] text-violet-700 font-mono">
              {result.un_number}
            </span>
          )}
        </div>
      </div>
      {result.description && (
        <p className="text-xs text-slate-400 line-clamp-1">{result.description}</p>
      )}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[11px] text-slate-400">상세 보기</span>
        <span className="text-[11px] text-slate-400">&rarr;</span>
      </div>
    </button>
  );
}

function AISearchResultCard({ item, onSpeak }: { item: AISearchResult; onSpeak?: (text: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-2xl bg-white border border-amber-200 p-4 active:scale-[0.98] hover:border-amber-300 hover:shadow-md transition-all duration-150 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">AI</span>
          <p className="font-semibold text-slate-800 text-sm leading-snug">{item.name_ko}</p>
        </div>
        <div className="flex shrink-0 gap-1 flex-wrap justify-end">
          {item.cas_number && (
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[11px] text-sky-700 font-mono">
              {item.cas_number}
            </span>
          )}
          {item.un_number && (
            <span className="rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-[11px] text-violet-700 font-mono">
              {item.un_number}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-500 line-clamp-1">
        {item.name_en}{item.formula ? ` (${item.formula})` : ''} &middot; {item.hazard_class}
      </p>
      {item.appearance && (
        <p className="text-xs text-slate-400 mt-0.5">{item.appearance}{item.odor ? ` · ${item.odor}` : ''}</p>
      )}

      {expanded && item.first_aid_summary && (
        <div className="mt-3 rounded-xl bg-amber-50/60 border border-amber-100 p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">응급처치 요약</p>
          {[
            { label: '흡입', icon: '💨', text: item.first_aid_summary.inhalation },
            { label: '피부', icon: '🖐', text: item.first_aid_summary.skin },
            { label: '눈', icon: '👁', text: item.first_aid_summary.eye },
            { label: '섭취', icon: '🍽', text: item.first_aid_summary.ingestion },
          ].map((fa) => (
            <div key={fa.label}>
              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{fa.icon} {fa.label}</p>
              <p className="text-xs text-slate-700 leading-relaxed">{fa.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <span className="text-[11px] text-slate-400">{expanded ? '접기' : '응급처치 보기'}</span>
        <span className="text-[11px] text-slate-400">{expanded ? '▲' : '▼'}</span>
        {onSpeak && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              const fa = item.first_aid_summary;
              onSpeak(`${item.name_ko}. 흡입 시: ${fa.inhalation}. 피부 접촉 시: ${fa.skin}. 눈 접촉 시: ${fa.eye}. 섭취 시: ${fa.ingestion}`);
            }}
            className="ml-auto text-[11px] text-blue-600 hover:text-blue-700"
          >
            🔊 읽기
          </span>
        )}
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
    <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500">
            {index + 1}
          </span>
          <button
            onClick={() => onNameClick(item.chemical_name)}
            className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition-colors text-left leading-snug"
          >
            {item.chemical_name}
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {item.cas_number && (
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[11px] text-sky-700 font-mono hidden sm:inline">
              {item.cas_number}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${confidenceBadge(item.confidence)}`}>
            {item.confidence}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">{item.reasoning}</p>

      {item.immediate_actions.length > 0 && (
        <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">즉각 조치</p>
          {item.immediate_actions.map((action, i) => (
            <p key={i} className="text-xs text-slate-700 flex gap-2">
              <span className="text-amber-500 shrink-0">&bull;</span>
              {action}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function GuideSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-slate-50 transition-colors">
        <span className="text-base shrink-0">{icon}</span>
        <p className="text-sm font-semibold text-slate-700 flex-1">{title}</p>
        <span className="text-slate-400 text-xs shrink-0">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3">{children}</div>}
    </div>
  );
}

function GuideBullet({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-blue-500 shrink-0 mt-0.5 text-xs">&bull;</span>
      <div>
        <p className="text-xs text-slate-700 leading-relaxed">{text}</p>
        {sub && <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function FieldResponseGuide() {
  return (
    <div className="space-y-2">
      <div className="px-1 pb-1">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">화학물질 사고 현장대응 가이드</p>
        <p className="text-[10px] text-slate-400 mt-0.5">물질명을 검색하거나, 아래 가이드를 참고하세요</p>
      </div>

      <GuideSection icon="🛡" title="1. 현장 접근 및 안전 확보">
        <GuideBullet text="풍향 확인 — 반드시 바람을 등지고(풍상) 접근" />
        <GuideBullet text="초기 격리거리: 최소 25~50m (폭발·독성 가스는 100m 이상)" sub="ERG 2024 기준, 물질별 격리거리 확인 필수" />
        <GuideBullet text="Hot / Warm / Cold Zone 구분 설정" sub="Hot: 오염원 중심 / Warm: 제독 구역 / Cold: 안전 구역" />
        <GuideBullet text="2차 오염 방지 — 개인보호장비(PPE) 미착용 시 절대 진입 금지" />
        <GuideBullet text="위험물 표지판·용기 라벨·UN 번호·NFPA 다이아몬드 확인" />
      </GuideSection>

      <GuideSection icon="🧰" title="2. 개인보호장비(PPE) 선택">
        <div className="grid grid-cols-2 gap-2">
          {[
            { level: 'A', color: 'text-rose-700 bg-rose-50 border-rose-200', desc: '완전 밀폐형 화학복 + SCBA\n미지의 물질, 고농도 독성 가스, IDLH 환경' },
            { level: 'B', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'SCBA + 비밀폐형 화학복\n호흡 위험은 높으나 피부 흡수 위험 낮을 때' },
            { level: 'C', color: 'text-blue-700 bg-blue-50 border-blue-200', desc: '공기정화식 마스크 + 화학복\n물질 확인됨, 농도 측정 가능 시' },
            { level: 'D', color: 'text-slate-600 bg-slate-50 border-slate-200', desc: '일반 작업복\n화학 위험 없는 구역에서만' },
          ].map((ppe) => (
            <div key={ppe.level} className={`rounded-xl border p-2.5 ${ppe.color}`}>
              <p className="text-xs font-bold">Level {ppe.level}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1 whitespace-pre-line">{ppe.desc}</p>
            </div>
          ))}
        </div>
      </GuideSection>

      <GuideSection icon="🚑" title="3. 현장 응급처치 원칙">
        <GuideBullet text="흡입: 즉시 신선한 공기로 이동, 의식 확인, SpO₂ 모니터링" sub="호흡 곤란 시 산소 투여 15L/min NRB 마스크" />
        <GuideBullet text="피부 접촉: 오염 의복 즉시 제거(2차 오염 주의), 흐르는 물 15~20분 세척" sub="중화제 사용 금지 — 발열 반응으로 2차 손상 유발" />
        <GuideBullet text="눈 접촉: 생리식염수 또는 흐르는 물로 최소 15~20분 세안" sub="콘택트렌즈 즉시 제거, 눈꺼풀 젖혀 결막낭까지 세척" />
        <GuideBullet text="섭취: 구토 유도 금지(부식성 물질 재손상), 의식 있으면 물 소량 투여" />
        <GuideBullet text="불화수소(HF) 노출: 글루콘산칼슘 겔 도포 — 일반 세척만으로 불충분" />
        <GuideBullet text="시안화물 노출: 히드록소코발라민(Cyanokit) 또는 아질산나트륨 키트 준비" />
      </GuideSection>

      <GuideSection icon="🏥" title="4. 병원 전 / 병원 내 조치">
        <GuideBullet text="이송 전: 현장 제독 완료 확인, 오염 의복 밀봉 보관" sub="병원 2차 오염 방지 — 제독 미완료 환자 병원 반입 시 의료진 위험" />
        <GuideBullet text="물질명·CAS 번호·노출 경로·노출 시간·추정 농도 기록하여 병원 전달" />
        <GuideBullet text="혈액검사: CBC, 전해질, 간·신기능, 동맥혈가스분석(ABGA), 젖산(Lactate)" sub="물질에 따라 메트헤모글로빈, 카복시헤모글로빈, 콜린에스테라제 추가" />
        <GuideBullet text="흉부 X-ray: 폐부종 여부 확인 (포스겐, NOx 등은 지연성 폐부종 주의)" />
        <GuideBullet text="해독제 확보 여부 사전 확인" sub="히드록소코발라민(시안화물), 아트로핀+프랄리독심(유기인계), 글루콘산칼슘(불산)" />
        <GuideBullet text="경과 관찰: 최소 6~24시간 (지연성 독성 물질 노출 시)" />
      </GuideSection>

      <GuideSection icon="📋" title="5. 제독(Decontamination) 절차">
        <GuideBullet text="건식 제독: 분말·고체 물질은 먼저 브러시로 털어내기" />
        <GuideBullet text="습식 제독: 다량의 물 + 중성 세제로 세척 (위→아래 방향)" sub="오염수 유출 방지 — 수거 후 적절히 처리" />
        <GuideBullet text="제독 순서: 가장 심한 오염 부위부터, 머리→몸통→사지 순" />
        <GuideBullet text="제독 후: 깨끗한 담요·가운 제공, 저체온 방지" />
      </GuideSection>

      <GuideSection icon="⚠️" title="6. 절대 금지 사항">
        <GuideBullet text="PPE 미착용 상태로 오염 구역 진입 금지" />
        <GuideBullet text="부식성 물질 섭취 시 구토 유도 금지" />
        <GuideBullet text="산·알칼리에 중화제(반대 물질) 사용 금지 — 발열·가스 발생" />
        <GuideBullet text="화재 시 물 사용 주의 — 금수성 물질(Na, K, Li, Mg) 확인" sub="금수성 물질: 마른 모래, 팽창질석, D급 소화기 사용" />
        <GuideBullet text="미확인 물질 냄새 맡기·직접 접촉 금지" />
        <GuideBullet text="밀폐 공간 단독 진입 금지 — 반드시 2인 1조 이상" />
      </GuideSection>

      <GuideSection icon="📞" title="7. 신고 및 연락처">
        <GuideBullet text="119 (소방/구급) — 화학사고 발생 즉시 신고" />
        <GuideBullet text="화학물질안전원 사고대응 1600-2075 (24시간)" />
        <GuideBullet text="환경부 화학사고 신고 110" />
        <GuideBullet text="독극물 정보센터 02-2030-1111 (서울대병원)" sub="물질 정보, 해독제, 치료 지침 문의" />
        <GuideBullet text="CHEMTRAC (화학물질운송사고) 1577-8382" />
      </GuideSection>
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
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const voice = useVoice();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const q = query.trim();
    if (!q) { setResults([]); setAiResults([]); return; }

    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const abort = new AbortController();
      abortRef.current = abort;

      setLoading(true);
      setAiLoading(true);
      setAiResults([]);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : data.results ?? []);
        }
      } catch { /* ignore */ }
      setLoading(false);

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
        {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

        {!loading && !aiLoading && !query.trim() && <FieldResponseGuide />}

        {!loading && results.length > 0 && (
          <>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider px-1">검증 데이터</p>
            {results.map((r) => (
              <SearchResultCard key={r.id} result={r} onClick={() => router.push(`/chemical/${r.id}`)} />
            ))}
          </>
        )}

        {query.trim() && (aiLoading || aiResults.length > 0) && (
          <>
            <div className="flex items-center gap-2 px-1 mt-2">
              <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider">AI 검색 결과</p>
              {aiLoading && (
                <span className="inline-block w-3 h-3 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 px-1 -mt-1">AI 생성 참고용 &middot; 공식 MSDS 확인 필요</p>
            {aiLoading && aiResults.length === 0 && <><SkeletonCard /><SkeletonCard /></>}
            {aiResults.map((item, i) => (
              <AISearchResultCard key={`${item.cas_number}-${i}`} item={item} onSpeak={voice.speak} />
            ))}
          </>
        )}

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
          <p className="text-xs text-rose-600">{error}</p>
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
  const router = useRouter();
  const [tab, setTab] = useState<'a' | 'b'>('a');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFromEstimation = useCallback((name: string) => {
    setSearchQuery(name);
    setTab('a');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">

      {/* 헤더 */}
      <header className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm">CG</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight">ChemGuard</h1>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">화학물질 사고 대응 플랫폼</p>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => router.push('/vision')}
            className="flex items-center gap-1.5 rounded-xl bg-violet-50 border border-violet-200 px-2.5 py-2 hover:bg-violet-100 transition-colors"
          >
            <span className="text-sm">📸</span>
            <span className="text-xs font-semibold text-violet-700 hidden sm:inline">식별</span>
          </button>
          <button
            onClick={() => router.push('/map')}
            className="flex items-center gap-1.5 rounded-xl bg-teal-50 border border-teal-200 px-2.5 py-2 hover:bg-teal-100 transition-colors"
          >
            <span className="text-sm">🗺️</span>
            <span className="text-xs font-semibold text-teal-700 hidden sm:inline">지도</span>
          </button>
          <button
            onClick={() => router.push('/zone')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-2.5 py-2 hover:bg-rose-100 transition-colors"
          >
            <span className="text-sm">📷</span>
            <span className="text-xs font-semibold text-rose-700 hidden sm:inline">Zone</span>
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-2 hover:bg-amber-100 transition-colors"
          >
            <span className="text-sm">📋</span>
            <span className="text-xs font-semibold text-amber-700 hidden sm:inline">상황판</span>
          </button>
        </div>
      </header>

      {/* 탭 바 */}
      <div className="shrink-0 sticky top-[57px] z-10 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex">
          {[
            { key: 'a', icon: '🧪', label: '물질 검색', sub: '물질명 · CAS · UN' },
            { key: 'b', icon: '🔬', label: '증상 추정', sub: '증상·상황 설명' },
          ].map(({ key, icon, label, sub }) => (
            <button
              key={key}
              onClick={() => setTab(key as 'a' | 'b')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all border-b-2 ${
                tab === key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
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
        <p className="text-center text-[11px] text-slate-400 tracking-wide">대한화학손상연구회</p>
        <p className="text-center text-[10px] text-slate-300">만든이 정회원 정기홍</p>
      </footer>

    </div>
  );
}
