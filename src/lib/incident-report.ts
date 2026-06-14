export type RoleType = 'RES' | 'EMS' | 'MED' | 'DM' | 'CSA';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  role: RoleType;
  message: string;
  type: 'action' | 'info' | 'alert' | 'update';
}

export interface ChecklistItem {
  id: string;
  role: RoleType;
  task: string;
  completed: boolean;
  completed_at?: string;
}

export interface Incident {
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

const ROLE_LABEL: Record<RoleType, string> = {
  RES: '🚒 구조 RES',
  EMS: '🚑 구급 EMS',
  MED: '🏥 의료 MED',
  DM: '🎖 재난 DM',
  CSA: '🔬 화학원 CSA',
};

const SEVERITY_LABEL = { 1: '경미', 2: '중대', 3: '심각' } as const;
const STATUS_LABEL = { active: '대응 중', contained: '통제됨', resolved: '종료' } as const;
const TYPE_ICON: Record<TimelineEvent['type'], string> = {
  action: '✓',
  info: 'ℹ',
  alert: '⚠',
  update: '↻',
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function elapsedSince(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}시간 ${m}분`;
}

export function buildReportContext(incident: Incident) {
  const totalChecks = incident.checklist.length;
  const doneChecks = incident.checklist.filter((c) => c.completed).length;
  const byRole = (['RES', 'EMS', 'MED', 'DM', 'CSA'] as RoleType[]).map((role) => {
    const items = incident.checklist.filter((c) => c.role === role);
    const done = items.filter((c) => c.completed).length;
    return { role, label: ROLE_LABEL[role], total: items.length, done };
  });
  const decisions = incident.timeline.filter((e) => e.type === 'alert' || e.type === 'action');
  return {
    incident,
    totalChecks,
    doneChecks,
    progressPct: totalChecks ? Math.round((doneChecks / totalChecks) * 100) : 0,
    byRole,
    decisions,
    severityLabel: SEVERITY_LABEL[incident.severity],
    statusLabel: STATUS_LABEL[incident.status],
    elapsed: elapsedSince(incident.created_at),
    generatedAt: formatDateTime(new Date().toISOString()),
  };
}

export type ReportContext = ReturnType<typeof buildReportContext>;

export { ROLE_LABEL, TYPE_ICON };
