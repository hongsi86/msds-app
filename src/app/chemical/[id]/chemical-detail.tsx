'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Chemical, RoleType } from '@/lib/types';
import { getChemicalById } from '@/lib/chemicals-data';
import { SiteConditionsBar } from '@/components/site-conditions-bar';
import { RadioCard } from '@/components/radio-card';
import { HospitalNotifyCard } from '@/components/hospital-notify-card';
import type { GeoPoint, WeatherSnapshot } from '@/lib/weather';
import { CoreCard } from '@/components/core-card';
import { DisplayControls } from '@/components/display-controls';
import { pushRecent } from '@/lib/recent';

// 짧은 이름으로 5등분 — 가로 스크롤 없이 한 번에 보이게
const ROLES: { key: RoleType; short: string; label: string }[] = [
  { key: 'RES', short: '구조', label: '구조대원 (RES)' },
  { key: 'EMS', short: '구급', label: '구급대원 (EMS)' },
  { key: 'MED', short: '의료', label: '의료진 (MED)' },
  { key: 'DM', short: '재난', label: '재난관리자 (DM)' },
  { key: 'CSA', short: '안전원', label: '화학물질안전원 (CSA)' },
];
const ROLE_KEY = 'cg_role';
const readStoredRole = () => {
  try {
    return localStorage.getItem(ROLE_KEY);
  } catch {
    return null;
  }
};

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
      <h3 className="text-sm font-bold text-slate-600 mb-1.5">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-base text-slate-800 flex gap-2">
            <span className="text-slate-500 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 학회 전문가 감수 체계(Phase 2)가 들어오면 섹션별 감수 배지로 대체한다
function ReviewPendingBanner() {
  return (
    <details className="mb-4 rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-2">
      <summary className="cursor-pointer text-base font-bold text-amber-900">학회 감수 전 — 투약은 의료지도 하에서만</summary>
      <p className="mt-1 text-sm leading-relaxed text-amber-900">
        약물·용량은 대한화학손상연구회 감수가 끝나지 않았습니다. 구급대원 업무범위 밖 투약은 의료지도 하에서만 하고,
        병원에서는 독성학 자문으로 반드시 확인하십시오.
      </p>
    </details>
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

function RESPanel({ protocol }: { protocol: Chemical['res_protocol'] }) {
  const dist = protocol.erg_distance;
  const summary = protocol.erg_action_summary;
  return (
    <div className="space-y-4">
      {protocol.absolute_prohibitions.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-xs font-semibold text-red-700 mb-2">절대 금지 (전체)</p>
          <ul className="space-y-1">
            {protocol.absolute_prohibitions.map((item, i) => (
              <li key={i} className="text-sm text-red-700 flex gap-2">
                <span className="shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 이격거리표 (정량) — ERG2024 표1 등재 물질 우선 표시 */}
      {dist && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">이격거리 (ERG2024 표1)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <p className="font-semibold text-slate-600 mb-1">소량 누출 (≤208L)</p>
              <p className="text-slate-700">초기격리 <span className="font-bold">{dist.initial_isolation_m.small_spill}m</span></p>
              <p className="text-slate-500 mt-1">방호 낮 {dist.protective_action_km.small_day}km</p>
              <p className="text-slate-500">방호 밤 {dist.protective_action_km.small_night}km</p>
            </div>
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="font-semibold text-red-700 mb-1">대량 누출 (&gt;208L)</p>
              <p className="text-slate-700">초기격리 <span className="font-bold">{dist.initial_isolation_m.large_spill}m</span></p>
              <p className="text-red-700 mt-1">방호 낮 {dist.protective_action_km.large_day}km</p>
              <p className="text-red-700 font-semibold">방호 밤 {dist.protective_action_km.large_night}km</p>
            </div>
          </div>
        </div>
      )}

      {/* ERG 정성 안내 (표1 미등재 물질의 주황색 지침 권고) */}
      {!dist && summary && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">초기 격리·방호 거리</p>
          <p className="text-sm text-slate-800">{summary}</p>
        </div>
      )}

      {/* 물 반응성 경고 배너 */}
      {protocol.water_reactive && (
        <div className="rounded-lg bg-amber-50 border-2 border-amber-300 p-3">
          <p className="text-xs font-bold text-amber-800 mb-1">물 반응성 주의</p>
          {protocol.water_reaction_note && (
            <p className="text-sm text-amber-900">{protocol.water_reaction_note}</p>
          )}
        </div>
      )}

      <Section title="현장 접근 원칙" items={protocol.scene_approach} />
      <Section title="화재 진압 전술" items={protocol.fire_tactics} />
      <Section title="누출 통제" items={protocol.leak_control} />

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
        <p className="text-xs font-semibold text-slate-500 mb-1">권장 제독</p>
        <p className="text-sm text-slate-700">{protocol.decon_recommendation}</p>
      </div>

      {/* BLEVE */}
      {protocol.bleve_risk && (
        <div className="rounded-lg bg-orange-50 border-2 border-orange-300 p-3">
          <p className="text-xs font-bold text-orange-800 mb-1">BLEVE 위험</p>
          {protocol.bleve_evacuation_m && (
            <p className="text-sm text-orange-900">
              가연성 액화가스 탱크 화재 시 권장 대피거리 <span className="font-bold">{protocol.bleve_evacuation_m}m 이상</span>
            </p>
          )}
        </div>
      )}

      <Section title="수보 시 전달 정보" items={protocol.resource_request} />

    </div>
  );
}

function EMSPanel({ protocol }: { protocol: Chemical['ems_protocol'] }) {
  return (
    <div className="space-y-4">
      {protocol.absolute_prohibitions.length > 0 && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
          <p className="text-xs font-semibold text-rose-700 mb-2">절대 금지</p>
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
      <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200">
        <span className="text-xs text-slate-500">PPE 등급</span>
        <span className="text-2xl font-bold text-rose-700">{protocol.ppe_level}</span>
      </div>

      <Section title="자기보호" items={protocol.self_protection} />

      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">노출경로별 처치</p>
        <RouteCard label="흡입" text={protocol.route_treatments.inhalation} />
        <RouteCard label="피부" text={protocol.route_treatments.skin} />
        <RouteCard label="눈" text={protocol.route_treatments.eye} />
        <RouteCard label="섭취" text={protocol.route_treatments.ingestion} />
      </div>

      {protocol.field_medications.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">현장 투약</p>
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

    </div>
  );
}

function MEDPanel({ chemical }: { chemical: Chemical }) {
  const protocol = chemical.med_protocol;
  return (
    <div className="space-y-4">
      {chemical.toxicity_data && <ToxicitySection tox={chemical.toxicity_data} />}
      <Section title="임상 증상" items={protocol.clinical_symptoms} />
      <Section title="필수 검사" items={protocol.lab_tests} />
      {protocol.antidotes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">해독제·치료약</p>
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

function PhysicalPropertiesCard({ props: p }: { props: NonNullable<Chemical['physical_properties']> }) {
  const items: { label: string; value: string; highlight?: boolean }[] = [];
  if (p.boiling_point_c !== undefined) items.push({ label: '끓는점', value: `${p.boiling_point_c}°C` });
  if (p.melting_point_c !== undefined) items.push({ label: '녹는점', value: `${p.melting_point_c}°C` });
  if (p.flash_point_c !== undefined) items.push({ label: '인화점', value: `${p.flash_point_c}°C`, highlight: p.flash_point_c < 60 });
  if (p.vapor_pressure_mmhg !== undefined) items.push({ label: '증기압 (20°C)', value: `${p.vapor_pressure_mmhg} mmHg` });
  if (p.vapor_density !== undefined) items.push({ label: '증기밀도 (공기=1)', value: `${p.vapor_density}${p.vapor_density > 1 ? ' · 침강' : ' · 상승'}` });
  if (p.specific_gravity !== undefined) items.push({ label: '비중 (물=1)', value: `${p.specific_gravity}` });
  if (p.ph !== undefined) items.push({ label: 'pH', value: `${p.ph}` });
  if (p.solubility_water) items.push({ label: '물 용해도', value: p.solubility_water });
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg bg-white border border-slate-200 p-3 mb-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500 mb-2">물리화학적 특성</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className={item.highlight ? 'rounded bg-rose-50 border border-rose-200 px-2 py-1.5' : 'px-2 py-1.5'}>
            <p className="text-xs text-slate-400 leading-tight">{item.label}</p>
            <p className={`text-sm font-medium ${item.highlight ? 'text-rose-700' : 'text-slate-700'}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToxicitySection({ tox }: { tox: NonNullable<Chemical['toxicity_data']> }) {
  const fmt = (e?: { value: number; unit: string }) => (e ? `${e.value} ${e.unit}` : '—');
  const has = tox.ld50_oral_rat_mg_kg !== undefined || !!tox.lc50_inhalation_rat || !!tox.iarc_carcinogen || !!tox.acgih_carcinogen || !!tox.twa || !!tox.stel || !!tox.idlh;
  if (!has) return null;
  return (
    <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
      <p className="text-xs font-semibold text-blue-700 mb-2">정량 독성·노출 기준</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        {tox.ld50_oral_rat_mg_kg !== undefined && (
          <div><p className="text-slate-500">LD50 (경구·쥐)</p><p className="font-medium text-slate-800">{tox.ld50_oral_rat_mg_kg} mg/kg</p></div>
        )}
        {tox.lc50_inhalation_rat && (
          <div><p className="text-slate-500">LC50 (흡입·쥐, {tox.lc50_inhalation_rat.hours}h)</p><p className="font-medium text-slate-800">{tox.lc50_inhalation_rat.value} {tox.lc50_inhalation_rat.unit}</p></div>
        )}
        {tox.iarc_carcinogen && (
          <div><p className="text-slate-500">IARC 발암성</p><p className="font-medium text-rose-700">{tox.iarc_carcinogen}군</p></div>
        )}
        {tox.acgih_carcinogen && (
          <div><p className="text-slate-500">ACGIH 발암성</p><p className="font-medium text-slate-800">{tox.acgih_carcinogen}</p></div>
        )}
        {tox.twa && (
          <div><p className="text-slate-500">TWA (8h)</p><p className="font-medium text-slate-800">{fmt(tox.twa)}</p></div>
        )}
        {tox.stel && (
          <div><p className="text-slate-500">STEL (15분)</p><p className="font-medium text-slate-800">{fmt(tox.stel)}</p></div>
        )}
        {tox.idlh && (
          <div><p className="text-slate-500">IDLH</p><p className="font-medium text-rose-700">{fmt(tox.idlh)}</p></div>
        )}
      </div>
    </div>
  );
}

function ExternalMSDSCard({ chemical, onCopy }: { chemical: Chemical; onCopy: () => void }) {
  const cas = chemical.cas_number;
  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  return (
    <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-600 mb-2">정식 MSDS 외부 참조</p>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        ChemGuard는 현장 대응 도구입니다. 법적 요구(취급·저장·폐기·성분%·환경 등 전체 16항목)는 아래 공식 출처를 확인하세요.
      </p>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <button onClick={() => open('https://msds.kosha.or.kr/')} className="rounded-lg bg-white border border-slate-200 px-2 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 transition-colors">
          KOSHA MSDS
        </button>
        <button onClick={() => open('https://ncis.nier.go.kr/')} className="rounded-lg bg-white border border-slate-200 px-2 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 transition-colors">
          NCIS 화학물질
        </button>
        <button onClick={() => open(`https://pubchem.ncbi.nlm.nih.gov/#query=${cas}`)} className="rounded-lg bg-white border border-slate-200 px-2 py-2 text-xs font-medium text-slate-700 hover:border-slate-400 transition-colors">
          PubChem
        </button>
      </div>
      <button onClick={onCopy} className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 text-xs font-medium hover:bg-slate-800 transition-colors">
        CAS 복사 · {cas}
      </button>
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

// useSearchParams 를 쓰면 정적 HTML 이 통째로 클라이언트 렌더링으로 빠져
// 오프라인에서 본문 없는 스피너만 남는다. 서버에선 null(기본 RES 탭)로 그린다.
const noopSubscribe = () => () => {};
const readRoleParam = () => new URLSearchParams(window.location.search).get('role');

export function ChemicalDetail({ id }: { id: string }) {
  const router = useRouter();
  const chemical = getChemicalById(id);
  // ?role=EMS 로 들어오면 그 탭부터, 사용자가 탭을 누르면 그 선택이 우선
  const paramRole = useSyncExternalStore(noopSubscribe, readRoleParam, () => null) as RoleType | null;
  // 마지막에 고른 직군을 기억해 매번 다시 누르지 않게 한다(링크의 ?role= 이 우선)
  const storedRole = useSyncExternalStore(noopSubscribe, readStoredRole, () => null) as RoleType | null;
  const [pickedRole, setPickedRole] = useState<RoleType | null>(null);
  const valid = (r: RoleType | null) => (r && ROLES.some((x) => x.key === r) ? r : null);
  const activeRole: RoleType = pickedRole ?? valid(paramRole) ?? valid(storedRole) ?? 'RES';
  const setActiveRole = (r: RoleType) => {
    setPickedRole(r);
    try {
      localStorage.setItem(ROLE_KEY, r);
    } catch {
      /* 무시 */
    }
  };

  useEffect(() => {
    pushRecent(id);
  }, [id]);
  const [toast, setToast] = useState<string | null>(null);
  const [position, setPosition] = useState<GeoPoint | undefined>(undefined);
  const [weather, setWeather] = useState<WeatherSnapshot | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleSiteChange = useCallback(
    (snap: { position?: GeoPoint; weather?: WeatherSnapshot }) => {
      setPosition(snap.position);
      setWeather(snap.weather);
    },
    []
  );

  const copyCas = () => {
    if (!chemical) return;
    navigator.clipboard.writeText(chemical.cas_number).then(() => {
      showToast('CAS 번호 복사됨');
    });
  };

  if (!chemical) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-500 mb-4">물질 정보를 찾을 수 없습니다.</p>
          <button onClick={() => router.push('/')} className="text-sm text-blue-700 underline">
            검색으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const activeRoleMeta = ROLES.find((r) => r.key === activeRole)!;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-2 py-1.5">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            onClick={() => router.push('/')}
            aria-label="검색으로"
            className="flex w-11 shrink-0 items-center justify-center rounded-lg text-2xl text-slate-700"
          >
            ←
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold leading-tight text-slate-900">{chemical.name_ko}</h1>
            <p className="truncate text-sm text-slate-500">
              {chemical.name_en} · {chemical.formula}
            </p>
          </div>
          <span className={`shrink-0 rounded-md px-2 py-1 text-sm font-bold ${DANGER_COLORS[chemical.danger_level]}`}>
            위험 {chemical.danger_level}
          </span>
          <DisplayControls />
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-3 py-3 pb-8">
        <CoreCard chemical={chemical} />

        {/* 직군 탭: 5등분 */}
        <div role="tablist" aria-label="직군" className="grid grid-cols-5 gap-1 rounded-xl border border-slate-300 bg-white p-1">
          {ROLES.map((role) => (
            <button
              key={role.key}
              role="tab"
              aria-selected={activeRole === role.key}
              onClick={() => setActiveRole(role.key)}
              className={`rounded-lg text-base ${
                activeRole === role.key ? 'bg-slate-900 font-bold text-white' : 'font-medium text-slate-600'
              }`}
            >
              {role.short}
            </button>
          ))}
        </div>

        {/* 역할별 내용 */}
        <div role="tabpanel" className="rounded-xl border border-slate-300 bg-white p-4">
          <h2 className="mb-4 text-base font-bold text-slate-900">{activeRoleMeta.label} 대응</h2>
          {activeRole === 'RES' && (
            <>
              <RESPanel protocol={chemical.res_protocol} />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link href={`/map?chem=${chemical.id}`} className="flex min-h-12 items-center justify-center rounded-lg border-2 border-slate-900 text-base font-bold text-slate-900">
                  지도에 이격거리
                </Link>
                <Link href={`/zone?chem=${chemical.id}`} className="flex min-h-12 items-center justify-center rounded-lg border-2 border-slate-900 text-base font-bold text-slate-900">
                  카메라로 구역 보기
                </Link>
              </div>
              <RadioCard chemical={chemical} position={position} weather={weather} onToast={showToast} />
            </>
          )}
          {activeRole === 'EMS' && (
            <>
              <ReviewPendingBanner />
              <EMSPanel protocol={chemical.ems_protocol} />
              <HospitalNotifyCard chemical={chemical} position={position} onToast={showToast} />
            </>
          )}
          {activeRole === 'MED' && (
            <>
              <ReviewPendingBanner />
              <MEDPanel chemical={chemical} />
            </>
          )}
          {activeRole === 'DM' && <DMPanel protocol={chemical.dm_protocol} />}
          {activeRole === 'CSA' && <CSAPanel protocol={chemical.csa_protocol} />}
        </div>

        {/* 현장 조건: GPS + 풍향 (무전 문안·통보에 쓰임) */}
        <SiteConditionsBar onChange={handleSiteChange} />

        {/* 물질 정보는 접어 둔다 — 첫 화면은 진입 판단 정보가 차지한다 */}
        <details className="rounded-xl border border-slate-300 bg-white">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 text-base font-bold text-slate-800">
            물질 정보 — CAS·외관·물성
          </summary>
          <div className="space-y-3 px-4 pb-4">
            <dl className="grid grid-cols-2 gap-2 text-base">
              <div>
                <dt className="text-sm text-slate-500">CAS</dt>
                <dd className="font-mono text-slate-800">{chemical.cas_number}</dd>
              </div>
              {chemical.un_number && (
                <div>
                  <dt className="text-sm text-slate-500">UN</dt>
                  <dd className="font-mono text-slate-800">{chemical.un_number}</dd>
                </div>
              )}
              {chemical.appearance && (
                <div className="col-span-2">
                  <dt className="text-sm text-slate-500">외관·냄새</dt>
                  <dd className="text-slate-800">
                    {chemical.appearance}
                    {chemical.odor ? ` / ${chemical.odor}` : ''}
                  </dd>
                </div>
              )}
              <div className="col-span-2">
                <dt className="text-sm text-slate-500">분류</dt>
                <dd className="text-slate-800">{chemical.hazard_class}</dd>
              </div>
            </dl>
            {chemical.physical_properties && <PhysicalPropertiesCard props={chemical.physical_properties} />}
          </div>
        </details>

        {/* 외부 MSDS 참조 */}
        <ExternalMSDSCard chemical={chemical} onCopy={copyCas} />
      </div>

      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      <footer className="max-w-3xl mx-auto px-4 py-4 border-t border-slate-200">
        <p className="text-center text-xs text-slate-400 tracking-wide">대한화학손상연구회</p>
        <p className="text-center text-xs text-slate-500">만든이 정회원 정기홍</p>
      </footer>
    </div>
  );
}
