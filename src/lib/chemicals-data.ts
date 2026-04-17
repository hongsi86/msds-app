import type { Chemical } from "@/lib/types";

export const CHEMICALS: Chemical[] = [
  // ────────────────────────────────────────────
  // 1. 황산 (Sulfuric Acid)
  // ────────────────────────────────────────────
  {
    id: "sulfuric-acid",
    cas_number: "7664-93-9",
    un_number: "UN1830",
    name_ko: "황산",
    name_en: "Sulfuric Acid",
    synonyms: ["황산", "진한 황산", "Oil of Vitriol", "Sulphuric Acid", "H2SO4"],
    formula: "H₂SO₄",
    hazard_class: "부식성 물질 (Class 8)",
    danger_level: 3,
    appearance: "무색 투명한 유성 액체",
    odor: "냄새 없음 (진한 황산), 약한 자극취 (묽은 황산)",
    ems_protocol: {
      ppe_level: "B",
      self_protection: [
        "레벨 B 화학 보호복 착용 (고농도 노출 시 레벨 A 고려)",
        "내화학성 장갑 (부틸 또는 네오프렌) 이중 착용",
        "안면 보호대 및 화학물질 방호 고글 착용",
        "공기 호흡기(SCBA) 착용 — 자급식 공기 공급 필수",
        "내산성 장화 착용",
        "현장 접근 전 풍향 확인, 바람을 등지고 접근",
      ],
      route_treatments: {
        inhalation:
          "즉시 신선한 공기로 이송. 자발 호흡 없으면 BVM으로 보조 환기. SpO₂ 모니터링, 필요 시 산소 투여(15L/min NRB). 기도 부종 징후 시 신속 이송 — 현장 처치 시간 최소화.",
        skin:
          "오염 의복 즉시 제거(2차 오염 주의). 흐르는 물로 최소 20분 이상 세척. 중화제(중조수 등) 사용 금지 — 발열 반응으로 2차 손상 유발. 세척 후 멸균 드레싱 적용.",
        eye:
          "즉시 생리식염수 또는 흐르는 물로 최소 20분간 세척 (눈꺼풀 젖혀 결막낭까지). 콘택트렌즈 착용 시 즉시 제거 후 세척 계속. 안과 전문 처치 필요 — 우선 이송.",
        ingestion:
          "구토 절대 유도 금지 (식도 재손상). 의식 있으면 물 또는 우유 소량(200mL) 투여. 구강 및 인후 화상 확인. 기도 확보 최우선 — 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min NRB마스크", note: "SpO₂ 94% 미만 시 투여" },
        {
          name: "생리식염수(0.9% NaCl)",
          dose: "세안용, 세척용",
          note: "눈 및 피부 세척에 사용",
        },
        {
          name: "모르핀 또는 펜타닐",
          dose: "의사 지시 하",
          note: "심한 통증 시 진통 — 의료지도 필요",
        },
      ],
      transport_criteria: [
        "흡입 노출 환자 전원 이송",
        "피부 또는 눈 화상 면적 1% 이상",
        "섭취 의심 환자 전원 이송",
        "활력 징후 불안정 (SpO₂ < 94%, HR < 50 또는 > 120, BP < 90)",
        "의식 저하 또는 기도 손상 징후",
      ],
      absolute_prohibitions: [
        "구토 유발 금지",
        "피부 화학화상에 중화제(베이킹소다) 직접 도포 금지",
        "오염 제거 전 환자 병원 이송 금지 (병원 내 오염 방지)",
        "산소 불꽃 근처 사용 금지 (가열 시 분해)",
        "밀폐 공간 진입 시 단독 진입 금지",
      ],
    },
    med_protocol: {
      clinical_symptoms: [
        "흡입: 코, 인후 작열감 / 기침 / 천명음 / 폐부종 (지연 발생 가능, 4~24시간)",
        "피부: 접촉 즉시 작열통 / 수포 / 깊은 화학 화상 (III도)",
        "눈: 극심한 통증 / 결막충혈 / 각막 혼탁 / 실명 위험",
        "섭취: 구강·식도·위 화상 / 혈변 / 천공 위험 / 저혈압",
        "전신: 대사산증 / 저칼슘혈증 / 용혈 (고농도 흡입 시)",
      ],
      lab_tests: [
        "동맥혈 가스 분석 (ABGA) — 산염기 상태 확인",
        "전해질 (Na, K, Ca, Mg, Phosphate)",
        "CBC, 혈액응고검사 (PT/aPTT)",
        "간기능 검사 (AST, ALT, T-bil)",
        "신기능 검사 (BUN, Creatinine)",
        "흉부 X-ray — 폐부종 여부",
        "내시경 — 섭취 환자 (응급 시행)",
      ],
      antidotes: [
        {
          name: "항산화 치료 (없음)",
          note: "황산 특이적 해독제 없음 — 대증 치료가 원칙",
        },
        {
          name: "탄산수소나트륨(NaHCO₃) IV",
          dose: "1~2 mEq/kg",
          note: "대사산증 교정 목적 (경구 투여 금지)",
        },
        {
          name: "칼슘글루코네이트 IV",
          dose: "10% 용액 10~20mL",
          note: "저칼슘혈증 교정",
        },
      ],
      admission_criteria: [
        "흡입 노출 후 증상 있는 환자 전원",
        "피부 화학 화상 (면적·깊이 무관)",
        "안구 화상 환자",
        "섭취 환자 전원",
        "SpO₂ < 95% 또는 이상 호흡음",
      ],
      icu_criteria: [
        "기관 삽관 또는 기계적 환기 필요",
        "폐부종 (ARDS 기준 충족)",
        "심한 대사산증 (pH < 7.2)",
        "순환 부전 (쇼크, 혈압 유지 불가)",
        "섭취 후 소화관 천공 의심",
      ],
      delayed_toxicity: [
        "폐부종: 흡입 후 4~24시간 내 발생 가능 — 초기 무증상 환자도 최소 24시간 관찰",
        "기도 협착: 흡입 화상 후 수일~수주 내 발생",
        "식도 협착: 섭취 후 수주~수개월 내 발생 (내시경 추적 필요)",
        "만성 폐질환: 반복 노출 시 만성 기관지염, 치아 부식",
      ],
      special_populations: [
        "소아: 체중 대비 노출량이 많아 성인보다 중증 경과 — 기준치 낮춰 입원 결정",
        "임산부: 태아 저산소증 위험 — 산소 투여 적극적으로",
        "고령: 폐부종 진행 빠름 — 조기 삽관 고려",
        "천식/COPD: 기관지 반응 과민 — 기관지확장제 조기 투여",
      ],
    },
    dm_protocol: {
      control_zone: [
        "Hot Zone (위험 구역): 누출 지점 반경 50m — 허가된 레벨 A/B 대원만 진입",
        "Warm Zone (오염 제거 구역): Hot Zone 외곽 25m — 오염 제거소 설치",
        "Cold Zone (안전 구역): Warm Zone 외곽 — 지휘소, 의료 대기소, 미디어 구역",
        "바람 방향 기준: 오염 구역을 풍상(Upwind) 방향으로 설정",
      ],
      evacuation_triggers: [
        "대기 중 황산 미스트 감지 (pH 테이프 또는 센서 반응)",
        "누출량 100L 초과 또는 지속 누출",
        "밀폐 공간 내 누출",
        "다수 사상자 발생 또는 호흡기 증상 환자 3명 이상",
        "하수구·수계 유입 위험",
      ],
      ics_checklist: [
        "사고 지휘관(IC) 지정 및 지휘소 설치 (풍상 방향)",
        "하자마트팀 출동 요청 및 도착 확인",
        "의료지원부(Medical Branch) 활성화",
        "오염 제거소 설치 (Decon Corridor 확보)",
        "대피 구역 설정 및 교통 통제 요청 (경찰)",
        "환경부 및 지방자치단체 통보",
        "현장 안전관리자 지정 및 대원 안전 모니터링",
        "소방용수 확보 (황산 누출 시 대량 살수 필요)",
      ],
      agencies: [
        "소방청 (초동 대응, 하자마트)",
        "경찰청 (교통 통제, 대피 지원)",
        "환경부/지방환경청 (환경 오염 대응)",
        "한국환경공단 (화학사고 대응팀, CAAT)",
        "국립환경과학원 (기술 자문)",
        "지역 보건소 / 응급의료센터",
        "화학물질안전원 (NICS) 상황실",
      ],
      public_communication: [
        "재난 문자: '황산 누출 사고 발생. [위치] 반경 [거리]m 주민은 즉시 대피 또는 실내 대기하십시오.'",
        "실내 대피 안내: 창문·문 닫기, 에어컨·환기 시스템 정지",
        "대피 방향: 바람을 횡단하거나 풍상(바람 방향의 반대) 방향으로",
        "정기 브리핑 간격: 30분마다 미디어 브리핑",
        "민원 핫라인 운영: 화학물질안전원 1899-9088",
      ],
      termination_criteria: [
        "누출 완전 차단 확인",
        "대기 중 황산 농도 TLV-C(0.2 ppm) 미만 — 3회 연속 측정",
        "모든 피해자 의료기관 이송 완료",
        "오염 토양·수계 초기 처리 완료 및 환경 당국 인계",
        "지휘관(IC) 최종 종료 선언",
      ],
    },
    csa_protocol: {
      legal_classification: [
        "화학물질관리법 제2조: 유해화학물질 (사고대비물질 제39호)",
        "산업안전보건법 시행규칙 별표 13: 관리대상 유해물질",
        "위험물안전관리법: 제6류 위험물 (산화성 액체)",
        "화학물질의 등록 및 평가 등에 관한 법률(화평법): 기존화학물질",
      ],
      report_deadline_hours: 1,
      environmental_checks: [
        "수계 오염: 누출 하천·지하수 pH 측정 (목표 pH 6.5~8.5)",
        "토양 오염: 누출 지점 토양 시료 채취 및 pH·중금속 분석",
        "대기 오염: 황산 미스트 농도 실시간 모니터링 (주변 500m)",
        "하수도 유입 차단: 차단막·흡착포 설치 여부 확인",
        "생태계 영향: 인근 수계 어류 폐사 등 생태 피해 모니터링",
      ],
      admin_actions: [
        "화학물질 사고 발생 즉시 화학물질안전원(NICS) 보고 (1시간 이내)",
        "사고 원인 조사 및 재발 방지 대책 수립 (30일 이내 제출)",
        "사고 관련 물질 보관 현황·취급 대장 보전 (증거 보전)",
        "사업장 내 황산 취급 시설 긴급 점검 실시",
        "피해 주민 손해배상 절차 안내 및 기록 유지",
        "사고 후 90일 이내 환경부에 결과 보고서 제출",
      ],
      dispersion_model: "ALOHA 또는 KORA 모델 사용 — 기상 조건(풍속, 온도, 안정도) 입력 필수",
    },
  },

  // ────────────────────────────────────────────
  // 2. 암모니아 (Ammonia)
  // ────────────────────────────────────────────
  {
    id: "ammonia",
    cas_number: "7664-41-7",
    un_number: "UN1005",
    name_ko: "암모니아",
    name_en: "Ammonia",
    synonyms: ["암모니아", "NH3", "무수암모니아", "Anhydrous Ammonia", "액화암모니아"],
    formula: "NH₃",
    hazard_class: "독성 가스 (Class 2.3) / 인화성 가스 (Class 2.1)",
    danger_level: 3,
    appearance: "무색 기체 (액화 시 무색 액체)",
    odor: "강렬하고 자극적인 특유의 암모니아 냄새",
    ems_protocol: {
      ppe_level: "B",
      self_protection: [
        "레벨 B 화학 보호복 착용 (누출 농도 불명 시 레벨 A)",
        "SCBA (자급식 공기 호흡기) 필수 — 암모니아는 활성탄 필터 불투과",
        "내화학성 장갑 (부틸 고무) 이중 착용",
        "전신 보호 위해 밀폐형 보호복 착용",
        "폭발 위험 고려: 폭발 한계 15~28% (LFL/UFL) — 점화원 제거 필수",
        "풍상 방향에서 접근, 저지대 접근 금지 (암모니아는 공기보다 가벼움)",
      ],
      route_treatments: {
        inhalation:
          "즉시 오염 구역 이탈, 신선한 공기 흡입. 기침·호흡 곤란 시 고유량 산소(15L/min). 천명음 시 기관지확장제 분무. 기도 부종 신속 평가 — 조기 삽관 고려. 폐부종 지연 발생(수 시간) 가능 — 증상 없어도 관찰.",
        skin:
          "오염 의복 즉시 제거. 흐르는 물로 15분 이상 세척. 액체 암모니아 노출 시 동상 가능 — 따뜻한 물로 서서히 해동. 멸균 드레싱 적용.",
        eye:
          "즉시 흐르는 물 또는 생리식염수로 15~20분간 세척. 강알칼리로 인한 각막 용해 위험 — 즉시 안과 의뢰. 콘택트렌즈 제거 후 세척.",
        ingestion:
          "구토 금지. 물 또는 우유 소량 투여. 소화관 화상·천공 위험 — 즉시 이송. (암모니아 가스는 일반적으로 섭취보다 흡입 경로가 주요)",
      },
      field_medications: [
        { name: "산소", dose: "15L/min NRB마스크", note: "모든 흡입 환자에게 투여" },
        {
          name: "살부타몰(Salbutamol) 네뷸라이저",
          dose: "2.5mg/3mL",
          note: "기관지 경련·천명음 시",
        },
        {
          name: "이프라트로피움(Ipratropium) 네뷸라이저",
          dose: "0.5mg",
          note: "살부타몰과 병용, 중증 기관지 경련 시",
        },
      ],
      transport_criteria: [
        "흡입 후 모든 증상 환자 이송",
        "고농도(300ppm 이상) 단시간 노출자 무증상도 이송",
        "피부·눈 화상 환자",
        "활력 징후 불안정",
        "의식 저하",
      ],
      absolute_prohibitions: [
        "점화원 근접 금지 (폭발 위험)",
        "저지대 구덩이·맨홀 진입 금지",
        "단독 구조 진입 금지",
        "구토 유도 금지",
        "활성탄 필터형 방독면으로 고농도 암모니아 구역 진입 금지",
      ],
    },
    med_protocol: {
      clinical_symptoms: [
        "상기도: 코, 인후 작열감 / 기침 / 후두 경련 / 쉰 목소리",
        "하기도: 기관지 경련 / 천명음 / 폐부종 (지연 발생)",
        "눈: 눈물·충혈 / 결막·각막 화상 / 실명 위험",
        "피부: 접촉성 화학 화상 / 동상(액화 암모니아)",
        "전신: 알칼리증 (고농도) / 의식 혼탁 / 경련 (극고농도)",
      ],
      lab_tests: [
        "ABGA (동맥혈 가스 분석) — 저산소증, 산염기 상태",
        "흉부 X-ray 및 CT — 폐부종 정도",
        "CBC, 전해질",
        "간·신기능 검사",
        "혈중 암모니아 농도 (간 기왕력 환자)",
        "안과 세극등 검사 (눈 노출 환자)",
      ],
      antidotes: [
        {
          name: "특이적 해독제 없음",
          note: "대증 치료 원칙",
        },
        {
          name: "기관지확장제 (살부타몰)",
          dose: "2.5mg 네뷸라이저, 필요 시 반복",
          note: "기관지 경련 치료",
        },
        {
          name: "덱사메타손(Dexamethasone) IV",
          dose: "8~10mg",
          note: "기도 부종 완화 — 조기 투여 고려",
        },
      ],
      admission_criteria: [
        "흡입 노출 후 증상 있는 모든 환자",
        "고농도 노출자 (무증상도 24시간 관찰 입원)",
        "눈·피부 화학 화상",
        "SpO₂ < 95%",
      ],
      icu_criteria: [
        "기계적 환기 필요",
        "ARDS 기준 충족",
        "심각한 저산소증 (PaO₂/FiO₂ < 200)",
        "기도 폐쇄 위험 (후두 부종)",
      ],
      delayed_toxicity: [
        "폐부종: 노출 후 최대 24~72시간까지 지연 발생",
        "폐쇄성 세기관지염: 수주~수개월 후 발생 가능",
        "반응성 기도 질환 증후군(RADS): 장기 폐 기능 저하",
        "각막 흉터 및 시력 저하: 안구 노출 후 장기 합병증",
      ],
      special_populations: [
        "소아: 기도가 좁아 후두 경련 위험 높음 — 조기 삽관 기준 낮춤",
        "임산부: 태아 저산소증 위험 — 산소 투여 적극적으로, 산부인과 협진",
        "심폐질환자: 폐부종 발생 시 급격히 악화 가능",
        "간질환자: 혈중 암모니아 상승 — 간성 뇌증 악화 위험",
      ],
    },
    dm_protocol: {
      control_zone: [
        "소규모 누출(< 50kg): Hot Zone 반경 100m",
        "대규모 누출(> 50kg): Hot Zone 반경 300m 이상 (ALOHA 모델 실측 우선)",
        "Warm Zone: Hot Zone 외곽 50m — 오염 제거 구역",
        "Cold Zone: 지휘소, 의료소, 언론 구역",
        "바람 방향 고려 — 암모니아는 공기보다 가벼워 고층부로 확산",
      ],
      evacuation_triggers: [
        "대기 중 암모니아 농도 25ppm(IDLH 대비 임계) 초과",
        "누출 제어 불가 상황",
        "폭발 위험(공기 중 15~28% 농도 도달 위험 판단 시)",
        "다수 부상자 발생",
        "인근 학교, 병원 등 취약 시설 인접 시",
      ],
      ics_checklist: [
        "IC 지정 및 지휘소 설치 (풍상·고지대)",
        "가스 탐지기 배치 (Hot/Warm Zone 경계)",
        "소방 물 분무 준비 (암모니아 수용성 — 물 분무로 확산 억제)",
        "하자마트팀 누출 차단 작업",
        "전기·가스 차단 (점화원 제거)",
        "대피 구역 및 교통 통제",
        "의료지원부 활성화 — 다수 환자 대비 분류소 설치",
        "환경부, 고압가스 안전원 통보",
      ],
      agencies: [
        "소방청 (하자마트, 초동 대응)",
        "경찰청 (대피 지원, 교통 통제)",
        "한국가스안전공사 (가스 시설 기술 지원)",
        "환경부 (환경 오염 대응)",
        "화학물질안전원 (NICS)",
        "지역 응급의료센터",
        "지자체 재난안전대책본부",
      ],
      public_communication: [
        "재난 문자: '암모니아 가스 누출. [위치] 주민은 즉시 실내 대피 또는 [방향]으로 대피하십시오.'",
        "실내 대피 안내: 창문·문 봉쇄, 환기 정지, 젖은 수건으로 틈새 막기",
        "대피 방향: 바람 방향의 직각(횡방향) 또는 풍상",
        "반려동물 실내 대피 안내",
        "피해 신고 핫라인 운영",
      ],
      termination_criteria: [
        "누출원 완전 차단 확인",
        "대기 중 암모니아 농도 TLV-TWA(25ppm) 미만 — 3회 연속 측정",
        "화재·폭발 위험 해소",
        "모든 피해자 이송 완료",
        "환경 당국 인계 완료",
      ],
    },
    csa_protocol: {
      legal_classification: [
        "화학물질관리법: 유해화학물질 (사고대비물질 제1호)",
        "고압가스 안전관리법: 독성 가스",
        "산업안전보건법: 특별관리물질, 노출 기준 25ppm(TWA) / 35ppm(STEL)",
        "위험물안전관리법: 해당 없음 (가스류)",
      ],
      report_deadline_hours: 1,
      environmental_checks: [
        "수계 오염: 하천 pH 및 암모니아성 질소(NH₃-N) 농도 측정",
        "토양 침투: 액화 암모니아 대량 누출 시 토양 오염 시료 채취",
        "대기 분산: 암모니아 센서로 반경 500m 실시간 모니터링",
        "식물·생태 피해: 인근 농경지, 수계 생태 영향 조사",
      ],
      admin_actions: [
        "NICS 1시간 이내 보고",
        "고압가스 시설 긴급 안전 점검",
        "사업장 암모니아 취급·저장 현황 제출",
        "재발 방지 대책 수립 및 30일 이내 보고",
        "주변 주민 건강 영향 조사 실시",
      ],
      dispersion_model: "ALOHA 또는 PHAST — 대기 안정도(Pasquill class), 풍속, 누출률 입력 필수",
    },
  },

  // ────────────────────────────────────────────
  // 3. 염소 (Chlorine)
  // ────────────────────────────────────────────
  {
    id: "chlorine",
    cas_number: "7782-50-5",
    un_number: "UN1017",
    name_ko: "염소",
    name_en: "Chlorine",
    synonyms: ["염소", "Cl2", "액화염소", "Chlorine Gas", "클로린"],
    formula: "Cl₂",
    hazard_class: "독성 가스 (Class 2.3) / 산화성 가스 (Class 2.2)",
    danger_level: 4,
    appearance: "황록색 기체 (액화 시 황록색 액체)",
    odor: "강한 자극취, 표백제 냄새 (매우 저농도에서도 감지 가능)",
    ems_protocol: {
      ppe_level: "A",
      self_protection: [
        "레벨 A 완전 밀폐형 화학 보호복 필수 (염소는 극독성)",
        "SCBA 착용 — IDLH 10ppm, 사망 농도 430ppm (30분)",
        "내화학성 장갑 (부틸 고무) 이중 착용",
        "염소는 공기보다 무거워(비중 2.5) 저지대·맨홀 축적 — 저지대 접근 금지",
        "풍상 방향에서만 접근",
        "대원 2인 1조 필수",
      ],
      route_treatments: {
        inhalation:
          "즉시 오염 구역 이탈. 신선한 공기 확보. 고유량 산소(15L/min NRB). 기침·천명음 시 기관지확장제. SpO₂ 지속 모니터링. 폐부종은 노출 후 2~24시간 지연 발생 — 무증상도 반드시 병원 이송 및 관찰.",
        skin:
          "오염 의복 제거. 흐르는 물로 15분 이상 세척. 염소 가스는 피부 화상보다 흡입 독성이 주요 — 피부 증상은 상대적으로 경미.",
        eye:
          "즉시 15~20분간 물 또는 생리식염수로 세척. 염소는 점막 자극 강함 — 결막·각막 화상 위험.",
        ingestion:
          "염소 가스 섭취 경로는 임상적으로 드물지만 구토 금지. 물 소량 투여. 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min NRB", note: "전 흡입 환자에게 즉시 투여" },
        {
          name: "살부타몰 네뷸라이저",
          dose: "2.5~5mg",
          note: "기관지 경련 시",
        },
        {
          name: "중탄산나트륨 흡입 (Sodium Bicarbonate nebulization)",
          dose: "3% NaHCO₃ 3mL 네뷸라이저",
          note: "염소 가스 중화 목적 — 일부 프로토콜 적용, 의료지도 확인",
        },
      ],
      transport_criteria: [
        "모든 흡입 노출 환자 — 무증상도 이송 (지연 폐부종)",
        "눈 또는 피부 화학 자극 환자",
        "SpO₂ < 95% 또는 기침·천명음",
        "노출 농도 불명 환자 전원 이송",
      ],
      absolute_prohibitions: [
        "레벨 B 이하 장비로 Hot Zone 진입 금지",
        "저지대·지하 공간 단독 진입 금지",
        "염소 가스 근처 점화원 금지 (산화 촉진)",
        "구토 유도 금지",
        "현장 처치 지연으로 이송 지연 금지",
      ],
    },
    med_protocol: {
      clinical_symptoms: [
        "저농도(1~3ppm): 눈·코·인후 자극, 기침",
        "중등도(3~25ppm): 호흡 곤란, 흉통, 천명음, 두통, 구역",
        "고농도(25~430ppm): 폐부종, 저산소증, 청색증, 의식 저하",
        "극고농도(>430ppm): 즉각 사망 가능 (성문 경련, 심폐 정지)",
        "지연 소견: 2~24시간 후 폐부종, ARDS",
      ],
      lab_tests: [
        "ABGA (동맥혈 가스 분석) — PaO₂, pH",
        "흉부 X-ray — 폐부종 확인 (초기 정상 가능)",
        "폐 HRCT — 중증 폐 손상 평가",
        "CBC, 전해질, 간·신기능",
        "메트헤모글로빈 수치",
      ],
      antidotes: [
        {
          name: "특이적 해독제 없음",
          note: "대증 치료 원칙",
        },
        {
          name: "중탄산나트륨 흡입",
          dose: "3% NaHCO₃ 3mL 네뷸라이저",
          note: "기도 내 염소 중화 — 증거 제한적이나 일부 사용",
        },
        {
          name: "스테로이드 (메틸프레드니솔론 IV)",
          dose: "1~2mg/kg",
          note: "폐 염증 억제 — 조기 투여 고려",
        },
      ],
      admission_criteria: [
        "모든 증상 환자 입원",
        "고농도 노출 무증상자도 24시간 관찰 입원",
        "SpO₂ < 95%",
        "흉부 X-ray 이상 소견",
      ],
      icu_criteria: [
        "ARDS (PaO₂/FiO₂ < 200)",
        "기계적 환기 필요",
        "순환 부전",
        "의식 변화",
      ],
      delayed_toxicity: [
        "폐부종: 노출 후 2~24시간 지연 발생 — 반드시 경과 관찰",
        "반응성 기도 질환 증후군(RADS): 수주~수개월 지속",
        "폐쇄성 세기관지염: 드물게 발생, 영구적 폐 기능 저하",
        "심리적 트라우마 (집단 노출 사고 후 PTSD)",
      ],
      special_populations: [
        "소아: 단위 체중당 폐포 면적 크고 호흡수 많아 성인보다 더 많은 가스 흡입",
        "임산부: 저산소증이 태아에 치명적 — 적극적 산소 투여 및 ICU 입원 기준 낮춤",
        "고령·심폐질환자: 폐부종 진행 빠름",
      ],
    },
    dm_protocol: {
      control_zone: [
        "소량 누출: Hot Zone 반경 200m",
        "대량 누출: Hot Zone 반경 500~1000m (ALOHA 실측 우선)",
        "염소는 저지대 축적 — 하천·골목·지하 주의",
        "Warm Zone: 50m 추가 완충, 오염 제거소 설치",
      ],
      evacuation_triggers: [
        "대기 중 염소 농도 1ppm 초과 (TLV-C 1ppm)",
        "누출 제어 불가",
        "다수 기침·호흡 곤란 환자 발생",
        "인근 학교·병원·대형 건물 인접",
        "야간 또는 기상 악화 (역전층 형성) 시",
      ],
      ics_checklist: [
        "IC 지정 — 풍상·고지대 지휘소",
        "레벨 A 하자마트팀 누출 차단",
        "가스 탐지기 경계 배치 (1ppm 경보 설정)",
        "대규모 물 분무 준비 (염소 수용성)",
        "의료소 설치 — 제염 후 이송",
        "교통 통제 및 주민 대피",
        "환경부, 지자체, NICS 동시 통보",
      ],
      agencies: [
        "소방청 하자마트",
        "경찰청",
        "환경부 / 화학물질안전원(NICS)",
        "한국환경공단 CAAT",
        "지역 응급의료센터 (다수 환자 대비)",
        "지자체 재난안전대책본부",
        "군부대 (대규모 사고 시 CBRN 지원 요청 가능)",
      ],
      public_communication: [
        "재난 문자: '염소 가스 누출 사고. 즉시 실내 대피 또는 [방향]으로 대피. 호흡 시 젖은 수건 사용.'",
        "저지대(지하 주차장, 반지하) 주민 즉시 고층 이동",
        "에어컨·환기 시스템 정지",
        "증상(기침·눈 자극) 발생 시 119 신고",
        "정기 브리핑: 30분 간격",
      ],
      termination_criteria: [
        "누출 완전 차단",
        "대기 중 염소 농도 TLV-TWA(1ppm) 미만 — 3회 연속",
        "모든 피해자 의료기관 이송",
        "저지대 잔존 가스 환기 완료",
        "환경 당국 인계",
      ],
    },
    csa_protocol: {
      legal_classification: [
        "화학물질관리법: 유해화학물질 (사고대비물질 제4호)",
        "고압가스 안전관리법: 독성 가스",
        "산업안전보건법: 특별관리물질, 노출 기준 1ppm(TLV-C)",
        "화학무기금지협약(CWC): 일정 조건 하 감시 대상",
      ],
      report_deadline_hours: 1,
      environmental_checks: [
        "수계 오염: 하천·해수의 잔류 염소(Cl₂) 및 pH 측정",
        "토양 산성화: 누출 지점 주변 토양 pH 측정",
        "대기 농도: 반경 1km 실시간 모니터링",
        "수도시설 영향 여부 확인 (정수장 인접 시)",
      ],
      admin_actions: [
        "NICS 즉시 보고 (1시간 이내)",
        "염소 저장·취급 시설 긴급 점검",
        "사고 원인 조사 및 개선 대책 제출 (30일)",
        "피해 주민 건강 모니터링 계획 수립",
        "관련 시설 업무 정지 명령 검토 (행정 조치)",
      ],
      dispersion_model: "ALOHA / PHAST / CAMEO — 대기 안정도, 온도, 풍속, 지형 입력",
    },
  },

  // ────────────────────────────────────────────
  // 4. 황화수소 (Hydrogen Sulfide)
  // ────────────────────────────────────────────
  {
    id: "hydrogen-sulfide",
    cas_number: "7783-06-4",
    un_number: "UN1053",
    name_ko: "황화수소",
    name_en: "Hydrogen Sulfide",
    synonyms: ["황화수소", "H2S", "Hydrogen Sulphide", "썩은 달걀 냄새 가스", "유화수소"],
    formula: "H₂S",
    hazard_class: "독성 가스 (Class 2.3) / 인화성 가스 (Class 2.1)",
    danger_level: 4,
    appearance: "무색 기체",
    odor: "저농도: 썩은 달걀 냄새 / 고농도(>150ppm): 후각 마비로 무취처럼 느껴짐",
    ems_protocol: {
      ppe_level: "A",
      self_protection: [
        "레벨 A 완전 밀폐형 보호복 필수 (IDLH 100ppm — 매우 낮음)",
        "SCBA 착용 필수 (필터형 방독면 절대 사용 금지)",
        "H₂S는 고농도에서 후각 마비 — 냄새 없다고 안전하지 않음",
        "H₂S는 공기보다 무거워(비중 1.19) 저지대·맨홀·지하 축적",
        "폭발 한계 4.3~46% — 점화원 제거",
        "대원 2인 1조, 안전선 확보",
      ],
      route_treatments: {
        inhalation:
          "즉시 오염 구역 이탈 (구조대원도 SCBA 착용 필수). 신선한 공기로 이송. 고유량 산소(15L/min NRB) — H₂S는 세포 산소화 차단 → 100% 산소 투여가 핵심. 심정지 시 CPR 즉시 시작. 아질산아밀/아질산나트륨 해독 고려 (의료지도 필요).",
        skin:
          "오염 의복 제거. 흐르는 물로 세척. H₂S는 주로 흡입 경로 — 피부 자극 경미.",
        eye:
          "흐르는 물로 15분 세척. 결막 자극 증상.",
        ingestion:
          "H₂S 가스 섭취는 임상적으로 드묾. 구토 금지.",
      },
      field_medications: [
        { name: "산소", dose: "100% (15L/min NRB 또는 BVM)", note: "H₂S 중독의 핵심 치료" },
        {
          name: "아질산아밀(Amyl Nitrite)",
          dose: "흡입용 앰플, 30초마다 흡입",
          note: "메트헤모글로빈 형성으로 H₂S 중화 — 의료지도 필요, 저혈압 주의",
        },
        {
          name: "하이드록소코발라민(Hydroxocobalamin)",
          dose: "5g IV (성인)",
          note: "시안화물 해독제로 H₂S에도 일부 효과 — 일부 프로토콜 적용",
        },
      ],
      transport_criteria: [
        "모든 흡입 노출 환자 — 심정지 후 회복 포함",
        "의식 저하 또는 경련 환자",
        "SpO₂ < 95%",
        "무증상도 고농도 노출 시 이송",
      ],
      absolute_prohibitions: [
        "SCBA 없이 환자 구조 시도 금지 (구조대원 2차 피해 위험)",
        "저지대·맨홀·하수구 단독 진입 금지",
        "냄새 없다고 안전 구역 판단 금지",
        "점화원 사용 금지",
        "아질산아밀 의료지도 없이 단독 투여 시 혈압 저하 위험 숙지",
      ],
    },
    med_protocol: {
      clinical_symptoms: [
        "저농도(10~50ppm): 눈·기도 자극, 두통, 어지러움",
        "중등도(50~100ppm): 심한 눈 자극(각막 부종), 기침, 구역, 혼란",
        "고농도(100~500ppm): 의식 소실, 폐부종, 경련",
        "극고농도(>500ppm): 즉각 의식 소실, 호흡 마비, 심정지 ('녹다운' 효과)",
        "후각 마비 (>150ppm): 환자가 가스를 인지 못함 — 더 위험",
      ],
      lab_tests: [
        "ABGA — 조직 저산소증, 대사산증",
        "유산(Lactate) — 세포 저산소증 지표",
        "메트헤모글로빈 수치 (해독제 투여 전·후)",
        "ECG — 심근 허혈, 부정맥",
        "혈중 H₂S (thiocyanate) — 급성기 의미 제한적",
        "흉부 X-ray — 폐부종",
        "뇌 MRI — 의식 소실 환자 (저산소성 뇌 손상 평가)",
      ],
      antidotes: [
        {
          name: "100% 산소",
          dose: "15L/min NRB 또는 기관 삽관 후 100% FiO₂",
          note: "H₂S 해독의 핵심 — 세포 내 cytochrome 결합 경쟁적 차단",
        },
        {
          name: "아질산나트륨(Sodium Nitrite) IV",
          dose: "10mL of 3% solution (300mg) 천천히 IV",
          note: "메트헤모글로빈 형성 → H₂S 격리. 저혈압 모니터링",
        },
        {
          name: "고압산소 치료(HBOT)",
          dose: "2~3 ATA, 60~90분",
          note: "중증 중독 시 가용 시설 이송 고려",
        },
      ],
      admission_criteria: [
        "의식 저하 또는 경련 환자 전원",
        "폐부종, SpO₂ < 95%",
        "심전도 이상",
        "해독제 투여 환자 전원",
        "고농도 노출 무증상자 24시간 관찰",
      ],
      icu_criteria: [
        "심정지 후 자발 순환 회복(ROSC) 환자",
        "기계적 환기 필요",
        "지속적 의식 장애",
        "ARDS",
        "심각한 대사산증",
      ],
      delayed_toxicity: [
        "저산소성 뇌 손상: 기억 장애, 인지 저하 (심정지 환자)",
        "폐쇄성 세기관지염",
        "말초 신경 병증",
        "각막 손상: 광각막염(photokeratitis)과 유사",
      ],
      special_populations: [
        "소아: 체중 대비 노출량 많음 — 기준 낮춰 즉시 이송",
        "임산부: 태반 통과 → 태아 저산소증",
        "심장질환자: H₂S로 인한 심근 허혈 위험",
      ],
    },
    dm_protocol: {
      control_zone: [
        "Hot Zone: 농도 측정 전 반경 300m (H₂S 위험성 높음)",
        "저지대·맨홀·하수구·정화조 주변 강화 경계",
        "Warm Zone: 오염 제거 구역",
        "Cold Zone: 지휘소 (풍상·고지대)",
      ],
      evacuation_triggers: [
        "H₂S 농도 50ppm 초과",
        "다수 의식 저하 또는 심정지 환자 발생",
        "누출원 불명확",
        "하수처리장, 석유화학 시설 인근",
        "폭발 위험 감지",
      ],
      ics_checklist: [
        "IC 지정 및 지휘소 설치",
        "H₂S 감지기 배치 — 저지대·밀폐 공간 집중",
        "하자마트팀 진입 및 누출 차단",
        "전기 차단 (폭발 방지)",
        "의료소 설치 — 심폐소생술 장비 준비",
        "NICS, 환경부, 경찰 동시 통보",
        "인근 하수처리장·정화조 가동 중단 협의",
      ],
      agencies: [
        "소방청 (하자마트, 구조)",
        "경찰청",
        "환경부 / 화학물질안전원",
        "지자체 수도·하수도 부서",
        "한국환경공단",
        "지역 응급의료센터",
      ],
      public_communication: [
        "재난 문자: '유독 가스(황화수소) 누출. [위치] 인근 즉시 대피. 저지대 지하 공간 절대 출입 금지.'",
        "하수도·맨홀 접근 절대 금지",
        "냄새 없어도 안전하지 않음 강조",
        "피해 신고: 119",
      ],
      termination_criteria: [
        "누출원 완전 차단",
        "H₂S 농도 TLV-TWA(1ppm) 미만 — 3회 연속 측정",
        "저지대 환기 완료 확인",
        "모든 피해자 이송 완료",
        "환경 당국 인계",
      ],
    },
    csa_protocol: {
      legal_classification: [
        "화학물질관리법: 유해화학물질 (사고대비물질 제16호)",
        "고압가스 안전관리법: 독성 가스",
        "산업안전보건법: 특별관리물질, 노출 기준 1ppm(TWA) / 5ppm(STEL)",
        "위험물안전관리법: 제4류 특수 인화물",
      ],
      report_deadline_hours: 1,
      environmental_checks: [
        "하천·수계: 황화물 이온(S²⁻) 농도 측정",
        "대기: H₂S 농도 실시간 모니터링 (반경 500m)",
        "하수도·정화조 내부 가스 농도 측정",
        "생태: 수계 용존산소(DO) 저하 모니터링",
      ],
      admin_actions: [
        "NICS 1시간 이내 보고",
        "사고 발생 시설 하수·정화조 시스템 긴급 점검",
        "재발 방지 대책 수립 (30일 이내)",
        "작업장 H₂S 노출 평가 및 환기 시설 개선",
        "주변 주민 건강 영향 조사",
      ],
      dispersion_model: "ALOHA — 저지대 확산 특성 반영 지형 모델 적용",
    },
  },

  // ────────────────────────────────────────────
  // 5. 톨루엔 (Toluene)
  // ────────────────────────────────────────────
  {
    id: "toluene",
    cas_number: "108-88-3",
    un_number: "UN1294",
    name_ko: "톨루엔",
    name_en: "Toluene",
    synonyms: [
      "톨루엔",
      "톨루올",
      "메틸벤젠",
      "Toluol",
      "Methylbenzene",
      "Phenylmethane",
    ],
    formula: "C₇H₈",
    hazard_class: "인화성 액체 (Class 3)",
    danger_level: 2,
    appearance: "무색 투명한 액체",
    odor: "특유의 방향족 달콤한 냄새",
    ems_protocol: {
      ppe_level: "B",
      self_protection: [
        "레벨 B 화학 보호복 착용 (인화성·증기 흡입 방지)",
        "SCBA 착용 — 유기 증기 농도 불명 시",
        "내화학성 장갑 (부틸 고무 또는 라텍스) 착용",
        "정전기 방지 복장 — 인화점 4.4°C, 폭발 위험",
        "점화원(스파크, 흡연) 완전 제거",
        "풍상 방향 접근",
      ],
      route_treatments: {
        inhalation:
          "오염 구역 이탈, 신선한 공기 확보. 증상(두통, 어지러움, 구역) 평가. SpO₂ 모니터링. 산소 투여(증상 있는 경우). 무의식 환자는 기도 확보 및 회복 체위.",
        skin:
          "오염 의복 제거. 비누와 흐르는 물로 세척 (최소 15분). 피부 지질 용해 — 장기간 노출 시 피부염 유발. 자극 증상 시 이송.",
        eye:
          "흐르는 물 또는 생리식염수로 15분 세척. 지속 자극 시 안과 의뢰.",
        ingestion:
          "구토 유도 금지 (흡인 시 폐 손상). 물 소량 투여. 즉시 이송 — 흡인성 폐렴 위험.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min NRB", note: "증상 있는 흡입 노출 환자" },
        {
          name: "생리식염수(0.9%)",
          dose: "세안·세척용",
          note: "눈·피부 세척",
        },
        {
          name: "활성탄(Activated Charcoal)",
          dose: "1g/kg PO (최대 50g)",
          note: "섭취 환자 — 의식 있고 기도 보호 가능 시, 의료지도 필요",
        },
      ],
      transport_criteria: [
        "의식 저하, 경련",
        "지속되는 두통·구역·호흡 곤란",
        "섭취 환자 전원",
        "SpO₂ < 95%",
        "심장 부정맥 (톨루엔은 심근 감작 효과)",
      ],
      absolute_prohibitions: [
        "점화원 사용 금지 (인화성 액체, 인화점 4.4°C)",
        "구토 유도 금지 (흡인성 폐렴 위험)",
        "밀폐 공간 환기 없이 진입 금지",
        "에피네프린 투여 금지 (심근 감작 상태에서 심실세동 유발 위험)",
      ],
    },
    med_protocol: {
      clinical_symptoms: [
        "흡입: 두통·어지러움·도취감 / 구역·구토 / 고농도 시 의식 소실",
        "급성 중독: 운동 실조, 경련, 심근 부정맥",
        "피부: 장기 노출 시 탈지·건조·피부염",
        "섭취: 구역·구토, 흡인성 폐렴 위험",
        "만성 노출: 인지 기능 저하, 소뇌 기능 장애, 청력 손실",
      ],
      lab_tests: [
        "혈중 톨루엔 농도 (급성기)",
        "소변 마뇨산(Hippuric acid) — 노출 지표 (단, 식이에 의해서도 상승)",
        "ECG — 심장 부정맥 (QT 연장 등)",
        "ABGA",
        "CBC, 간·신기능, 전해질",
        "흉부 X-ray — 흡인성 폐렴",
      ],
      antidotes: [
        {
          name: "특이적 해독제 없음",
          note: "대증 치료 원칙",
        },
        {
          name: "산소",
          dose: "고유량 산소",
          note: "흡입 노출 시 기본 치료",
        },
        {
          name: "벤조디아제핀",
          dose: "디아제팜 5~10mg IV",
          note: "경련 조절",
        },
      ],
      admission_criteria: [
        "의식 저하 또는 경련",
        "심전도 이상 (부정맥)",
        "흡인성 폐렴 의심",
        "섭취 환자 (증상 있는 경우)",
        "활력 징후 불안정",
      ],
      icu_criteria: [
        "심실 부정맥 (심실빈맥, 심실세동)",
        "기계적 환기 필요",
        "지속 의식 장애",
        "다장기 부전",
      ],
      delayed_toxicity: [
        "흡인성 폐렴: 섭취 후 24~48시간 내 발생",
        "간독성: 고농도 만성 노출 시 (ALT/AST 상승)",
        "신독성: 드물게 — 만성 흡입 남용자에서 저칼륨혈증, 신세관 산증",
        "중추 신경계 손상: 만성 노출 시 인지 저하, 백질 변성",
      ],
      special_populations: [
        "임산부: 태반 통과 — 태아 독성, 자연 유산 위험 (만성 노출)",
        "소아: 신경 발달 영향 주의",
        "알코올 의존자: 대사 경로 경쟁 — 독성 증가",
        "심질환자: 심근 감작 효과로 부정맥 위험 증가",
      ],
    },
    dm_protocol: {
      control_zone: [
        "대규모 누출: Hot Zone 반경 50~100m",
        "증기 확산 고려 (인화점 낮음 — 저온에서도 인화성 증기 발생)",
        "Warm Zone: 오염 제거 구역 (제염 후 이송)",
        "Cold Zone: 지휘소 (풍상, 점화원 없는 곳)",
      ],
      evacuation_triggers: [
        "대기 중 톨루엔 농도 100ppm 초과 (TLV-TWA 50ppm)",
        "화재 또는 폭발 위험",
        "다수 두통·구역 환자 발생",
        "밀폐 공간 내 대량 누출",
      ],
      ics_checklist: [
        "IC 지정 및 지휘소 설치 (풍상)",
        "점화원 제거 — 전기 차단, 흡연 금지",
        "가연성 가스 감지기 배치 (LFL 1.1% 경보)",
        "하자마트팀 흡수제(모래, 흙)로 누출 제어",
        "오염 액체 수계 유입 방지 (토류막 설치)",
        "환경부, NICS, 경찰 통보",
      ],
      agencies: [
        "소방청 (화재·누출 대응)",
        "경찰청",
        "환경부 / 화학물질안전원",
        "한국환경공단",
        "지자체 환경과",
        "지역 응급의료센터",
      ],
      public_communication: [
        "재난 문자: '인화성 화학물질 누출. [위치] 인근 점화원(담뱃불 등) 절대 사용 금지. 실내 대피.'",
        "창문·문 닫기, 환기 정지",
        "차량 엔진 정지",
        "증상(두통·어지러움) 시 119 신고",
      ],
      termination_criteria: [
        "누출 차단 완료",
        "가연성 가스 농도 LFL 10% 미만 — 3회 측정",
        "대기 중 톨루엔 농도 TLV-TWA(50ppm) 미만",
        "피해자 전원 이송 완료",
        "오염 토양·수계 처리 및 환경 당국 인계",
      ],
    },
    csa_protocol: {
      legal_classification: [
        "화학물질관리법: 유해화학물질 (유독물질)",
        "산업안전보건법: 관리대상 유해물질, 노출 기준 50ppm(TWA) / 150ppm(STEL)",
        "위험물안전관리법: 제4류 제1석유류 (인화점 4.4°C)",
        "화평법: 기존화학물질 (고위험성 물질 해당 여부 평가 대상)",
      ],
      report_deadline_hours: 4,
      environmental_checks: [
        "수계 오염: VOC 농도 측정 (하천·지하수)",
        "토양 오염: TPH(석유계 총탄화수소) 분석",
        "대기: 톨루엔 VOC 농도 모니터링",
        "화재 위험: LFL 농도 경계 모니터링",
      ],
      admin_actions: [
        "NICS 4시간 이내 보고",
        "누출 시설 긴급 점검 및 재고 확인",
        "오염 토양·수계 정화 계획 수립",
        "사고 원인 조사 및 30일 이내 결과 보고",
        "사업장 환기·저장 시설 개선 지시",
      ],
      dispersion_model: "ALOHA — 인화성 증기 확산, 화재·폭발 범위 예측",
    },
  },

  // ────────────────────────────────────────────
  // 6. 염산 (Hydrochloric Acid)
  // ────────────────────────────────────────────
  {
    id: "hydrochloric-acid",
    cas_number: "7647-01-0",
    un_number: "UN1789",
    name_ko: "염산",
    name_en: "Hydrochloric Acid",
    synonyms: ["염산", "염화수소", "소금산", "HCl", "Muriatic Acid"],
    formula: "HCl",
    hazard_class: "부식성 물질 (Class 8)",
    danger_level: 3,
    appearance: "무색~연한 황색 액체 (발연성)",
    odor: "강한 자극취",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B 화학 보호복 + SCBA", "내산성 장갑 이중 착용", "고농도 증기 시 레벨 A 고려", "풍상 접근"],
      route_treatments: {
        inhalation: "즉시 신선한 공기로 이송. 산소 15L/min NRB. 기관지확장제 필요 시 투여. 폐부종 지연 발생 가능.",
        skin: "오염 의복 제거. 흐르는 물 20분 세척. 중화제 사용 금지.",
        eye: "생리식염수 또는 물로 20분간 세척. 안과 즉시 의뢰.",
        ingestion: "구토 금지. 물 200mL 소량 투여. 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min NRB", note: "흡입 환자 전원" },
        { name: "살부타몰 네뷸라이저", dose: "2.5mg", note: "기관지 경련 시" },
      ],
      transport_criteria: ["흡입 노출 전원", "피부·눈 화상", "섭취 의심"],
      absolute_prohibitions: ["구토 유도 금지", "중화제 도포 금지", "PPE 미착용 진입 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["상기도 자극, 기침, 천명음", "피부 화학화상", "눈 각막 손상", "섭취 시 식도·위 화상", "폐부종 (지연 발생)"],
      lab_tests: ["ABGA", "흉부 X-ray", "CBC, 전해질", "내시경 (섭취 시)"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료" }, { name: "NaHCO₃ IV", dose: "1-2mEq/kg", note: "대사산증 교정" }],
      admission_criteria: ["흡입 증상 환자", "피부·안구 화상", "섭취 환자"],
      icu_criteria: ["폐부종/ARDS", "기관 삽관 필요", "소화관 천공"],
      delayed_toxicity: ["폐부종 4-24시간 지연", "식도 협착 수주-수개월"],
      special_populations: ["소아: 기도 좁아 후두경련 위험", "천식/COPD: 기관지 반응 과민"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 반경 50m", "Warm Zone 25m 추가", "풍하방향 확대"],
      evacuation_triggers: ["대기 중 HCl 5ppm(TLV-C) 초과", "다수 호흡기 증상 환자"],
      ics_checklist: ["IC 지정", "하자마트팀 출동", "물 분무 준비 (수용성)", "의료소 설치"],
      agencies: ["소방청", "환경부", "NICS", "지역 응급의료센터"],
      public_communication: ["재난 문자 발송", "실내 대피 안내", "창문 닫기, 환기 정지"],
      termination_criteria: ["누출 차단", "HCl 농도 TLV 미만 3회 측정", "피해자 이송 완료"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: 관리대상 유해물질 TWA 5ppm", "위험물안전관리법: 해당 없음"],
      report_deadline_hours: 1,
      environmental_checks: ["수계 pH 측정", "대기 HCl 모니터링"],
      admin_actions: ["NICS 1시간 내 보고", "사고 원인 조사", "재발방지대책 수립"],
      dispersion_model: "ALOHA",
    },
  },

  // ────────────────────────────────────────────
  // 7. 불화수소 (Hydrogen Fluoride)
  // ────────────────────────────────────────────
  {
    id: "hydrogen-fluoride",
    cas_number: "7664-39-3",
    un_number: "UN1052",
    name_ko: "불화수소",
    name_en: "Hydrogen Fluoride",
    synonyms: ["불화수소", "불산", "HF", "Hydrofluoric Acid", "불화수소산"],
    formula: "HF",
    hazard_class: "독성 + 부식성 (Class 8 / Class 6.1)",
    danger_level: 4,
    appearance: "무색 액체 또는 기체",
    odor: "강한 자극취",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A 완전 밀폐형 필수", "SCBA 착용", "네오프렌 장갑 이중 (HF는 라텍스 투과)", "극소량도 치명적 — 최대 경계"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 100% 산소 투여. 네뷸라이저로 2.5% 글루콘산칼슘 용액 흡입 고려.",
        skin: "즉시 흐르는 물 세척. 글루콘산칼슘(calcium gluconate) 2.5% 겔 도포 — 일반 세척만으로 불충분! 통증 부위 집중 도포.",
        eye: "생리식염수로 최소 20분 세척. 1% 글루콘산칼슘 점안 고려. 즉시 안과 의뢰.",
        ingestion: "구토 금지. 우유·제산제 소량 투여. 즉시 이송.",
      },
      field_medications: [
        { name: "글루콘산칼슘 겔 2.5%", dose: "노출 부위 도포", note: "HF 해독 핵심 — 반드시 비치" },
        { name: "산소", dose: "15L/min", note: "흡입 환자" },
        { name: "글루콘산칼슘 IV", dose: "10% 10mL 천천히", note: "전신 독성·심부전 시 의료지도 하 투여" },
      ],
      transport_criteria: ["모든 HF 노출 환자 — 무증상도 이송", "지연성 통증 발생 가능"],
      absolute_prohibitions: ["글루콘산칼슘 없이 현장 처치 종료 금지", "라텍스 장갑 단독 사용 금지", "노출 면적 경시 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["피부: 즉시~수시간 후 심부 작열통, 조직 괴사", "저칼슘혈증 → 심부정맥 → 심정지", "폐부종 (흡입)", "신부전"],
      lab_tests: ["혈중 칼슘 (반복 측정)", "마그네슘", "칼륨", "ECG 연속 모니터링 (QT 연장)", "ABGA", "신기능"],
      antidotes: [
        { name: "글루콘산칼슘 IV", dose: "10% 20-30mL 천천히", note: "저칼슘혈증 교정 — 핵심 해독" },
        { name: "글루콘산칼슘 동맥내 주입", dose: "10mL of 10%", note: "사지 노출 시 — 전문의 시행" },
        { name: "칼슘글루코네이트 겔 국소", dose: "지속 도포", note: "통증 소실까지" },
      ],
      admission_criteria: ["모든 HF 노출 환자", "면적 무관 입원"],
      icu_criteria: ["저칼슘혈증", "심부정맥", "5% 이상 체표면적 노출"],
      delayed_toxicity: ["수시간 후 심부 통증 발현", "전신 불소 독성 (저칼슘, 고칼륨)", "신부전"],
      special_populations: ["소아: 체중 대비 칼슘 소모 빠름", "심장질환자: 부정맥 고위험"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 반경 100m (가스 누출 시)", "HF는 극소량도 치명 — 보수적 설정"],
      evacuation_triggers: ["어떠한 양의 HF 누출이라도 대피 고려", "농도 측정 불가 시 최대 격리"],
      ics_checklist: ["IC 지정", "레벨 A 하자마트팀 진입", "글루콘산칼슘 겔 대량 확보", "의료소 설치"],
      agencies: ["소방청", "환경부", "NICS", "반도체/화학공장 자체 방재팀"],
      public_communication: ["HF 극독성 안내", "실내 대피", "피부 접촉 시 즉시 세척 안내"],
      termination_criteria: ["누출 완전 차단", "잔류 HF 불검출", "모든 피해자 이송"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 사고대비물질", "산업안전보건법: 특별관리물질 TWA 3ppm", "화학무기금지협약 감시대상"],
      report_deadline_hours: 1,
      environmental_checks: ["수계 불소이온 농도", "토양 오염", "대기 HF 모니터링"],
      admin_actions: ["NICS 즉시 보고", "반도체·화학공장 안전점검", "재발방지대책"],
      dispersion_model: "ALOHA / PHAST",
    },
  },

  // ────────────────────────────────────────────
  // 8. 시안화수소 (Hydrogen Cyanide)
  // ────────────────────────────────────────────
  {
    id: "hydrogen-cyanide",
    cas_number: "74-90-8",
    un_number: "UN1051",
    name_ko: "시안화수소",
    name_en: "Hydrogen Cyanide",
    synonyms: ["시안화수소", "청산", "HCN", "청화수소", "Prussic Acid"],
    formula: "HCN",
    hazard_class: "독성 + 인화성 (Class 6.1 / Class 3)",
    danger_level: 4,
    appearance: "무색 액체/기체",
    odor: "쓴 아몬드 냄새 (유전적으로 감지 불가한 사람 40%)",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A 완전 밀폐형", "SCBA 필수", "즉시 치명적 — IDLH 50ppm", "인화성 — 점화원 제거"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 100% 산소. 의식 소실/경련 시 히드록소코발라민(Cyanokit) 5g IV 즉시 투여. 심정지 시 CPR.",
        skin: "오염 의복 제거. 물 세척. 피부 흡수 가능 — 전신 독성 모니터링.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지. 활성탄 1g/kg (의식 있고 기도 보호 시). 즉시 이송.",
      },
      field_medications: [
        { name: "히드록소코발라민(Cyanokit)", dose: "5g IV (성인)", note: "시안화물 해독 1차 선택" },
        { name: "산소", dose: "100% (15L/min)", note: "필수 병용" },
        { name: "아질산아밀 흡입", dose: "30초간 흡입, 30초 휴식 반복", note: "Cyanokit 없을 때 임시 조치" },
      ],
      transport_criteria: ["모든 노출 환자 즉시 이송", "심정지 회복 환자도 이송"],
      absolute_prohibitions: ["SCBA 없이 구조 금지", "입대입 인공호흡 금지 (2차 오염)", "해독제 없이 현장 지체 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["두통, 어지러움, 혼란 → 경련 → 의식소실 → 심정지 (수분 내)", "Cherry-red 피부색 (실제로는 드묾)", "대사산증 (고 lactate)"],
      lab_tests: ["혈중 시안화물 농도", "Lactate (>8mmol/L 시안화물 중독 시사)", "ABGA", "메트헤모글로빈", "ECG"],
      antidotes: [
        { name: "히드록소코발라민(Hydroxocobalamin)", dose: "5g IV over 15분", note: "1차 해독제 — 가장 안전" },
        { name: "시안화물 해독 키트 (아질산나트륨 + 티오황산나트륨)", dose: "NaNO₂ 300mg IV + Na₂S₂O₃ 12.5g IV", note: "Cyanokit 없을 때 대안" },
      ],
      admission_criteria: ["모든 노출 환자"],
      icu_criteria: ["의식소실 경력", "심정지 후 ROSC", "해독제 투여 환자"],
      delayed_toxicity: ["저산소성 뇌손상", "파킨슨 유사 증후군 (지연성)"],
      special_populations: ["소아: 체중당 용량 조절", "임산부: 태아 시안화물 독성"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 반경 300m 이상", "즉시 치명적 — 최대 격리"],
      evacuation_triggers: ["어떤 양이든 즉시 대피", "화재 시 시안화물 발생 가능 (플라스틱 연소)"],
      ics_checklist: ["IC 지정", "레벨 A 팀만 진입", "Cyanokit 대량 확보", "점화원 제거", "의료소 해독제 비치"],
      agencies: ["소방청", "NICS", "경찰청", "군부대 CBRN (대규모 시)"],
      public_communication: ["즉시 대피", "창문 밀폐", "화재 연기 흡입 주의"],
      termination_criteria: ["누출 완전 차단", "HCN 불검출 3회", "전원 이송"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 사고대비물질", "화학무기금지협약 Schedule 3", "산업안전보건법: 특별관리물질 TWA 10ppm(C)"],
      report_deadline_hours: 1,
      environmental_checks: ["수계 시안화물 이온", "대기 HCN", "토양 오염"],
      admin_actions: ["NICS 즉시 보고", "도금/제련 공장 긴급점검"],
      dispersion_model: "ALOHA — 즉시 치명 범위 예측",
    },
  },

  // ────────────────────────────────────────────
  // 9. 일산화탄소 (Carbon Monoxide)
  // ────────────────────────────────────────────
  {
    id: "carbon-monoxide",
    cas_number: "630-08-0",
    un_number: "UN1016",
    name_ko: "일산화탄소",
    name_en: "Carbon Monoxide",
    synonyms: ["일산화탄소", "CO", "연탄가스", "Carbon Monoxide"],
    formula: "CO",
    hazard_class: "독성 가스 + 인화성 (Class 2.3 / Class 2.1)",
    danger_level: 3,
    appearance: "무색 기체",
    odor: "무취 무미 — 감지 불가",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["SCBA 착용 필수", "CO 감지기 휴대", "인화성 — 폭발 한계 12.5-74%", "밀폐 공간 2인 1조"],
      route_treatments: {
        inhalation: "즉시 신선한 공기로 이송. 100% 산소(NRB 15L/min) — CO 반감기 단축 핵심. 의식저하 시 기도확보. 심정지 시 CPR.",
        skin: "CO는 흡입 경로만 — 피부 처치 불필요.",
        eye: "해당 없음.",
        ingestion: "해당 없음.",
      },
      field_medications: [
        { name: "산소", dose: "100% NRB 15L/min", note: "CO 중독 핵심 치료 — COHb 반감기 320분→80분" },
      ],
      transport_criteria: ["COHb > 10% 또는 증상 있는 환자", "의식저하·경련", "임산부 CO 노출", "심근 허혈 증상"],
      absolute_prohibitions: ["SCBA 없이 밀폐 공간 진입 금지", "점화원 사용 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["두통, 어지러움, 구역 (COHb 10-30%)", "혼란, 시력장애 (30-50%)", "의식소실, 경련, 심정지 (>50%)", "Cherry-red 피부 (드묾, 사후에 주로)"],
      lab_tests: ["혈중 카복시헤모글로빈(COHb)", "ABGA", "Lactate", "Troponin (심근 손상)", "ECG", "두부 CT/MRI (의식장애 시)"],
      antidotes: [
        { name: "100% 산소", dose: "NRB 또는 기관삽관", note: "COHb 반감기 단축" },
        { name: "고압산소치료(HBOT)", dose: "2.5-3 ATA, 90분", note: "의식소실, 임산부, COHb>25%, 심근허혈 시" },
      ],
      admission_criteria: ["COHb > 15%", "의식장애", "심전도 이상", "임산부"],
      icu_criteria: ["의식소실 경력", "심근 허혈", "HBOT 필요"],
      delayed_toxicity: ["지연성 신경정신 증후군 (DNS): 2-40일 후 인지장애, 보행장애, 인격변화", "발생률 15-40%"],
      special_populations: ["임산부: 태아 COHb가 모체보다 높음 — HBOT 적극 고려", "심질환자: 저농도에서도 심근 허혈", "소아/고령: 증상 비전형적"],
    },
    dm_protocol: {
      control_zone: ["밀폐 공간: 환기 완료까지 진입 통제", "개방 공간: Hot Zone 50m"],
      evacuation_triggers: ["CO 35ppm(NIOSH Ceiling) 초과", "다수 두통·구역 환자"],
      ics_checklist: ["IC 지정", "환기 장비 투입", "CO 감지기 배치", "의료소 산소 대량 확보"],
      agencies: ["소방청", "가스안전공사", "경찰청"],
      public_communication: ["창문 개방 환기", "연탄/가스보일러 점검 안내"],
      termination_criteria: ["CO 35ppm 미만 3회 측정", "환기 완료", "피해자 이송"],
    },
    csa_protocol: {
      legal_classification: ["산업안전보건법: 관리대상 유해물질 TWA 30ppm", "고압가스 안전관리법: 독성 가스"],
      report_deadline_hours: 4,
      environmental_checks: ["실내 CO 농도", "연소 설비 점검"],
      admin_actions: ["원인 시설 점검", "보일러/난방기구 안전 조치"],
      dispersion_model: "실내 환기 모델 적용",
    },
  },

  // ────────────────────────────────────────────
  // 10. 메탄올 (Methanol)
  // ────────────────────────────────────────────
  {
    id: "methanol",
    cas_number: "67-56-1",
    un_number: "UN1230",
    name_ko: "메탄올",
    name_en: "Methanol",
    synonyms: ["메탄올", "메틸알코올", "목정", "Wood Alcohol", "CH3OH"],
    formula: "CH₃OH",
    hazard_class: "인화성 액체 + 독성 (Class 3 / Class 6.1)",
    danger_level: 3,
    appearance: "무색 투명 액체",
    odor: "에탄올과 유사한 알코올 냄새",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "내화학성 장갑", "인화점 11°C — 점화원 제거", "피부 흡수 가능 — 피부 보호"],
      route_treatments: {
        inhalation: "신선한 공기로 이송. 산소 투여. 증상 관찰.",
        skin: "오염 의복 제거. 비누와 물 15분 세척. 피부 흡수 독성 주의.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지. 에탄올이 해독제 역할 — 40% 에탄올(소주) 투여 고려 (의료지도). 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min", note: "흡입 시" },
        { name: "에탄올 (응급)", dose: "40% 에탄올 1-2mL/kg PO", note: "섭취 시 의료지도 하 — 대사 경쟁 억제" },
      ],
      transport_criteria: ["섭취 의심 전원", "시력 이상 호소", "의식 변화"],
      absolute_prohibitions: ["구토 유도 금지", "점화원 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["초기 (0-12h): 두통, 구역, 도취감 (에탄올 유사)", "중기 (12-24h): 대사산증, 시력 저하/실명", "말기: 경련, 혼수, 다장기 부전"],
      lab_tests: ["혈중 메탄올 농도", "삼투압 갭 (osmolar gap)", "음이온 갭 (anion gap)", "ABGA — 대사산증", "안저 검사"],
      antidotes: [
        { name: "포메피졸(Fomepizole)", dose: "15mg/kg loading → 10mg/kg q12h IV", note: "1차 해독제 — 알코올탈수소효소 억제" },
        { name: "에탄올 IV", dose: "10% 에탄올 IV, 혈중 에탄올 100-150mg/dL 유지", note: "포메피졸 없을 때 대안" },
        { name: "NaHCO₃", dose: "산증 교정", note: "pH < 7.3 시" },
        { name: "혈액투석", dose: "4-8시간", note: "메탄올 > 50mg/dL, 시력이상, 심한 산증" },
      ],
      admission_criteria: ["모든 섭취 환자", "시력 이상", "대사산증"],
      icu_criteria: ["심한 산증", "시력 소실", "혈액투석 필요"],
      delayed_toxicity: ["영구 시력 소실 (시신경 손상)", "기저핵 괴사"],
      special_populations: ["알코올 중독자: 에탄올 고갈 시 메탄올 대사 가속", "소아: 소량도 치명적"],
    },
    dm_protocol: {
      control_zone: ["대량 누출: Hot Zone 50m", "화재·폭발 위험 고려"],
      evacuation_triggers: ["인화성 증기 축적", "다수 음독 환자"],
      ics_checklist: ["IC 지정", "점화원 제거", "유출 차단", "의료소 해독제 확보"],
      agencies: ["소방청", "경찰청 (음독 사건 시)", "환경부"],
      public_communication: ["메탄올 음용 위험 경고", "에탄올과 혼동 주의"],
      termination_criteria: ["누출 차단", "인화성 증기 불검출", "피해자 이송"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: TWA 200ppm", "위험물안전관리법: 제4류 알코올류"],
      report_deadline_hours: 4,
      environmental_checks: ["수계 메탄올 농도", "VOC 대기 모니터링"],
      admin_actions: ["불법 유통 조사 (음독 사건)", "저장시설 점검"],
      dispersion_model: "ALOHA — 인화성 증기 확산",
    },
  },

  // ────────────────────────────────────────────
  // 11. 벤젠 (Benzene)
  // ────────────────────────────────────────────
  {
    id: "benzene",
    cas_number: "71-43-2",
    un_number: "UN1114",
    name_ko: "벤젠",
    name_en: "Benzene",
    synonyms: ["벤젠", "벤졸", "Benzol", "C6H6"],
    formula: "C₆H₆",
    hazard_class: "인화성 액체 + 발암물질 (Class 3)",
    danger_level: 3,
    appearance: "무색 투명 액체",
    odor: "달콤한 방향족 냄새",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "발암물질 — 노출 최소화", "인화점 -11°C — 극인화성", "정전기 방지"],
      route_treatments: {
        inhalation: "즉시 신선한 공기. 산소 투여. 심장 모니터링 (심근 감작).",
        skin: "오염 의복 제거. 비누와 물 세척.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지 (흡인 위험). 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min", note: "흡입 환자" },
      ],
      transport_criteria: ["흡입 증상 환자", "섭취 환자", "의식 변화", "부정맥"],
      absolute_prohibitions: ["점화원 금지", "구토 유도 금지", "에피네프린 금지 (심근 감작)"],
    },
    med_protocol: {
      clinical_symptoms: ["급성: 두통, 어지러움, 도취감, 경련", "심근 감작 → 심실부정맥", "만성: 골수억제, 재생불량성 빈혈, 백혈병(AML)"],
      lab_tests: ["CBC (혈액학적 이상)", "소변 페놀", "ECG", "ABGA", "간·신기능"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료" }],
      admission_criteria: ["의식 변화", "심전도 이상", "섭취 환자"],
      icu_criteria: ["심실 부정맥", "경련", "흡인성 폐렴"],
      delayed_toxicity: ["백혈병 (만성 노출, 수년 후)", "재생불량성 빈혈", "골수이형성증후군"],
      special_populations: ["임산부: 태반 통과, 발암 위험", "빈혈 환자: 골수 독성 가중"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 50-100m", "극인화성 — 넓은 점화원 통제"],
      evacuation_triggers: ["대기 중 벤젠 0.5ppm(TWA) 초과", "화재 위험"],
      ics_checklist: ["IC 지정", "정전기 방지", "점화원 완전 제거", "유출 흡착제 처리"],
      agencies: ["소방청", "환경부", "산업안전보건공단"],
      public_communication: ["인화·폭발 위험 안내", "실내 대피"],
      termination_criteria: ["누출 차단", "LFL 10% 미만", "대기 벤젠 TLV 미만"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: 특별관리물질 TWA 0.5ppm (발암물질 1A)", "위험물안전관리법: 제4류 제1석유류"],
      report_deadline_hours: 4,
      environmental_checks: ["수계 벤젠 농도", "토양 TPH/BTEX", "대기 VOC"],
      admin_actions: ["특수건강진단 실시", "노출 근로자 추적 관찰"],
      dispersion_model: "ALOHA",
    },
  },

  // ────────────────────────────────────────────
  // 12. 포스겐 (Phosgene)
  // ────────────────────────────────────────────
  {
    id: "phosgene",
    cas_number: "75-44-5",
    un_number: "UN1076",
    name_ko: "포스겐",
    name_en: "Phosgene",
    synonyms: ["포스겐", "COCl2", "Carbonyl Chloride", "Carbonyl Dichloride"],
    formula: "COCl₂",
    hazard_class: "독성 가스 (Class 2.3)",
    danger_level: 4,
    appearance: "무색 기체",
    odor: "갓 벤 풀·건초 냄새 (저농도에서 쾌적하게 느껴질 수 있음 — 위험!)",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A 완전 밀폐형", "SCBA", "IDLH 2ppm — 극독성", "공기보다 무거워 저지대 축적"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 절대 안정 유지 (운동 금지 — 폐부종 촉진). 100% 산소. 지연 폐부종 24-72시간 후 발생.",
        skin: "물 세척. 가스 상태에서는 피부 독성 낮음.",
        eye: "물로 세척.",
        ingestion: "해당 없음 (가스).",
      },
      field_medications: [
        { name: "산소", dose: "100%", note: "모든 노출 환자" },
        { name: "덱사메타손 흡입", dose: "의료지도 하", note: "폐 염증 억제 시도" },
      ],
      transport_criteria: ["모든 포스겐 노출자 — 무증상도 반드시 이송", "24-72시간 관찰 필수"],
      absolute_prohibitions: ["환자에게 운동·보행 시키지 말 것 (들것 이송)", "증상 없다고 귀가 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["초기: 경미한 기침, 눈 자극 (수시간 무증상기)", "지연기 (2-72h): 갑작스런 폐부종, ARDS, 저산소증", "극고농도: 즉시 사망"],
      lab_tests: ["흉부 X-ray (연속 촬영)", "ABGA", "산소 포화도 연속 모니터링", "BNP (폐부종 지표)"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료 — 폐부종 관리" }],
      admission_criteria: ["모든 노출 환자 — 최소 48시간 관찰 입원"],
      icu_criteria: ["폐부종 발생", "산소 요구량 증가", "기계적 환기 필요"],
      delayed_toxicity: ["폐부종 2-72시간 지연 (핵심 특성)", "폐섬유화 (생존 시)"],
      special_populations: ["천식/COPD: 폐부종 가속", "흡연자: 기도 손상 가중"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 반경 500m 이상", "포스겐은 극독성 + 지연독성 — 최대 격리"],
      evacuation_triggers: ["어떤 양이든 즉시 최대 대피"],
      ics_checklist: ["IC 지정", "레벨 A만 진입", "광범위 대피", "의료시설 대량 환자 준비 (지연 발생)"],
      agencies: ["소방청", "NICS", "군부대 CBRN", "질병관리청"],
      public_communication: ["즉시 실내 대피, 창문 밀폐", "증상 없어도 병원 방문 안내"],
      termination_criteria: ["누출 차단", "포스겐 불검출", "72시간 의료 모니터링 계속"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 사고대비물질", "화학무기금지협약 Schedule 3", "산업안전보건법: TWA 0.1ppm"],
      report_deadline_hours: 1,
      environmental_checks: ["대기 포스겐 실시간 모니터링", "수계 분해산물(HCl, CO₂)"],
      admin_actions: ["NICS 즉시 보고", "화학무기금지협약 보고 검토"],
      dispersion_model: "ALOHA / PHAST — 저지대 확산 모델",
    },
  },

  // ────────────────────────────────────────────
  // 13. 수산화나트륨 (Sodium Hydroxide)
  // ────────────────────────────────────────────
  {
    id: "sodium-hydroxide",
    cas_number: "1310-73-2",
    un_number: "UN1823",
    name_ko: "수산화나트륨",
    name_en: "Sodium Hydroxide",
    synonyms: ["수산화나트륨", "가성소다", "양잿물", "NaOH", "Caustic Soda", "Lye"],
    formula: "NaOH",
    hazard_class: "부식성 물질 (Class 8)",
    danger_level: 3,
    appearance: "백색 고체 (펠릿, 플레이크) 또는 무색 수용액",
    odor: "무취",
    ems_protocol: {
      ppe_level: "C",
      self_protection: ["레벨 C 화학복 + 방독면 (에어로졸 시 레벨 B)", "내알칼리성 장갑", "안면보호대", "비휘발성이나 고체 분진/에어로졸 주의"],
      route_treatments: {
        inhalation: "신선한 공기. 에어로졸/분진 흡입 시 산소 투여. 기도 부종 관찰.",
        skin: "즉시 대량의 흐르는 물 20분 이상 세척. 알칼리 화상은 산보다 깊이 침투 — 충분히 세척. 중화제 금지.",
        eye: "즉시 물로 최소 30분 세척 — 알칼리 각막 용해 위험. 안과 응급.",
        ingestion: "구토 금지. 물/우유 소량 투여. 즉시 이송.",
      },
      field_medications: [
        { name: "생리식염수", dose: "세안/세척용 대량", note: "알칼리 세척 핵심" },
        { name: "산소", dose: "필요 시", note: "에어로졸 흡입 시" },
      ],
      transport_criteria: ["눈 노출 전원", "피부 화상", "섭취 환자"],
      absolute_prohibitions: ["중화제(산) 사용 금지", "구토 유도 금지", "충분한 세척 전 이송 지연 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["피부: 미끄러운 감촉 → 깊은 액화 괴사", "눈: 각막 혼탁, 결막 괴사, 실명", "섭취: 구강·식도·위 심부 화상, 천공"],
      lab_tests: ["내시경 (섭취 24시간 이내)", "흉부/복부 X-ray (천공 배제)", "CBC, 전해질"],
      antidotes: [{ name: "특이적 해독제 없음", note: "충분한 세척 + 대증 치료" }],
      admission_criteria: ["안구 화상", "2도 이상 피부 화상", "섭취 환자"],
      icu_criteria: ["소화관 천공", "기도 폐쇄", "패혈증"],
      delayed_toxicity: ["식도 협착 (수주-수개월)", "안구 합병증 (녹내장, 백내장)"],
      special_populations: ["소아: 가정용 세제(락스 등) 오음 사고 흔함"],
    },
    dm_protocol: {
      control_zone: ["비휘발성 — 접촉 위험 위주", "Hot Zone 10-25m"],
      evacuation_triggers: ["에어로졸 발생 시", "대량 유출 시"],
      ics_checklist: ["IC 지정", "유출 차단(토류막)", "수계 유입 방지"],
      agencies: ["소방청", "환경부"],
      public_communication: ["접촉 주의", "세척 방법 안내"],
      termination_criteria: ["유출 차단", "pH 정상화", "오염 제거"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: TWA 2mg/m³(C)"],
      report_deadline_hours: 4,
      environmental_checks: ["수계 pH", "토양 알칼리화"],
      admin_actions: ["유출 시설 점검", "저장 용기 상태 확인"],
    },
  },

  // ────────────────────────────────────────────
  // 14. 과산화수소 (Hydrogen Peroxide)
  // ────────────────────────────────────────────
  {
    id: "hydrogen-peroxide",
    cas_number: "7722-84-1",
    un_number: "UN2015",
    name_ko: "과산화수소",
    name_en: "Hydrogen Peroxide",
    synonyms: ["과산화수소", "옥시풀", "과수", "H2O2"],
    formula: "H₂O₂",
    hazard_class: "산화성 액체 (Class 5.1) / 부식성 (Class 8)",
    danger_level: 2,
    appearance: "무색 투명 액체",
    odor: "약간의 자극취 또는 무취",
    ems_protocol: {
      ppe_level: "C",
      self_protection: ["레벨 C (고농도 시 B)", "내화학성 장갑", "고농도(>30%) — 강력 산화제, 유기물 접촉 시 발화 가능"],
      route_treatments: {
        inhalation: "신선한 공기. 산소 투여.",
        skin: "물로 15분 세척.",
        eye: "물로 15분 세척. 안과 의뢰.",
        ingestion: "구토 금지. 물 소량. 35% 이상 섭취 시 가스 색전증 위험 — 즉시 이송.",
      },
      field_medications: [{ name: "산소", dose: "필요 시", note: "흡입 환자" }],
      transport_criteria: ["고농도(>10%) 노출", "섭취 환자", "눈 화상"],
      absolute_prohibitions: ["유기물·가연물 접촉 금지 (발화)", "밀폐 용기 보관 금지 (산소 가스 축적)"],
    },
    med_protocol: {
      clinical_symptoms: ["저농도(3%): 경미한 자극", "고농도(>30%): 피부 화상, 점막 손상", "섭취: 위장관 화상, 산소 가스 색전증(O₂ embolism) — 치명적"],
      lab_tests: ["흉부 X-ray", "복부 CT (가스 색전 확인)", "CBC, 전해질"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료, 가스 색전 시 HBOT 고려" }],
      admission_criteria: ["고농도 노출", "섭취 환자"],
      icu_criteria: ["가스 색전증", "소화관 천공"],
      delayed_toxicity: ["식도 협착 (고농도 섭취)"],
      special_populations: ["소아: 가정용 과산화수소(3%) 오음 — 대부분 경증"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 25m", "산화성 — 가연물 격리"],
      evacuation_triggers: ["대량 유출 + 가연물 근접"],
      ics_checklist: ["IC 지정", "가연물 격리", "유출 차단"],
      agencies: ["소방청", "환경부"],
      public_communication: ["접촉 주의", "환기"],
      termination_criteria: ["유출 차단", "오염 제거"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "위험물안전관리법: 제6류 산화성 액체"],
      report_deadline_hours: 4,
      environmental_checks: ["수계 잔류 과산화수소"],
      admin_actions: ["저장 시설 점검", "유기물 혼재 저장 여부 확인"],
    },
  },

  // ────────────────────────────────────────────
  // 15. 포름알데히드 (Formaldehyde)
  // ────────────────────────────────────────────
  {
    id: "formaldehyde",
    cas_number: "50-00-0",
    un_number: "UN1198",
    name_ko: "포름알데히드",
    name_en: "Formaldehyde",
    synonyms: ["포름알데히드", "폼알데하이드", "포르말린", "Formalin", "HCHO", "메탄알"],
    formula: "HCHO",
    hazard_class: "인화성 + 독성 + 발암물질 (Class 3 / Class 8)",
    danger_level: 3,
    appearance: "무색 기체 (수용액은 무색 액체)",
    odor: "강한 자극취",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "발암물질 — 노출 최소화", "인화성 — 점화원 제거"],
      route_treatments: {
        inhalation: "신선한 공기. 산소 투여. 기관지확장제. 폐부종 관찰.",
        skin: "물로 15분 세척.",
        eye: "물로 20분 세척. 안과 의뢰.",
        ingestion: "구토 금지. 물 소량. 즉시 이송. 대사산물: 포름산 → 대사산증.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min", note: "흡입 환자" },
        { name: "살부타몰", dose: "2.5mg 네뷸라이저", note: "기관지 경련 시" },
      ],
      transport_criteria: ["흡입 증상 환자", "섭취 환자", "눈 노출"],
      absolute_prohibitions: ["구토 유도 금지", "점화원 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["상기도 자극, 기침, 호흡곤란", "피부 감작(접촉성 피부염)", "섭취: 대사산증(포름산 생성), 간·신독성", "발암성: 비인두암(IARC Group 1)"],
      lab_tests: ["ABGA", "혈중 포름산", "간·신기능", "흉부 X-ray"],
      antidotes: [
        { name: "엽산(Folic acid)", dose: "50mg IV q4h", note: "포름산 대사 촉진" },
        { name: "NaHCO₃", dose: "산증 교정", note: "pH < 7.3 시" },
      ],
      admission_criteria: ["흡입 증상", "섭취 환자", "대사산증"],
      icu_criteria: ["심한 산증", "폐부종", "간부전"],
      delayed_toxicity: ["비인두암 (만성 노출)", "천식 (감작)"],
      special_populations: ["천식: 감작 후 극소량에도 반응", "임산부: 태아 독성 우려"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 25-50m"],
      evacuation_triggers: ["대기 0.3ppm(TWA) 초과"],
      ics_checklist: ["IC 지정", "환기", "유출 차단"],
      agencies: ["소방청", "환경부", "산업안전보건공단"],
      public_communication: ["실내 환기 권고", "자극 증상 시 의료기관 방문"],
      termination_criteria: ["농도 TLV 미만", "오염 제거"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: 특별관리물질 TWA 0.3ppm (발암물질 1A)"],
      report_deadline_hours: 4,
      environmental_checks: ["실내 포름알데히드 농도", "수계 오염"],
      admin_actions: ["실내공기질 관리 (새집증후군)", "작업환경 측정"],
    },
  },

  // ────────────────────────────────────────────
  // 16. 아세톤 (Acetone)
  // ────────────────────────────────────────────
  {
    id: "acetone",
    cas_number: "67-64-1",
    un_number: "UN1090",
    name_ko: "아세톤",
    name_en: "Acetone",
    synonyms: ["아세톤", "디메틸케톤", "네일리무버", "Dimethyl Ketone", "Propanone"],
    formula: "(CH₃)₂CO",
    hazard_class: "인화성 액체 (Class 3)",
    danger_level: 2,
    appearance: "무색 투명 액체",
    odor: "달콤한 과일향 특유 냄새",
    ems_protocol: {
      ppe_level: "C",
      self_protection: ["레벨 C + 유기증기 카트리지", "인화점 -20°C — 극인화성!", "정전기 방지", "저독성이나 고농도 마취 효과"],
      route_treatments: {
        inhalation: "신선한 공기. 증상 시 산소.",
        skin: "물로 세척. 탈지 작용 — 보습 처리.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지 (흡인 위험). 소량은 체내 대사. 대량 시 이송.",
      },
      field_medications: [{ name: "산소", dose: "필요 시", note: "의식변화 시" }],
      transport_criteria: ["대량 흡입/섭취", "의식 변화", "심부정맥"],
      absolute_prohibitions: ["점화원 절대 금지 (극인화성)", "에피네프린 주의 (심근 감작)"],
    },
    med_protocol: {
      clinical_symptoms: ["두통, 어지러움, 구역", "고농도: 의식 저하, 마취 효과", "피부 탈지, 건조, 균열"],
      lab_tests: ["혈중 아세톤", "혈당 (당뇨 감별)", "케톤뇨", "ECG"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료" }],
      admission_criteria: ["의식 변화", "대량 섭취"],
      icu_criteria: ["심부정맥", "의식 저하"],
      delayed_toxicity: ["만성 피부염", "간독성 (극만성 대량 노출)"],
      special_populations: ["당뇨환자: 케톤산증 감별 필요"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 25-50m", "극인화성 — 넓은 점화원 통제"],
      evacuation_triggers: ["LFL(2.5%) 접근", "화재 위험"],
      ics_checklist: ["IC 지정", "점화원 완전 제거", "유출 흡착제 처리"],
      agencies: ["소방청"],
      public_communication: ["화재 위험 안내", "환기"],
      termination_criteria: ["유출 차단", "LFL 10% 미만"],
    },
    csa_protocol: {
      legal_classification: ["산업안전보건법: TWA 500ppm", "위험물안전관리법: 제4류 제1석유류"],
      report_deadline_hours: 4,
      environmental_checks: ["VOC 대기 농도", "수계 오염"],
      admin_actions: ["저장시설 점검", "환기설비 확인"],
    },
  },

  // ────────────────────────────────────────────
  // 17. 자일렌 (Xylene)
  // ────────────────────────────────────────────
  {
    id: "xylene",
    cas_number: "1330-20-7",
    un_number: "UN1307",
    name_ko: "자일렌",
    name_en: "Xylene",
    synonyms: ["자일렌", "크실렌", "디메틸벤젠", "Xylol", "Dimethylbenzene"],
    formula: "C₈H₁₀",
    hazard_class: "인화성 액체 (Class 3)",
    danger_level: 2,
    appearance: "무색 투명 액체",
    odor: "달콤한 방향족 냄새 (톨루엔 유사)",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "인화성 — 점화원 제거", "톨루엔과 유사한 독성 프로필"],
      route_treatments: {
        inhalation: "신선한 공기. 산소 투여.",
        skin: "비누와 물 세척. 탈지 작용.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지. 즉시 이송.",
      },
      field_medications: [{ name: "산소", dose: "15L/min", note: "증상 시" }],
      transport_criteria: ["두통·구역 지속", "의식 변화", "섭취"],
      absolute_prohibitions: ["점화원 금지", "구토 유도 금지", "에피네프린 주의"],
    },
    med_protocol: {
      clinical_symptoms: ["두통, 어지러움, 구역", "고농도: 의식저하, 심근 감작", "피부 탈지·피부염"],
      lab_tests: ["소변 메틸마뇨산", "ECG", "간기능"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료" }],
      admission_criteria: ["의식 변화", "부정맥", "섭취"],
      icu_criteria: ["심실 부정맥", "흡인성 폐렴"],
      delayed_toxicity: ["만성 신경독성", "간독성"],
      special_populations: ["간질환자: 대사 장애", "알코올 의존: 독성 증가"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 50m", "인화성 증기 확산 고려"],
      evacuation_triggers: ["대기 100ppm(TWA) 초과", "화재 위험"],
      ics_checklist: ["IC 지정", "점화원 제거", "유출 흡착"],
      agencies: ["소방청", "환경부"],
      public_communication: ["실내 대피", "점화원 금지"],
      termination_criteria: ["누출 차단", "LFL 미만", "농도 TLV 미만"],
    },
    csa_protocol: {
      legal_classification: ["산업안전보건법: TWA 100ppm", "위험물안전관리법: 제4류 제1석유류"],
      report_deadline_hours: 4,
      environmental_checks: ["VOC 대기", "수계 BTEX"],
      admin_actions: ["작업환경 측정", "환기설비 점검"],
    },
  },

  // ────────────────────────────────────────────
  // 18. 질산 (Nitric Acid)
  // ────────────────────────────────────────────
  {
    id: "nitric-acid",
    cas_number: "7697-37-2",
    un_number: "UN2031",
    name_ko: "질산",
    name_en: "Nitric Acid",
    synonyms: ["질산", "초산", "HNO3", "Aqua Fortis"],
    formula: "HNO₃",
    hazard_class: "부식성 + 산화성 (Class 8 / Class 5.1)",
    danger_level: 3,
    appearance: "무색~연한 황색 액체 (발연 질산은 적갈색)",
    odor: "자극취 (NOx 발생 시 갈색 연기)",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "NOx 가스 발생 — 갈색 연기 관찰 시 레벨 A", "산화성 — 유기물 접촉 시 발화"],
      route_treatments: {
        inhalation: "신선한 공기. 산소 투여. NOx 흡입 시 지연 폐부종 24시간 관찰.",
        skin: "물로 20분 세척. 피부 황변 특징적.",
        eye: "물로 20분 세척. 안과 즉시 의뢰.",
        ingestion: "구토 금지. 물 소량. 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min", note: "흡입 환자" },
      ],
      transport_criteria: ["흡입 노출 전원 (NOx 지연독성)", "피부·눈 화상", "섭취"],
      absolute_prohibitions: ["유기물 접촉 금지 (발화)", "구토 유도 금지", "중화제 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["피부: 황변, 화학화상", "흡입: 기침, NOx 중독 — 지연 폐부종", "섭취: 소화관 화상", "메트헤모글로빈혈증 (NOx)"],
      lab_tests: ["메트헤모글로빈", "ABGA", "흉부 X-ray (연속)", "내시경 (섭취)"],
      antidotes: [
        { name: "메틸렌블루", dose: "1-2mg/kg IV", note: "메트Hb > 30% 시" },
      ],
      admission_criteria: ["모든 흡입 환자 (NOx 지연독성)", "화상·섭취"],
      icu_criteria: ["ARDS", "심한 메트Hb혈증"],
      delayed_toxicity: ["NOx 지연 폐부종 (12-72시간)", "식도 협착"],
      special_populations: ["G6PD 결핍: 메틸렌블루 금기 — 대안 검토"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 50m", "NOx 갈색 연기 관찰 시 확대"],
      evacuation_triggers: ["갈색 연기 발생", "NOx 감지"],
      ics_checklist: ["IC 지정", "유기물 격리", "물 분무", "의료소 — 지연 환자 대비"],
      agencies: ["소방청", "환경부", "NICS"],
      public_communication: ["갈색 연기 흡입 금지", "실내 대피"],
      termination_criteria: ["누출 차단", "NOx 불검출", "24시간 의료 관찰"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: TWA 2ppm", "위험물안전관리법: 제6류 산화성 액체"],
      report_deadline_hours: 1,
      environmental_checks: ["수계 질산·질산염", "대기 NOx"],
      admin_actions: ["NICS 보고", "산화성 물질 혼재 저장 점검"],
      dispersion_model: "ALOHA — NOx 확산 모델",
    },
  },

  // ────────────────────────────────────────────
  // 19. 페놀 (Phenol)
  // ────────────────────────────────────────────
  {
    id: "phenol",
    cas_number: "108-95-2",
    un_number: "UN2312",
    name_ko: "페놀",
    name_en: "Phenol",
    synonyms: ["페놀", "석탄산", "카르볼산", "Carbolic Acid", "C6H5OH"],
    formula: "C₆H₅OH",
    hazard_class: "독성 + 부식성 (Class 6.1 / Class 8)",
    danger_level: 3,
    appearance: "무색~분홍색 결정 또는 액체",
    odor: "특유의 달콤한 타르 냄새",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B", "피부 흡수 매우 빠름 — 피부 보호 필수", "부틸고무 장갑"],
      route_treatments: {
        inhalation: "신선한 공기. 산소.",
        skin: "즉시 PEG(폴리에틸렌글리콜) 300/400으로 닦아낸 후 물 세척. PEG 없으면 물로 15분 세척. 피부 흡수 → 전신 독성!",
        eye: "물로 20분 세척.",
        ingestion: "구토 금지. 물/우유 소량. 즉시 이송.",
      },
      field_medications: [
        { name: "PEG 300/400", dose: "피부 도포 후 닦아내기", note: "페놀 용해·제거 — 물보다 효과적" },
        { name: "산소", dose: "필요 시", note: "전신 독성 시" },
      ],
      transport_criteria: ["피부 노출 면적 불문 이송", "섭취 환자", "전신 증상"],
      absolute_prohibitions: ["물 단독 세척에 의존 금지 (페놀은 지용성)", "구토 유도 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["피부: 백색 화상 → 갈변, 무통(신경 손상)", "전신: 피부 흡수 → 경련, 심부정맥, 간·신부전, 메트Hb", "섭취: 소화관 화상, 전신 독성"],
      lab_tests: ["소변 페놀", "메트헤모글로빈", "간·신기능", "ECG", "CBC"],
      antidotes: [{ name: "특이적 해독제 없음", note: "PEG 피부 제독 + 대증치료" }],
      admission_criteria: ["모든 페놀 노출", "면적 불문"],
      icu_criteria: ["경련", "심부정맥", "간·신부전"],
      delayed_toxicity: ["간부전", "신부전", "용혈"],
      special_populations: ["소아: 체표면적 대비 흡수량 큼"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 25-50m"],
      evacuation_triggers: ["대량 유출", "다수 피부 노출 환자"],
      ics_checklist: ["IC 지정", "PEG 대량 확보", "유출 차단"],
      agencies: ["소방청", "환경부"],
      public_communication: ["접촉 주의", "피부 노출 시 즉시 세척"],
      termination_criteria: ["유출 차단", "오염 제거"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: TWA 5ppm"],
      report_deadline_hours: 4,
      environmental_checks: ["수계 페놀 농도", "토양 오염"],
      admin_actions: ["시설 점검", "PEG 비치 확인"],
    },
  },

  // ────────────────────────────────────────────
  // 20. 브롬 (Bromine)
  // ────────────────────────────────────────────
  {
    id: "bromine",
    cas_number: "7726-95-6",
    un_number: "UN1744",
    name_ko: "브롬",
    name_en: "Bromine",
    synonyms: ["브롬", "취소", "Br2", "Bromine"],
    formula: "Br₂",
    hazard_class: "독성 + 부식성 + 산화성 (Class 6.1 / Class 8)",
    danger_level: 4,
    appearance: "적갈색 액체, 적갈색 증기",
    odor: "강하고 자극적인 불쾌한 냄새",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A 완전 밀폐형", "SCBA", "브롬은 극부식성·독성", "피부 접촉 시 심한 화상", "공기보다 무거워 저지대 축적"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 100% 산소. 기관지확장제. 폐부종 관찰.",
        skin: "즉시 물로 20분 이상 세척. 심한 화학화상 — 드레싱.",
        eye: "물로 20분 세척. 심한 각막 손상 위험.",
        ingestion: "구토 금지. 물 소량. 즉시 이송.",
      },
      field_medications: [
        { name: "산소", dose: "15L/min", note: "전 흡입 환자" },
        { name: "살부타몰", dose: "2.5mg 네뷸라이저", note: "기관지 경련 시" },
      ],
      transport_criteria: ["모든 노출 환자 이송"],
      absolute_prohibitions: ["PPE 없이 접근 금지", "저지대 진입 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["흡입: 심한 기도 자극, 폐부종", "피부: 심부 화학화상, 수포, 궤양", "눈: 각막 화상, 실명 위험", "전신: 메트Hb혈증"],
      lab_tests: ["ABGA", "흉부 X-ray", "메트헤모글로빈", "CBC, 전해질"],
      antidotes: [
        { name: "특이적 해독제 없음", note: "대증 치료" },
        { name: "메틸렌블루", dose: "1-2mg/kg IV", note: "메트Hb > 30% 시" },
      ],
      admission_criteria: ["모든 노출 환자"],
      icu_criteria: ["폐부종", "심한 화상", "메트Hb혈증"],
      delayed_toxicity: ["폐부종 지연 발생", "피부 흉터"],
      special_populations: ["천식: 기관지 반응 과민", "G6PD 결핍: 메틸렌블루 주의"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 반경 100-200m", "적갈색 증기/액체 — 시각적 식별 가능"],
      evacuation_triggers: ["브롬 증기 감지", "적갈색 연기 관찰"],
      ics_checklist: ["IC 지정", "레벨 A 팀 진입", "물 분무 (증기 억제)"],
      agencies: ["소방청", "NICS", "환경부"],
      public_communication: ["적갈색 연기 흡입 금지", "즉시 실내 대피"],
      termination_criteria: ["누출 차단", "브롬 불검출", "전원 이송"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질 (사고대비물질)", "산업안전보건법: TWA 0.1ppm"],
      report_deadline_hours: 1,
      environmental_checks: ["수계 브롬 이온", "대기 브롬 증기"],
      admin_actions: ["NICS 보고", "저장시설 점검"],
      dispersion_model: "ALOHA — 저지대 확산",
    },
  },

  // ────────────────────────────────────────────
  // 21. 에틸렌옥사이드 (Ethylene Oxide)
  // ────────────────────────────────────────────
  {
    id: "ethylene-oxide",
    cas_number: "75-21-8",
    un_number: "UN1040",
    name_ko: "에틸렌옥사이드",
    name_en: "Ethylene Oxide",
    synonyms: ["에틸렌옥사이드", "산화에틸렌", "EO", "EtO", "Oxirane"],
    formula: "C₂H₄O",
    hazard_class: "인화성 가스 + 독성 + 발암 (Class 2.3 / Class 2.1)",
    danger_level: 4,
    appearance: "무색 기체 (액화 시 무색 액체)",
    odor: "달콤한 에테르 냄새",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A", "SCBA", "극인화성 — 폭발 범위 3-100%!", "발암물질", "IDLH 800ppm"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 산소 투여. 기관지확장제. 폐부종 관찰.",
        skin: "오염 의복 제거. 물 세척. 액체 EO는 동상 + 화학화상.",
        eye: "물로 20분 세척.",
        ingestion: "해당 드묾 (가스). 구토 금지.",
      },
      field_medications: [{ name: "산소", dose: "15L/min", note: "전 흡입 환자" }],
      transport_criteria: ["모든 노출 환자"],
      absolute_prohibitions: ["점화원 절대 금지 (폭발 범위 3-100%)", "SCBA 없이 진입 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["두통, 구역, 어지러움", "기도 자극, 폐부종 (지연)", "피부 수포, 동상", "만성: 백혈병, 림프종 (발암)"],
      lab_tests: ["CBC", "ABGA", "흉부 X-ray", "간기능"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증 치료" }],
      admission_criteria: ["흡입 증상", "피부 화상"],
      icu_criteria: ["폐부종", "심한 화상"],
      delayed_toxicity: ["백혈병, 림프종 (만성)", "신경독성 (말초신경병증)"],
      special_populations: ["임산부: 생식독성·기형유발", "만성 노출 근로자: 발암 감시"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 300m 이상", "폭발 위험 최우선 — 점화원 완전 통제"],
      evacuation_triggers: ["어떤 양이든 누출 시 즉시 대피", "폭발 범위 매우 넓음"],
      ics_checklist: ["IC 지정", "전기·점화원 완전 차단", "폭발 방호 거리 확보"],
      agencies: ["소방청", "NICS", "산업안전보건공단"],
      public_communication: ["폭발 위험 안내", "즉시 대피"],
      termination_criteria: ["누출 차단", "EO 불검출", "폭발 위험 해소"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 사고대비물질", "산업안전보건법: 특별관리물질 TWA 1ppm (발암 1A)"],
      report_deadline_hours: 1,
      environmental_checks: ["대기 EO 모니터링"],
      admin_actions: ["NICS 보고", "멸균시설 안전점검"],
      dispersion_model: "ALOHA",
    },
  },

  // ────────────────────────────────────────────
  // 22. 인화수소/포스핀 (Phosphine)
  // ────────────────────────────────────────────
  {
    id: "phosphine",
    cas_number: "7803-51-2",
    un_number: "UN2199",
    name_ko: "인화수소",
    name_en: "Phosphine",
    synonyms: ["인화수소", "포스핀", "PH3", "Phosphine", "수소화인"],
    formula: "PH₃",
    hazard_class: "독성 가스 + 인화성 (Class 2.3 / Class 2.1)",
    danger_level: 4,
    appearance: "무색 기체",
    odor: "마늘·생선 썩는 냄새 (불순물 때문)",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A", "SCBA", "IDLH 50ppm", "인화성 — 자연 발화 가능", "훈증제(알루미늄 인화물)에서 발생"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 100% 산소. 폐부종 관찰. 심장 모니터링 — 심근 독성.",
        skin: "물 세척 (가스 상태에서는 피부 독성 낮음).",
        eye: "물로 세척.",
        ingestion: "알루미늄 인화물 섭취 시 위장 내 PH₃ 발생 — 즉시 이송. 구토 금지.",
      },
      field_medications: [
        { name: "산소", dose: "100%", note: "전 흡입 환자" },
        { name: "황산마그네슘", dose: "2g IV", note: "심부정맥 시 — 의료지도 하" },
      ],
      transport_criteria: ["모든 노출 환자 즉시 이송"],
      absolute_prohibitions: ["SCBA 없이 진입 금지", "구토 유도 금지 (인화물 섭취 시 PH₃ 추가 발생)"],
    },
    med_protocol: {
      clinical_symptoms: ["흡입: 두통, 구역 → 폐부종 → 심부전 → 다장기부전", "심근 독성: 심근염, 부정맥, 심정지", "간·신부전", "섭취(인화물): 위장관 화상 + 전신 PH₃ 독성"],
      lab_tests: ["Troponin, CK-MB (심근 손상)", "ECG 연속", "ABGA", "간·신기능", "전해질 (마그네슘 포함)"],
      antidotes: [{ name: "특이적 해독제 없음", note: "심장·폐 집중 지지치료" }],
      admission_criteria: ["모든 노출 환자"],
      icu_criteria: ["심근 손상", "폐부종", "다장기부전"],
      delayed_toxicity: ["심근병증", "간부전"],
      special_populations: ["농약(인화알루미늄) 자살 시도: 높은 사망률"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 200m 이상", "훈증 중인 창고·선박 주의"],
      evacuation_triggers: ["PH₃ 감지", "훈증제 누출"],
      ics_checklist: ["IC 지정", "레벨 A 진입", "점화원 제거", "훈증 중단"],
      agencies: ["소방청", "NICS", "농림부 (농약 관련)"],
      public_communication: ["마늘 냄새 발생 시 즉시 대피"],
      termination_criteria: ["PH₃ 불검출", "환기 완료"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 사고대비물질", "산업안전보건법: TWA 0.3ppm"],
      report_deadline_hours: 1,
      environmental_checks: ["대기 PH₃ 모니터링", "훈증 현장 잔류가스"],
      admin_actions: ["NICS 보고", "훈증 작업 안전관리 점검"],
      dispersion_model: "ALOHA",
    },
  },

  // ────────────────────────────────────────────
  // 23. 사염화탄소 (Carbon Tetrachloride)
  // ────────────────────────────────────────────
  {
    id: "carbon-tetrachloride",
    cas_number: "56-23-5",
    un_number: "UN1846",
    name_ko: "사염화탄소",
    name_en: "Carbon Tetrachloride",
    synonyms: ["사염화탄소", "CCl4", "테트라클로로메탄", "Tetrachloromethane"],
    formula: "CCl₄",
    hazard_class: "독성 (Class 6.1)",
    danger_level: 3,
    appearance: "무색 투명 액체",
    odor: "달콤한 에테르 냄새 (클로로포름 유사)",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "간·신독성 강함", "열분해 시 포스겐 발생 가능!"],
      route_treatments: {
        inhalation: "신선한 공기. 산소 투여.",
        skin: "비누와 물 세척. 피부 흡수 가능.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지. 활성탄 1g/kg (의식 있는 경우). 즉시 이송.",
      },
      field_medications: [{ name: "산소", dose: "15L/min", note: "흡입 환자" }],
      transport_criteria: ["모든 노출 환자 — 지연성 간독성"],
      absolute_prohibitions: ["알코올 섭취 금지 (간독성 증폭)", "화염 근처 금지 (포스겐 발생)"],
    },
    med_protocol: {
      clinical_symptoms: ["초기: 두통, 구역, 어지러움, 마취 효과", "지연 (24-48h): 간부전 (AST/ALT 급상승), 신부전", "사망원인: 간괴사, 신부전"],
      lab_tests: ["간기능 (AST, ALT, 빌리루빈) — 반복 측정!", "신기능", "PT/INR", "복부 초음파"],
      antidotes: [
        { name: "N-아세틸시스테인(NAC)", dose: "아세트아미노펜 중독 프로토콜 준용", note: "간보호 효과 — 일부 사용" },
      ],
      admission_criteria: ["모든 노출 환자 — 간기능 48시간 추적"],
      icu_criteria: ["간부전", "신부전", "응고장애"],
      delayed_toxicity: ["간괴사 (24-72시간 후)", "신부전", "간암 (만성)"],
      special_populations: ["알코올 사용자: 간독성 급격히 증가", "간질환자: 소량도 치명"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 50m"],
      evacuation_triggers: ["대량 유출", "화재 시 포스겐 발생 우려"],
      ics_checklist: ["IC 지정", "화재 시 포스겐 대비", "유출 차단"],
      agencies: ["소방청", "환경부"],
      public_communication: ["화재 시 유독가스 발생 안내", "실내 대피"],
      termination_criteria: ["유출 차단", "잔류 증기 환기"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 유해화학물질", "산업안전보건법: TWA 5ppm", "몬트리올 의정서: 오존층 파괴물질 (생산 금지)"],
      report_deadline_hours: 4,
      environmental_checks: ["수계 CCl₄", "토양 오염", "대기 농도"],
      admin_actions: ["불법 사용 여부 조사 (생산 금지 물질)", "시설 점검"],
      dispersion_model: "ALOHA",
    },
  },

  // ────────────────────────────────────────────
  // 24. 아크릴로니트릴 (Acrylonitrile)
  // ────────────────────────────────────────────
  {
    id: "acrylonitrile",
    cas_number: "107-13-1",
    un_number: "UN1093",
    name_ko: "아크릴로니트릴",
    name_en: "Acrylonitrile",
    synonyms: ["아크릴로니트릴", "시안화비닐", "Vinyl Cyanide", "AN", "2-Propenenitrile"],
    formula: "CH₂=CHCN",
    hazard_class: "인화성 + 독성 + 발암 (Class 3 / Class 6.1)",
    danger_level: 4,
    appearance: "무색 액체",
    odor: "마늘/양파 유사 냄새",
    ems_protocol: {
      ppe_level: "A",
      self_protection: ["레벨 A", "SCBA", "인화성 + 시안화물 독성", "피부 흡수 빠름"],
      route_treatments: {
        inhalation: "즉시 오염구역 이탈. 100% 산소. 시안화물 해독 프로토콜 적용 — 히드록소코발라민 준비.",
        skin: "오염 의복 즉시 제거. 물 세척 15분. 피부 흡수 → 시안화물 전신 독성!",
        eye: "물로 20분 세척.",
        ingestion: "구토 금지. 즉시 이송. 시안화물 해독 준비.",
      },
      field_medications: [
        { name: "히드록소코발라민", dose: "5g IV", note: "시안화물 독성 해독" },
        { name: "산소", dose: "100%", note: "필수" },
      ],
      transport_criteria: ["모든 노출 환자 즉시 이송"],
      absolute_prohibitions: ["피부 노출 경시 금지", "점화원 금지", "SCBA 없이 진입 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["두통, 구역, 어지러움 → 경련 → 혼수 (시안화물 기전)", "대사산증, 고 lactate", "발암성: 폐암 (IARC 2B)"],
      lab_tests: ["Lactate", "시안화물 농도", "ABGA", "메트Hb", "간·신기능"],
      antidotes: [
        { name: "히드록소코발라민", dose: "5g IV", note: "1차 해독제" },
        { name: "시안화물 해독 키트", note: "대안" },
      ],
      admission_criteria: ["모든 노출 환자"],
      icu_criteria: ["의식 변화", "심한 산증", "해독제 투여"],
      delayed_toxicity: ["폐암 (만성 노출)", "간독성"],
      special_populations: ["임산부: 생식독성", "만성 노출 근로자: 발암 감시"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 200m 이상"],
      evacuation_triggers: ["누출 감지", "화재 시 HCN 발생"],
      ics_checklist: ["IC 지정", "레벨 A 진입", "Cyanokit 대량 확보", "점화원 제거"],
      agencies: ["소방청", "NICS", "산업안전보건공단"],
      public_communication: ["즉시 대피", "마늘 냄새 발생 시 주의"],
      termination_criteria: ["누출 차단", "AN 불검출"],
    },
    csa_protocol: {
      legal_classification: ["화학물질관리법: 사고대비물질", "산업안전보건법: 특별관리물질 TWA 2ppm (발암 2B)"],
      report_deadline_hours: 1,
      environmental_checks: ["대기 AN 모니터링", "수계 시안화물"],
      admin_actions: ["NICS 보고", "석유화학 공정 점검"],
      dispersion_model: "ALOHA",
    },
  },

  // ────────────────────────────────────────────
  // 25. 이황화탄소 (Carbon Disulfide)
  // ────────────────────────────────────────────
  {
    id: "carbon-disulfide",
    cas_number: "75-15-0",
    un_number: "UN1131",
    name_ko: "이황화탄소",
    name_en: "Carbon Disulfide",
    synonyms: ["이황화탄소", "CS2", "Carbon Bisulfide"],
    formula: "CS₂",
    hazard_class: "인화성 + 독성 (Class 3 / Class 6.1)",
    danger_level: 3,
    appearance: "무색 액체",
    odor: "순수: 달콤한 에테르 냄새 / 불순: 불쾌한 황 냄새",
    ems_protocol: {
      ppe_level: "B",
      self_protection: ["레벨 B + SCBA", "극인화성 — 자연발화온도 90°C (매우 낮음!)", "정전기·뜨거운 표면만으로 발화", "증기는 공기보다 무거움"],
      route_treatments: {
        inhalation: "신선한 공기. 산소. 신경 독성 증상 관찰.",
        skin: "물 세척. 피부 흡수 → 전신 독성.",
        eye: "물로 15분 세척.",
        ingestion: "구토 금지. 즉시 이송.",
      },
      field_medications: [{ name: "산소", dose: "15L/min", note: "흡입 환자" }],
      transport_criteria: ["모든 증상 환자", "대량 노출"],
      absolute_prohibitions: ["점화원 절대 금지 (자연발화온도 90°C)", "뜨거운 파이프·엔진 근처 접근 금지"],
    },
    med_protocol: {
      clinical_symptoms: ["급성: 도취감, 두통, 경련, 혼수", "심혈관: 관상동맥질환 가속", "만성: 파킨슨 유사 증후군, 말초신경병증, 정신장애"],
      lab_tests: ["신경전도검사", "소변 TTCA (대사물)", "ECG", "간기능"],
      antidotes: [{ name: "특이적 해독제 없음", note: "대증·지지 치료" }],
      admission_criteria: ["신경 증상", "의식 변화"],
      icu_criteria: ["경련", "혼수"],
      delayed_toxicity: ["관상동맥질환 (만성)", "파킨슨 유사 증후군", "망막 혈관 병변"],
      special_populations: ["심혈관질환자: 동맥경화 가속", "임산부: 생식독성"],
    },
    dm_protocol: {
      control_zone: ["Hot Zone 50-100m", "자연발화 위험 — 넓은 통제"],
      evacuation_triggers: ["인화성 증기 감지", "화재 위험"],
      ics_checklist: ["IC 지정", "점화원 완전 제거 (뜨거운 표면 포함)", "유출 흡착"],
      agencies: ["소방청", "환경부"],
      public_communication: ["화재·폭발 위험", "실내 대피"],
      termination_criteria: ["유출 차단", "LFL 미만", "환기 완료"],
    },
    csa_protocol: {
      legal_classification: ["산업안전보건법: TWA 10ppm", "위험물안전관리법: 제4류 특수인화물"],
      report_deadline_hours: 4,
      environmental_checks: ["대기 CS₂", "수계 오염"],
      admin_actions: ["비스코스레이온 공장 점검", "환기설비 확인"],
      dispersion_model: "ALOHA",
    },
  },
];

// ────────────────────────────────────────────
// 검색 유틸리티 함수
// ────────────────────────────────────────────

/**
 * name_ko, name_en, synonyms, cas_number, un_number 필드를 대상으로
 * 대소문자 구분 없이 부분 일치 검색합니다.
 */
export function searchChemicals(query: string): Chemical[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return CHEMICALS.filter((chemical) => {
    const targets = [
      chemical.name_ko,
      chemical.name_en,
      chemical.cas_number,
      chemical.un_number ?? "",
      ...chemical.synonyms,
    ];

    return targets.some((target) => target.toLowerCase().includes(q));
  });
}

/**
 * id로 단일 화학물질을 반환합니다.
 */
export function getChemicalById(id: string): Chemical | undefined {
  return CHEMICALS.find((chemical) => chemical.id === id);
}
