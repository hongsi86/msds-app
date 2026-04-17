'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type RoleType = 'EMS' | 'MED' | 'DM' | 'CSA';

interface TimelineEvent {
  id: string;
  timestamp: string;
  role: RoleType;
  message: string;
  type: 'action' | 'info' | 'alert' | 'update';
}

interface ChecklistItem {
  id: string;
  role: RoleType;
  task: string;
  completed: boolean;
  completed_at?: string;
}

interface Incident {
  id: string;
  title: string;
  chemical_name: string;
  severity: 1 | 2 | 3;
  status: 'active' | 'contained' | 'resolved';
  created_at: string;
  injured: number;
  deceased: number;
  evacuated: number;
  timeline: TimelineEvent[];
  checklist: ChecklistItem[];
}

const ROLE_COLORS: Record<RoleType, string> = {
  EMS: 'bg-red-500/15 text-red-300 ring-red-500/30',
  MED: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  DM: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  CSA: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
};

const ROLE_BG: Record<RoleType, string> = {
  EMS: 'border-red-500/30',
  MED: 'border-blue-500/30',
  DM: 'border-orange-500/30',
  CSA: 'border-purple-500/30',
};

const TYPE_ICONS: Record<string, string> = {
  action: '✅',
  info: 'ℹ️',
  alert: '🔔',
  update: '🔄',
};

const SEVERITY_COLORS = {
  1: 'bg-green-500/15 text-green-300 ring-green-500/30',
  2: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  3: 'bg-red-500/15 text-red-300 ring-red-500/30',
};

const SEVERITY_LABELS = { 1: '경미', 2: '중대', 3: '심각' };
const STATUS_LABELS = { active: '대응 중', contained: '통제됨', resolved: '종료' };

const DEFAULT_CHECKLISTS: Record<RoleType, string[]> = {
  EMS: ['PPE 착용 확인', '현장 접근 경로 확보', '환자 트리아지 완료', '제염 구역 설치', '이송 병원 확인 및 연락'],
  MED: ['수용 준비 완료', '해독제 재고 확인', '전문의 호출', '격리구역 설정', '검체 채취 준비'],
  DM: ['통제구역 설정', '주민 대피 지시', '유관기관 통보', '언론 대응 준비', '자원 현황 파악'],
  CSA: ['물질 확인 완료', '확산 모델 가동', '환경 모니터링 개시', '법적 신고 완료', '행정처분 검토'],
};

function createDefaultIncident(chemical: string): Incident {
  const now = new Date().toISOString();
  const checklist: ChecklistItem[] = [];
  for (const role of ['EMS', 'MED', 'DM', 'CSA'] as RoleType[]) {
    DEFAULT_CHECKLISTS[role].forEach((task, i) => {
      checklist.push({ id: `${role}-${i}`, role, task, completed: false });
    });
  }

  return {
    id: Date.now().toString(),
    title: `${chemical} 사고 대응`,
    chemical_name: chemical || '미확인 물질',
    severity: 2,
    status: 'active',
    created_at: now,
    injured: 0,
    deceased: 0,
    evacuated: 0,
    timeline: [
      { id: '0', timestamp: now, role: 'DM', message: '사고 상황판 개설', type: 'info' },
    ],
    checklist,
  };
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chemParam = searchParams.get('chemical') || '';

  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeRole, setActiveRole] = useState<RoleType>('EMS');
  const [mobilePanel, setMobilePanel] = useState<'timeline' | 'status' | 'checklist'>('status');
  const [newMessage, setNewMessage] = useState('');
  const [newRole, setNewRole] = useState<RoleType>('DM');
  const [elapsed, setElapsed] = useState('00:00:00');

  // Load or create incident
  useEffect(() => {
    const saved = localStorage.getItem('chemguard_incident');
    if (saved) {
      try { setIncident(JSON.parse(saved)); return; } catch { /* ignore */ }
    }
    setIncident(createDefaultIncident(chemParam));
  }, [chemParam]);

  // Save to localStorage
  useEffect(() => {
    if (incident) localStorage.setItem('chemguard_incident', JSON.stringify(incident));
  }, [incident]);

  // Timer
  useEffect(() => {
    if (!incident) return;
    const interval = setInterval(() => {
      const diff = Date.now() - new Date(incident.created_at).getTime();
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [incident]);

  const addTimelineEvent = useCallback(() => {
    if (!newMessage.trim() || !incident) return;
    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      role: newRole,
      message: newMessage.trim(),
      type: 'action',
    };
    setIncident({ ...incident, timeline: [...incident.timeline, event] });
    setNewMessage('');
  }, [newMessage, newRole, incident]);

  const toggleChecklist = useCallback((itemId: string) => {
    if (!incident) return;
    setIncident({
      ...incident,
      checklist: incident.checklist.map((item) =>
        item.id === itemId
          ? { ...item, completed: !item.completed, completed_at: !item.completed ? new Date().toISOString() : undefined }
          : item
      ),
    });
  }, [incident]);

  const updateCasualties = useCallback((field: 'injured' | 'deceased' | 'evacuated', delta: number) => {
    if (!incident) return;
    setIncident({ ...incident, [field]: Math.max(0, incident[field] + delta) });
  }, [incident]);

  const quickAction = useCallback((message: string) => {
    if (!incident) return;
    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      role: 'DM',
      message,
      type: 'alert',
    };
    setIncident({ ...incident, timeline: [...incident.timeline, event] });
  }, [incident]);

  const newIncident = useCallback(() => {
    localStorage.removeItem('chemguard_incident');
    setIncident(createDefaultIncident(''));
  }, []);

  if (!incident) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><span className="text-zinc-500">로딩 중...</span></div>;

  const roleChecklist = incident.checklist.filter((c) => c.role === activeRole);
  const completedCount = roleChecklist.filter((c) => c.completed).length;
  const progress = roleChecklist.length > 0 ? (completedCount / roleChecklist.length) * 100 : 0;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="shrink-0 sticky top-0 z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-8 h-8 rounded-lg bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-zinc-400 text-sm">←</button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold truncate">{incident.title}</h1>
              <span className={`shrink-0 rounded-full ring-1 px-2 py-0.5 text-[10px] font-semibold ${SEVERITY_COLORS[incident.severity]}`}>
                {SEVERITY_LABELS[incident.severity]}
              </span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                incident.status === 'active' ? 'bg-red-500/15 text-red-300' :
                incident.status === 'contained' ? 'bg-amber-500/15 text-amber-300' : 'bg-green-500/15 text-green-300'
              }`}>
                {STATUS_LABELS[incident.status]}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">{incident.chemical_name} · 경과 {elapsed}</p>
          </div>
          <button onClick={newIncident} className="shrink-0 rounded-lg bg-zinc-800 ring-1 ring-zinc-700 px-3 py-1.5 text-[11px] text-zinc-400 hover:text-zinc-100 transition-colors">
            + 새 사고
          </button>
        </div>
      </header>

      {/* Mobile panel tabs */}
      <div className="md:hidden shrink-0 bg-zinc-950/95 border-b border-zinc-800/60">
        <div className="flex">
          {([['timeline', '📋 타임라인'], ['status', '📊 현황'], ['checklist', '✅ 체크리스트']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMobilePanel(key)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all ${mobilePanel === key ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full flex overflow-hidden">
        {/* Timeline panel */}
        <section className={`flex-1 min-w-0 flex flex-col border-r border-zinc-800/60 ${mobilePanel !== 'timeline' ? 'hidden md:flex' : ''}`}>
          <div className="px-4 pt-3 pb-2">
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">타임라인</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-2 min-h-0">
            {incident.timeline.map((event) => (
              <div key={event.id} className={`rounded-xl bg-zinc-800/60 ring-1 ring-zinc-700/40 p-3 border-l-2 ${ROLE_BG[event.role]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs">{TYPE_ICONS[event.type]}</span>
                  <span className={`rounded-full ring-1 px-1.5 py-0.5 text-[9px] font-bold ${ROLE_COLORS[event.role]}`}>{event.role}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">{formatTime(event.timestamp)}</span>
                </div>
                <p className="text-xs text-zinc-300">{event.message}</p>
              </div>
            ))}
          </div>
          {/* Add event */}
          <div className="shrink-0 border-t border-zinc-800/60 px-4 py-3 space-y-2">
            <div className="flex gap-1.5">
              {(['EMS', 'MED', 'DM', 'CSA'] as RoleType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${newRole === r ? ROLE_COLORS[r] + ' ring-1' : 'bg-zinc-800 text-zinc-500'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTimelineEvent(); }}
                placeholder="상황 기록 입력..."
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-700/60 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-blue-500/60"
              />
              <button
                onClick={addTimelineEvent}
                disabled={!newMessage.trim()}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-blue-500 transition-all"
              >
                전송
              </button>
            </div>
          </div>
        </section>

        {/* Status panel */}
        <section className={`w-full md:w-72 shrink-0 flex flex-col p-4 space-y-3 overflow-y-auto border-r border-zinc-800/60 ${mobilePanel !== 'status' ? 'hidden md:flex' : ''}`}>
          <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">현황</p>

          {/* Casualties */}
          <div className="space-y-2">
            {([
              { field: 'injured' as const, label: '부상자', icon: '🤕', color: 'text-orange-400' },
              { field: 'deceased' as const, label: '사망자', icon: '⚫', color: 'text-red-400' },
              { field: 'evacuated' as const, label: '대피자', icon: '🏃', color: 'text-blue-400' },
            ]).map(({ field, label, icon, color }) => (
              <div key={field} className="flex items-center gap-2 rounded-xl bg-zinc-800/60 ring-1 ring-zinc-700/40 px-3 py-2">
                <span className="text-sm">{icon}</span>
                <span className={`text-xs font-semibold flex-1 ${color}`}>{label}</span>
                <button onClick={() => updateCasualties(field, -1)} className="w-7 h-7 rounded-lg bg-zinc-700 text-zinc-300 text-sm font-bold hover:bg-zinc-600">−</button>
                <span className="text-sm font-bold w-8 text-center">{incident[field]}</span>
                <button onClick={() => updateCasualties(field, 1)} className="w-7 h-7 rounded-lg bg-zinc-700 text-zinc-300 text-sm font-bold hover:bg-zinc-600">+</button>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-zinc-600 font-semibold">빠른 조치</p>
            {[
              { label: '🚨 대피 명령', msg: '[DM] 주민 대피 명령 발령' },
              { label: '🚒 증원 요청', msg: '[DM] 추가 소방 인력 증원 요청' },
              { label: '✅ 상황 종료', msg: '[DM] 사고 상황 종료 선언' },
            ].map(({ label, msg }) => (
              <button
                key={label}
                onClick={() => quickAction(msg)}
                className="w-full rounded-xl bg-zinc-800/60 ring-1 ring-zinc-700/40 px-3 py-2.5 text-left text-xs font-semibold text-zinc-300 hover:bg-zinc-700/60 active:scale-[0.98] transition-all"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Severity control */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-zinc-600 font-semibold">심각도 변경</p>
            <div className="flex gap-1.5">
              {([1, 2, 3] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setIncident({ ...incident, severity: s })}
                  className={`flex-1 rounded-lg py-2 text-[11px] font-bold ring-1 transition-all ${incident.severity === s ? SEVERITY_COLORS[s] : 'bg-zinc-800 text-zinc-500 ring-zinc-700'}`}
                >
                  {SEVERITY_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Status control */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-zinc-600 font-semibold">상태 변경</p>
            <div className="flex gap-1.5">
              {(['active', 'contained', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setIncident({ ...incident, status: st })}
                  className={`flex-1 rounded-lg py-2 text-[11px] font-bold ring-1 transition-all ${incident.status === st
                    ? st === 'active' ? 'bg-red-500/15 text-red-300 ring-red-500/30'
                    : st === 'contained' ? 'bg-amber-500/15 text-amber-300 ring-amber-500/30'
                    : 'bg-green-500/15 text-green-300 ring-green-500/30'
                    : 'bg-zinc-800 text-zinc-500 ring-zinc-700'}`}
                >
                  {STATUS_LABELS[st]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist panel */}
        <section className={`flex-1 min-w-0 flex flex-col ${mobilePanel !== 'checklist' ? 'hidden md:flex' : ''}`}>
          <div className="px-4 pt-3 pb-2">
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">역할별 체크리스트</p>
          </div>
          {/* Role tabs */}
          <div className="shrink-0 px-4 flex gap-1.5 pb-2">
            {(['EMS', 'MED', 'DM', 'CSA'] as RoleType[]).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${activeRole === r ? ROLE_COLORS[r] + ' ring-1' : 'bg-zinc-800 text-zinc-500'}`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Progress */}
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">{completedCount}/{roleChecklist.length}</span>
            </div>
          </div>
          {/* Checklist items */}
          <div className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-4 min-h-0">
            {roleChecklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`w-full text-left rounded-xl px-4 py-3 ring-1 flex items-center gap-3 transition-all ${
                  item.completed ? 'bg-zinc-800/40 ring-zinc-700/30' : 'bg-zinc-800/60 ring-zinc-700/50 hover:bg-zinc-700/50'
                }`}
              >
                <span className={`w-5 h-5 rounded-md ring-1 flex items-center justify-center text-xs shrink-0 ${
                  item.completed ? 'bg-green-500/20 ring-green-500/40 text-green-400' : 'ring-zinc-600'
                }`}>
                  {item.completed ? '✓' : ''}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{item.task}</p>
                  {item.completed_at && (
                    <p className="text-[10px] text-zinc-600 mt-0.5">완료 {formatTime(item.completed_at)}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><span className="text-zinc-500">로딩 중...</span></div>}>
      <DashboardContent />
    </Suspense>
  );
}
