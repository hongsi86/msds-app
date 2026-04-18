'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { Chemical, RoleType } from '@/lib/types';
import { getChemicalById } from '@/lib/chemicals-data';

const ROLES: { key: RoleType; label: string; color: string; activeColor: string }[] = [
  { key: 'EMS', label: '🚑 EMS 구급대원', color: 'text-rose-700 border-rose-300', activeColor: 'bg-rose-50 border-rose-300 text-rose-700' },
  { key: 'MED', label: '🏥 MED 의료진', color: 'text-blue-700 border-blue-300', activeColor: 'bg-blue-50 border-blue-300 text-blue-700' },
  { key: 'DM', label: '🎖️ DM 재난관리자', color: 'text-amber-700 border-amber-300', activeColor: 'bg-amber-50 border-amber-300 text-amber-700' },
  { key: 'CSA', label: '🔬 CSA 화학물질안전원', color: 'text-violet-700 border-violet-300', activeColor: 'bg-violet-50 border-violet-300 text-violet-700' },
];

const DANGER_COLORS: Record<number, string> = {
  4: 'bg-rose-600 text-white',
  3: 'bg-orange-500 text-white',
  2: 'bg-amber-400 text-slate-900',
  1: 'bg-emerald-500 text-white',
};

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700 flex gap-2">
            <span className="text-slate-400 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RouteCard({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 mb-2">
      <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function EMSPanel({ protocol }: { protocol: Chemical['ems_protocol'] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200">
        <span className="text-xs text-slate-500">PPE 등급</span>
        <span className="text-2xl font-bold text-rose-700">{protocol.ppe_level}</span>
      </div>

      <Section title="자기보호" items={protocol.self_protection} />

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">노출경로별 처치</p>
        <RouteCard label="흡입" text={protocol.route_treatments.inhalation} />
        <RouteCard label="피부" text={protocol.route_treatments.skin} />
        <RouteCard label="눈" text={protocol.route_treatments.eye} />
        <RouteCard label="섭취" text={protocol.route_treatments.ingestion} />
      </div>

      {protocol.field_medications.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">현장 투약</p>
          {protocol.field_medications.map((med, i) => (
            <div key={i} className="rounded-lg bg-slate-50 border border-slate-100 p-3 mb-2">
              <p className="text-sm font-medium text-slate-800">{med.name}</p>
              {med.dose && <p className="text-xs text-slate-500">{med.dose}</p>}
              {med.note && <p className="text-xs text-slate-400 italic">{med.note}</p>}
            </div>
          ))}
        </div>
      )}

      <Section title="이송 판단 기준" items={protocol.transport_criteria} />

      {protocol.absolute_prohibitions.length > 0 && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">🚫 절대 금지</p>
          <ul className="space-y-1">
            {protocol.absolute_prohibitions.map((item, i) => (
              <li key={i} className="text-sm text-rose-700 flex gap-2">
                <span className="shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MEDPanel({ protocol }: { protocol: Chemical['med_protocol'] }) {
  return (
    <div className="space-y-4">
      <Section title="임상 증상" items={protocol.clinical_symptoms} />
      <Section title="필수 검사" items={protocol.lab_tests} />
      {protocol.antidotes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">해독제·치료약</p>
          {protocol.antidotes.map((med, i) => (
            <div key={i} className="rounded-lg bg-slate-50 border border-slate-100 p-3 mb-2">
              <p className="text-sm font-medium text-slate-800">{med.name}</p>
              {med.dose && <p className="text-xs text-slate-500">{med.dose}</p>}
              {med.note && <p className="text-xs text-slate-400 italic">{med.note}</p>}
            </div>
          ))}
        </div>
      )}
      <Section title="입원 기준" items={protocol.admission_criteria} />
      <Section title="ICU 기준" items={protocol.icu_criteria} />
      <Section title="지연성 독성 모니터링" items={protocol.delayed_toxicity} />
      <Section title="특이 집단 주의" items={protocol.special_populations} />
    </div>
  );
}

function DMPanel({ protocol }: { protocol: Chemical['dm_protocol'] }) {
  return (
    <div className="space-y-4">
      <Section title="통제선 설정" items={protocol.control_zone} />
      <Section title="대피 명령 기준" items={protocol.evacuation_triggers} />
      <Section title="ICS 체크리스트" items={protocol.ics_checklist} />
      <Section title="연계 기관" items={protocol.agencies} />
      <Section title="주민·언론 소통" items={protocol.public_communication} />
      <Section title="종료 기준" items={protocol.termination_criteria} />
    </div>
  );
}

function CSAPanel({ protocol }: { protocol: Chemical['csa_protocol'] }) {
  return (
    <div className="space-y-4">
      <Section title="법적 분류" items={protocol.legal_classification} />
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs text-slate-500 mb-1">사고 보고 시한</p>
        <p className="text-2xl font-bold text-amber-700">{protocol.report_deadline_hours}시간 이내</p>
      </div>
      <Section title="환경 측정 체크리스트" items={protocol.environmental_checks} />
      <Section title="행정 처분" items={protocol.admin_actions} />
      {protocol.dispersion_model && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
          <p className="text-xs text-slate-500 mb-1">확산 예측 모델</p>
          <p className="text-sm text-slate-700">{protocol.dispersion_model}</p>
        </div>
      )}
    </div>
  );
}

export default function ChemicalDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [chemical, setChemical] = useState<Chemical | null>(null);
  const [activeRole, setActiveRole] = useState<RoleType>('EMS');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = getChemicalById(params.id);
    if (found) {
      setChemical(found);
    } else {
      setNotFound(true);
    }
  }, [params.id]);

  useEffect(() => {
    const role = searchParams.get('role') as RoleType | null;
    if (role && ROLES.find((r) => r.key === role)) setActiveRole(role);
  }, [searchParams]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-500 mb-4">물질 정보를 찾을 수 없습니다.</p>
          <button onClick={() => router.push('/')} className="text-sm text-blue-600 underline">
            검색으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!chemical) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const activeRoleMeta = ROLES.find((r) => r.key === activeRole)!;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-slate-700 transition-colors text-lg">
            ←
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">{chemical.name_ko}</h1>
            <p className="text-xs text-slate-400 truncate">{chemical.name_en} · {chemical.formula}</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${DANGER_COLORS[chemical.danger_level]}`}>
            위험 {chemical.danger_level}등급
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-4 pb-16">
        {/* 물질 기본 정보 */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {chemical.cas_number && (
            <div className="rounded-lg bg-white border border-slate-200 p-3 shadow-sm">
              <p className="text-xs text-slate-400">CAS</p>
              <p className="font-mono text-slate-700">{chemical.cas_number}</p>
            </div>
          )}
          {chemical.un_number && (
            <div className="rounded-lg bg-white border border-slate-200 p-3 shadow-sm">
              <p className="text-xs text-slate-400">UN</p>
              <p className="font-mono text-slate-700">{chemical.un_number}</p>
            </div>
          )}
          {chemical.appearance && (
            <div className="rounded-lg bg-white border border-slate-200 p-3 col-span-2 shadow-sm">
              <p className="text-xs text-slate-400">외관·냄새</p>
              <p className="text-slate-700">{chemical.appearance}{chemical.odor ? ` / ${chemical.odor}` : ''}</p>
            </div>
          )}
        </div>

        {/* 역할 탭 */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className={`shrink-0 text-xs px-3 py-2 rounded-lg border transition-all ${
                activeRole === role.key
                  ? role.activeColor
                  : 'border-slate-200 text-slate-400 hover:text-slate-600 bg-white'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* 역할별 내용 */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <h2 className={`text-sm font-semibold mb-4 ${activeRoleMeta.color.split(' ')[0]}`}>
            {activeRoleMeta.label} 대응 프로토콜
          </h2>
          {activeRole === 'EMS' && <EMSPanel protocol={chemical.ems_protocol} />}
          {activeRole === 'MED' && <MEDPanel protocol={chemical.med_protocol} />}
          {activeRole === 'DM' && <DMPanel protocol={chemical.dm_protocol} />}
          {activeRole === 'CSA' && <CSAPanel protocol={chemical.csa_protocol} />}
        </div>
      </div>
      <footer className="max-w-3xl mx-auto px-4 py-4 border-t border-slate-200">
        <p className="text-center text-[11px] text-slate-400 tracking-wide">대한화학손상연구회</p>
        <p className="text-center text-[10px] text-slate-300">만든이 정회원 정기홍</p>
      </footer>
    </div>
  );
}
