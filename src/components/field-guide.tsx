'use client';

import { useState } from 'react';

// 일반 현장 대응 가이드(정적). 홈 첫 화면을 차지하지 않도록 /guide 로 옮겼다.

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
        {sub && <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function FieldResponseGuide() {
  return (
    <div className="space-y-2">
      <div className="px-1 pb-1">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">화학물질 사고 현장대응 가이드</p>
        <p className="text-xs text-slate-400 mt-0.5">물질명을 검색하거나, 아래 가이드를 참고하세요</p>
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
              <p className="text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-line">{ppe.desc}</p>
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

