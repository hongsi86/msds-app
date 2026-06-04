#!/usr/bin/env python3
"""
25개 화학물질의 각 entry에 res_protocol 필드를 삽입한다.
각 물질의 ems_protocol 바로 앞에 삽입.
ERG2024 표1·표2 + 소방청 HAZMAT 가이드북 + 화학구조대 매뉴얼 기반.
"""

from pathlib import Path
import re
import json

SRC = Path("/Users/jeong-gihong/msds-app/src/lib/chemicals-data.ts")

# 각 물질 id별 res_protocol 데이터
RES_DATA = {
    "sulfuric-acid": {
        "ppe_level": "B",
        "erg_guide_number": "137",
        "erg_distance": None,
        "water_reactive": True,
        "water_reaction_note": "물 희석 시 다량 발열 — 다량의 물로 한꺼번에 희석할 것. 소량 물 직접 분사는 비산·증기 발생",
        "scene_approach": [
            "풍상측·언덕 위에서 접근",
            "차량은 풍상측 정차, 누출 지점에서 충분히 이격",
            "ERG 주황색 지침 137(부식성·물반응성 액체) 참조",
        ],
        "fire_tactics": [
            "분무 주수로 증기 억제·탱크 냉각",
            "이산화탄소·분말 소화약제 가능",
            "직접 강한 물 분사 금지 — 비산 위험",
        ],
        "leak_control": [
            "둑쌓기로 하수구·수로 유입 차단",
            "비활성 흡수재(모래·규조토) 사용",
            "찰흙·톱밥 금지 (반응)",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물로 20분 이상 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1830 + 누출량(L) + 풍향·풍속",
            "화학구조대 / 중화제 / 대형 거품차",
        ],
        "absolute_prohibitions": [
            "오염자 피부에 직접 중화제(NaHCO3) 도포 금지 — 발열",
            "SCBA 없이 단독 진입 금지",
            "찰흙 흡수재 사용 금지",
        ],
    },
    "ammonia": {
        "ppe_level": "B",
        "erg_guide_number": "125",
        "erg_distance": {
            "small": (30, 0.1, 0.2),
            "large": (150, 0.8, 2.3),
        },
        "water_reactive": False,
        "water_reaction_note": "물에 잘 녹음 — 분무 주수로 증기 흡수 가능",
        "scene_approach": [
            "풍상측·언덕 위에서 접근, 저지대 침적 주의",
            "차량은 풍상측, 누출 지점에서 충분히 이격",
            "ERG 지침 125 참조 — 가스 누출 시 대량 대피",
        ],
        "fire_tactics": [
            "분무 주수로 증기 흡수·확산 차단",
            "탱크는 직접 가열 부위 냉각",
            "철수 신호: 안전밸브 소리 변화, 탱크 변색",
        ],
        "leak_control": [
            "누출원 차단 우선 (밸브 폐쇄)",
            "분무 주수 커튼으로 풍하측 차단",
            "저지대·하수구 침투 방지",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물로 20분 이상 세척, 의복 즉시 제거",
        "bleve_risk": False,
        "resource_request": [
            "UN1005 + 풍향·풍속 + 누출 형태(액체/가스)",
            "화학구조대 / 거품차 / 분무 주수 펌프",
        ],
        "absolute_prohibitions": [
            "SCBA 없이 단독 진입 금지",
            "직접 강한 물 분사로 액체 누출원 자극 금지",
            "밀폐공간 진입 시 농도 측정 없이 진입 금지",
        ],
    },
    "chlorine": {
        "ppe_level": "A",
        "erg_guide_number": "124",
        "erg_distance": {
            "small": (60, 0.3, 1.4),
            "large": (600, 3.5, 8.3),
        },
        "water_reactive": True,
        "water_reaction_note": "물에 닿으면 HCl·HOCl 발생, 증기 더 위험. 직접 물 분사 금지",
        "scene_approach": [
            "풍상측·언덕 위에서 접근 — 염소는 공기보다 2.5배 무거움, 저지대 침적",
            "차량은 풍상측 정차, 누출 지점에서 충분히 이격",
            "ERG 지침 124 참조 — 풍하측 광역 대피 필요",
        ],
        "fire_tactics": [
            "물 분무 커튼으로 증기 확산 차단 (직접 분사 금지)",
            "이산화탄소·분말 소화약제 가능",
            "탱크 외부 냉각만 — 직접 물 접촉 금지",
        ],
        "leak_control": [
            "누출원 즉시 차단 (밸브 폐쇄, 키트 사용)",
            "물 분무 커튼으로 풍하측 차단",
            "용기 누출 시 키트 응급 봉합, 풍상측에서 작업",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물로 20분 이상 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1017 + 누출량(L) + 풍향·풍속·시간대",
            "화학구조대 / 염소 응급 키트 / 분무 주수 펌프",
            "풍하 광역 대피 인구·대상",
        ],
        "absolute_prohibitions": [
            "물 직접 분사 금지 — 증기 확산 증가",
            "레벨 A 미만 PPE로 접근 금지",
            "풍하측·저지대 진입 금지",
        ],
    },
    "hydrogen-sulfide": {
        "ppe_level": "A",
        "erg_guide_number": "117",
        "erg_distance": {
            "small": (30, 0.1, 0.5),
            "large": (400, 2.4, 6.3),
        },
        "water_reactive": False,
        "water_reaction_note": None,
        "scene_approach": [
            "풍상측 접근 — 공기보다 무거워 저지대·맨홀 침적, 폐쇄공간 절대 금지",
            "후각 마비 — 저농도(>100ppm)에서 냄새 못 맡음, 농도계 필수",
            "ERG 지침 117 참조 — 가연성 + 흡입독성",
        ],
        "fire_tactics": [
            "탱크 화재 시 분무 주수로 냉각",
            "이산화탄소·분말 소화약제 사용",
            "철수 신호: 안전밸브 소리 변화, 가연성 가스 점화 위험",
        ],
        "leak_control": [
            "모든 점화원 즉시 제거 (가연성 가스)",
            "누출원 차단·환기 후 분무 주수로 가스 흡수",
            "저지대·맨홀·하수구 침투 방지",
        ],
        "decon_recommendation": "급속 대량 제독 — 호흡 도구 즉시 적용 후 환기 좋은 곳으로 이동",
        "bleve_risk": True,
        "bleve_evacuation_m": 1600,
        "resource_request": [
            "UN1053 + 농도·풍향·시간대",
            "화학구조대 / 가스 농도계 / 환기 장비",
            "폐쇄공간 진입 시 구조용 삼각대·로프",
        ],
        "absolute_prohibitions": [
            "SCBA 없이 단독 진입 금지 — 후각으로 위험 판단 금지",
            "폐쇄공간(맨홀·탱크 내부) 단독 진입 절대 금지",
            "점화원 휴대 금지 — 가연성 가스",
        ],
    },
    "toluene": {
        "ppe_level": "B",
        "erg_guide_number": "130",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 녹지 않음 — 액체 표면에 떠 화재 확산 가능",
        "scene_approach": [
            "풍상측 접근, 증기는 공기보다 무거워 저지대 침적",
            "모든 점화원·정전기 제거 (인화점 4°C)",
            "ERG 지침 130 참조 — 인화성 액체",
        ],
        "fire_tactics": [
            "일반형 거품(AFFF) 또는 알콜 저항성 거품으로 피복",
            "분무 주수로 탱크 냉각 + 증기 확산 차단",
            "이산화탄소·분말 소화약제 가능 — 봉화는 비효율",
        ],
        "leak_control": [
            "둑쌓기로 확산 방지, 수계 유입 차단",
            "비활성 흡수재(모래·규조토·질석) 사용",
            "모든 점화원 제거 + 접지로 정전기 방지",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제로 세척 후 다량의 물 헹굼",
        "bleve_risk": False,
        "resource_request": [
            "UN1294 + 누출량(L) + 화재 여부",
            "화학구조대 / 거품차 / 흡수재",
        ],
        "absolute_prohibitions": [
            "직접 강한 물 분사 금지 — 액체 비산·화재 확산",
            "점화원·정전기 미차단 상태 진입 금지",
            "밀폐공간 농도 측정 없이 진입 금지",
        ],
    },
    "hydrochloric-acid": {
        "ppe_level": "B",
        "erg_guide_number": "157",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물 희석 시 발열·HCl 증기 발생 — 다량의 물 한 번에",
        "scene_approach": [
            "풍상측 접근 — HCl 증기 확산 주의",
            "차량은 풍상측 정차, 누출 지점에서 충분히 이격",
            "ERG 지침 157 참조 — 부식성 액체",
        ],
        "fire_tactics": [
            "물 분무 커튼으로 증기 확산 차단",
            "이산화탄소·분말 소화약제 가능",
            "탱크는 직접 물 분무로 냉각",
        ],
        "leak_control": [
            "둑쌓기로 하수구·수로 유입 차단",
            "비활성 흡수재(모래·규조토) 사용",
            "물 분무로 증기 흡수, 액체 직접 분사 금지",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물로 20분 이상 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1789 + 농도·누출량",
            "화학구조대 / 중화제 / 분무 펌프",
        ],
        "absolute_prohibitions": [
            "오염자 피부에 중화제 직접 도포 금지 — 발열",
            "SCBA 없이 진입 금지",
            "수계·하수구 유입 방치 금지",
        ],
    },
    "hydrogen-fluoride": {
        "ppe_level": "A",
        "erg_guide_number": "125",
        "erg_distance": {
            "small": (30, 0.1, 0.5),
            "large": (300, 1.5, 4.6),
        },
        "water_reactive": True,
        "water_reaction_note": "물에 잘 녹으나 발열·증기↑ — 분무 주수는 신중히, 직접 물 분사 금지",
        "scene_approach": [
            "풍상측·언덕 위에서 접근 — 증기는 공기보다 약간 가벼움",
            "레벨 A 밀폐형 보호복 필수 — 피부 흡수 매우 위험",
            "ERG 지침 125 참조 — 흡입독성 + 부식성",
        ],
        "fire_tactics": [
            "물 분무 커튼으로 증기 차단",
            "이산화탄소·분말 소화약제 가능",
            "탱크 직접 분사는 분무 형태로만",
        ],
        "leak_control": [
            "누출원 차단·둑쌓기로 확산 방지",
            "물 분무로 증기 흡수, 액체 누출원 자극 금지",
            "석회·중탄산칼슘으로 중화 가능 (HAZMAT 팀)",
        ],
        "decon_recommendation": "급속 대량 제독 — 물 세척 즉시 + 글루콘산칼슘 젤 도포 (HF 특이)",
        "bleve_risk": False,
        "resource_request": [
            "UN1052 + 누출량 + 풍향·풍속",
            "화학구조대 / 글루콘산칼슘 젤 / 중화제(석회)",
            "권역응급의료센터·화상센터 동시 통보",
        ],
        "absolute_prohibitions": [
            "레벨 A 미만 PPE로 접근 금지 — 피부 흡수로 치명",
            "직접 강한 물 분사 금지 — 증기·비산 증가",
            "오염자 피부에 표준 중화제(NaHCO3) 사용 금지",
        ],
    },
    "hydrogen-cyanide": {
        "ppe_level": "A",
        "erg_guide_number": "117",
        "erg_distance": {
            "small": (60, 0.2, 0.7),
            "large": (300, 1.2, 3.5),
        },
        "water_reactive": False,
        "water_reaction_note": "물에 녹음 — 분무 주수로 흡수 가능, 단 폐수 처리 주의",
        "scene_approach": [
            "풍상측 접근 — 청산 가스는 공기보다 약간 가벼움, 빠르게 확산",
            "레벨 A 밀폐형 보호복 — 피부 흡수 치명",
            "ERG 지침 117 참조 — 가연성 + 맹독성",
        ],
        "fire_tactics": [
            "분무 주수로 증기 흡수·확산 차단",
            "이산화탄소·분말 소화약제 사용",
            "직접 물 분사로 액체 누출원 자극 금지",
        ],
        "leak_control": [
            "누출원 즉시 차단 — 밸브 폐쇄",
            "분무 주수로 가스 흡수",
            "5% 차아염소산나트륨 용액으로 중화 가능 (HAZMAT)",
        ],
        "decon_recommendation": "비상 제독 — 즉시 옷 제거 + 다량의 물 세척, Cyanokit 준비",
        "bleve_risk": False,
        "resource_request": [
            "UN1051 + 누출량·풍향",
            "화학구조대 / Cyanokit(하이드록소코발라민) / 중독센터(1339)",
            "권역응급의료센터 동시 통보",
        ],
        "absolute_prohibitions": [
            "레벨 A 미만 PPE로 접근 금지 — 피부 흡수 치명",
            "구강 대 구강 인공호흡 금지 — 구조자 2차 노출",
            "점화원 휴대 금지 — 가연성",
        ],
    },
    "carbon-monoxide": {
        "ppe_level": "C",
        "erg_guide_number": "119",
        "erg_distance": {
            "small": (30, 0.1, 0.2),
            "large": (200, 1.2, 3.9),
        },
        "water_reactive": False,
        "water_reaction_note": None,
        "scene_approach": [
            "풍상측 접근 — 공기와 비슷한 비중, 확산 빠름",
            "밀폐공간(차량·차고·지하실) 진입 시 농도계 + SCBA 필수",
            "ERG 지침 119 참조 — 가연성 + 흡입독성",
        ],
        "fire_tactics": [
            "발생원(연소기·차량) 차단·차단·환기 우선",
            "분무 주수로 가스 확산 차단",
            "이산화탄소·분말 소화약제 사용",
        ],
        "leak_control": [
            "발생원(연소·차량 엔진) 즉시 차단",
            "강제 환기 — 출입구 개방 + 송풍기",
            "농도 < 25ppm 확인 후 활동",
        ],
        "decon_recommendation": "기술적 제독 — 환기 좋은 곳으로 즉시 이송, 100% O2 투여",
        "bleve_risk": False,
        "resource_request": [
            "UN1016 + 발생원(보일러·차량·화재)",
            "화학구조대 / CO 농도계 / 강제 환기 장비",
            "고압산소치료(HBO) 가능 의료기관 통보",
        ],
        "absolute_prohibitions": [
            "농도 측정 없이 폐쇄공간 진입 금지",
            "SCBA 없이 발생원 접근 금지",
            "환기 미실시 상태로 작업 지속 금지",
        ],
    },
    "methanol": {
        "ppe_level": "B",
        "erg_guide_number": "131",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 잘 녹음 — 일반형 거품 효과 떨어짐, 알콜 저항성 거품 사용",
        "scene_approach": [
            "풍상측 접근, 모든 점화원 제거 (인화점 11°C)",
            "증기는 공기보다 약간 무거움, 저지대 침적",
            "ERG 지침 131 참조 — 인화성 액체 + 독성",
        ],
        "fire_tactics": [
            "알콜 저항성(내알콜) 거품 필수 — 일반형 거품 효과 없음",
            "분무 주수로 탱크 냉각",
            "이산화탄소·분말 소화약제 가능",
        ],
        "leak_control": [
            "둑쌓기로 확산 방지 + 수계 유입 차단",
            "모든 점화원·정전기 제거",
            "흡수재(모래·규조토) 사용",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제로 세척 후 물 헹굼",
        "bleve_risk": False,
        "resource_request": [
            "UN1230 + 누출량(L)",
            "화학구조대 / 알콜 저항성 거품차 / 흡수재",
        ],
        "absolute_prohibitions": [
            "일반형 거품 단독 사용 금지 — 무효",
            "점화원·정전기 미차단 진입 금지",
            "물 직접 강분사 금지 — 비산",
        ],
    },
    "benzene": {
        "ppe_level": "B",
        "erg_guide_number": "130",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 녹지 않음 — 수면에 떠 화재 확산",
        "scene_approach": [
            "풍상측 접근, 증기는 공기보다 무거움 (저지대 침적)",
            "모든 점화원·정전기 제거 (인화점 -11°C)",
            "발암물질 — 노출 시간 최소화",
        ],
        "fire_tactics": [
            "일반형 거품(AFFF) 사용",
            "분무 주수로 탱크 냉각 + 증기 확산 차단",
            "이산화탄소·분말 소화약제 가능",
        ],
        "leak_control": [
            "둑쌓기로 확산 방지, 수계 유입 차단",
            "비활성 흡수재(모래·규조토) 사용",
            "모든 점화원·정전기 제거",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제 세척 + 의복 즉시 제거(발암물질)",
        "bleve_risk": False,
        "resource_request": [
            "UN1114 + 누출량(L)",
            "화학구조대 / 거품차 / 흡수재",
            "노출 인원 명단 — 장기 역학조사 대상",
        ],
        "absolute_prohibitions": [
            "물 강분사 금지 — 액체 비산·화재 확산",
            "점화원 휴대 금지",
            "오염 의복 휴대 금지 — 발암물질",
        ],
    },
    "phosgene": {
        "ppe_level": "A",
        "erg_guide_number": "125",
        "erg_distance": {
            "small": (100, 0.6, 2.4),
            "large": (500, 2.9, 9.2),
        },
        "water_reactive": True,
        "water_reaction_note": "물과 반응하여 HCl·CO2 생성 — 분무 주수 흡수 효과 제한적",
        "scene_approach": [
            "풍상측·언덕 위 접근 — 공기보다 3.4배 무거워 저지대 침적",
            "레벨 A 밀폐형 보호복 필수 — 후각 마비 빠름",
            "ERG 지침 125 참조 — 흡입독성 가스, 광역 대피",
        ],
        "fire_tactics": [
            "물 분무 커튼으로 증기 확산 차단",
            "이산화탄소·분말 소화약제",
            "발생원(클로로폼·디클로로메탄 화재) 차단",
        ],
        "leak_control": [
            "누출원 즉시 차단",
            "물 분무로 증기 흡수 (효과 제한)",
            "광역 대피 우선",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물 세척, 흡입자 24시간 폐부종 관찰",
        "bleve_risk": False,
        "resource_request": [
            "UN1076 + 풍향·풍속·시간대",
            "화학구조대 / 광역 대피 자원 / 권역응급의료센터 ARDS 대비",
        ],
        "absolute_prohibitions": [
            "레벨 A 미만 PPE로 접근 금지",
            "풍하측·저지대 진입 금지",
            "지연성 폐부종 가능 — 무증상자도 24시간 관찰",
        ],
    },
    "sodium-hydroxide": {
        "ppe_level": "B",
        "erg_guide_number": "154",
        "erg_distance": None,
        "water_reactive": True,
        "water_reaction_note": "물에 녹을 때 다량 발열 — 다량의 물로 한 번에 희석",
        "scene_approach": [
            "풍상측 접근, 분진(고체)/액체 모두 부식성",
            "ERG 지침 154 참조 — 부식성·물반응 발열",
        ],
        "fire_tactics": [
            "물 분무로 분진 억제",
            "이산화탄소·분말 소화약제 가능",
        ],
        "leak_control": [
            "고체: 진공/삽으로 수거",
            "액체: 둑쌓기 + 비활성 흡수재",
            "찰흙·톱밥 금지(반응 위험)",
        ],
        "decon_recommendation": "급속 대량 제독 — 30분 이상 다량의 물로 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1823 + 형태(고체/액체)·누출량",
            "화학구조대 / 흡수재",
        ],
        "absolute_prohibitions": [
            "산성 중화제 직접 사용 금지 — 발열",
            "SCBA 없이 분진 환경 진입 금지",
            "수계·하수구 방치 금지",
        ],
    },
    "hydrogen-peroxide": {
        "ppe_level": "B",
        "erg_guide_number": "143",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 잘 녹음 — 분무 주수로 희석 가능",
        "scene_approach": [
            "풍상측 접근, 가연물 분리",
            "분해 시 산소 발생·발열·압력 상승",
            "ERG 지침 143 참조 — 산화제",
        ],
        "fire_tactics": [
            "다량의 물로 냉각·희석",
            "유기물·금속 분진과 접촉 시 폭발 위험 — 가연물 분리",
        ],
        "leak_control": [
            "둑쌓기 + 다량의 물 희석",
            "가연성 흡수재(톱밥·종이) 금지 — 발화",
            "용기 압력 상승 주의 — 통기 확보",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물로 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN2015 + 농도·누출량",
            "화학구조대 / 비활성 흡수재",
        ],
        "absolute_prohibitions": [
            "유기물·금속과 혼합 금지 — 발화",
            "밀폐 용기에 흡수재 담아 보관 금지 — 압력 상승",
            "톱밥·종이 흡수재 금지",
        ],
    },
    "formaldehyde": {
        "ppe_level": "B",
        "erg_guide_number": "132",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 잘 녹음 — 분무 주수로 증기 흡수 가능",
        "scene_approach": [
            "풍상측 접근, 강한 자극취",
            "발암물질 — 노출 시간 최소화",
            "ERG 지침 132 참조 — 인화성 액체",
        ],
        "fire_tactics": [
            "일반형 또는 알콜 저항성 거품 사용",
            "분무 주수로 탱크 냉각·증기 확산 차단",
        ],
        "leak_control": [
            "둑쌓기로 확산 방지",
            "흡수재(모래·규조토) 사용",
            "수계 유입 차단",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제로 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1198 + 농도·누출량",
            "화학구조대 / 거품차 / 흡수재",
        ],
        "absolute_prohibitions": [
            "SCBA 없이 진입 금지",
            "점화원 휴대 금지",
            "오염 의복 휴대 금지 — 발암물질",
        ],
    },
    "acetone": {
        "ppe_level": "B",
        "erg_guide_number": "127",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 잘 녹음 — 일반형 거품 효과 떨어짐, 알콜 저항성 거품 사용",
        "scene_approach": [
            "풍상측 접근, 인화점 -20°C — 점화원 즉시 제거",
            "증기는 공기보다 무거움, 저지대 침적",
            "ERG 지침 127 참조 — 인화성 액체",
        ],
        "fire_tactics": [
            "알콜 저항성 거품 필수",
            "분무 주수로 탱크 냉각",
            "이산화탄소·분말 소화약제 가능",
        ],
        "leak_control": [
            "둑쌓기 + 비활성 흡수재",
            "모든 점화원·정전기 제거",
            "수계 유입 차단",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1090 + 누출량(L)",
            "화학구조대 / 알콜 저항성 거품차",
        ],
        "absolute_prohibitions": [
            "일반형 거품 단독 사용 금지",
            "점화원·정전기 미차단 진입 금지",
            "물 직접 강분사 금지",
        ],
    },
    "xylene": {
        "ppe_level": "B",
        "erg_guide_number": "130",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 녹지 않음 — 수면에 떠 화재 확산",
        "scene_approach": [
            "풍상측 접근, 인화점 27~32°C",
            "증기는 공기보다 무거움",
            "ERG 지침 130 참조 — 인화성 액체",
        ],
        "fire_tactics": [
            "일반형 거품(AFFF) 사용",
            "분무 주수로 탱크 냉각",
            "이산화탄소·분말 소화약제 가능",
        ],
        "leak_control": [
            "둑쌓기 + 비활성 흡수재",
            "모든 점화원·정전기 제거",
            "수계 유입 차단",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1307 + 누출량(L)",
            "화학구조대 / 거품차 / 흡수재",
        ],
        "absolute_prohibitions": [
            "물 강분사 금지 — 액체 비산",
            "점화원 미차단 진입 금지",
            "오염 의복 휴대 금지",
        ],
    },
    "nitric-acid": {
        "ppe_level": "B",
        "erg_guide_number": "157",
        "erg_distance": None,
        "water_reactive": True,
        "water_reaction_note": "물 희석 시 다량 발열·갈색 NO2 증기 발생",
        "scene_approach": [
            "풍상측·언덕 위 접근 — 갈색 증기는 강한 산화제",
            "유기물·금속과 격리 — 발화·폭발 위험",
            "ERG 지침 157 참조 — 부식성·산화성",
        ],
        "fire_tactics": [
            "물 분무로 증기 확산 차단",
            "이산화탄소·분말 소화약제",
            "가연물 분리 우선",
        ],
        "leak_control": [
            "둑쌓기 + 비활성 흡수재(모래·규조토)",
            "찰흙·톱밥·종이 금지(반응 위험)",
            "유기물 혼합 절대 금지",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN2031 + 농도·누출량",
            "화학구조대 / 비활성 흡수재 / 중화제",
        ],
        "absolute_prohibitions": [
            "유기물(톱밥·종이·기름)과 접촉 금지 — 발화",
            "오염자에 직접 중화제 도포 금지",
            "SCBA 없이 진입 금지",
        ],
    },
    "phenol": {
        "ppe_level": "B",
        "erg_guide_number": "153",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 약간 녹음",
        "scene_approach": [
            "풍상측 접근, 상온에서 고체 → 증기압 낮음",
            "융점 41°C — 화재 시 액체로 변환",
            "ERG 지침 153 참조 — 독성·부식성",
        ],
        "fire_tactics": [
            "알콜 저항성 거품 사용 (극성 용매)",
            "분무 주수로 냉각",
            "이산화탄소·분말 소화약제",
        ],
        "leak_control": [
            "고체: 진공/삽 수거",
            "액체(가열 시): 둑쌓기 + 흡수재",
            "수계 유입 차단",
        ],
        "decon_recommendation": "기술적 제독 — 폴리에틸렌글리콜(PEG) + 물 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN2312 + 형태(고체/액체)·누출량",
            "화학구조대 / PEG / 거품차",
        ],
        "absolute_prohibitions": [
            "물 단독 세척 금지 — 피부 흡수 가속",
            "SCBA 없이 진입 금지",
            "수계 방치 금지 — 어류 독성",
        ],
    },
    "bromine": {
        "ppe_level": "A",
        "erg_guide_number": "154",
        "erg_distance": {
            "small": (60, 0.3, 0.6),
            "large": (300, 1.4, 4.0),
        },
        "water_reactive": True,
        "water_reaction_note": "물과 반응하여 HBr·HOBr 발생, 강한 산화제",
        "scene_approach": [
            "풍상측·언덕 위 접근 — 적갈색 액체, 증기 매우 위험",
            "레벨 A 밀폐형 보호복 — 피부 흡수 위험",
            "ERG 지침 154 참조 — 흡입독성 + 부식성 + 산화성",
        ],
        "fire_tactics": [
            "물 분무 커튼으로 증기 차단",
            "분말 소화약제 사용 — 직접 물 분사는 비산",
            "가연물 분리",
        ],
        "leak_control": [
            "둑쌓기 + 흡수재(모래)",
            "탄산나트륨 용액으로 중화 가능 (HAZMAT)",
            "찰흙·톱밥 금지(반응 위험)",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물 세척, 의복 즉시 제거",
        "bleve_risk": False,
        "resource_request": [
            "UN1744 + 누출량·풍향",
            "화학구조대 / 중화제(Na2CO3) / 광역 대피 자원",
        ],
        "absolute_prohibitions": [
            "레벨 A 미만 PPE로 접근 금지",
            "직접 강한 물 분사 금지",
            "톱밥·종이 흡수재 금지 — 발화",
        ],
    },
    "ethylene-oxide": {
        "ppe_level": "A",
        "erg_guide_number": "119P",
        "erg_distance": {
            "small": (30, 0.1, 0.2),
            "large": (100, 0.7, 1.5),
        },
        "water_reactive": False,
        "water_reaction_note": "물에 잘 녹음 — 분무 주수로 증기 흡수 가능",
        "scene_approach": [
            "풍상측 접근, 매우 가연성 가스 (인화점 -20°C)",
            "발암물질·돌연변이성 — 노출 시간 최소화",
            "ERG 지침 119P 참조 — 중합 반응 위험",
        ],
        "fire_tactics": [
            "분무 주수로 탱크 냉각 + 증기 확산 차단",
            "이산화탄소·분말 소화약제",
            "철수 신호: 안전밸브 소리 변화, 중합 반응(BLEVE 위험)",
        ],
        "leak_control": [
            "누출원 차단 우선",
            "모든 점화원·정전기 제거",
            "분무 주수로 가스 흡수",
        ],
        "decon_recommendation": "급속 대량 제독 — 환기 좋은 곳으로 이송",
        "bleve_risk": True,
        "bleve_evacuation_m": 1600,
        "resource_request": [
            "UN1040 + 누출량·풍향",
            "화학구조대 / 거품차 / 광역 대피 자원",
            "용기 가열·중합 시 BLEVE 1.6km 대피",
        ],
        "absolute_prohibitions": [
            "점화원 휴대 금지",
            "가열된 용기 접근 금지 — 중합·BLEVE 위험",
            "오염 의복 휴대 금지 — 발암물질",
        ],
    },
    "phosphine": {
        "ppe_level": "A",
        "erg_guide_number": "119",
        "erg_distance": {
            "small": (60, 0.2, 0.6),
            "large": (400, 2.0, 5.3),
        },
        "water_reactive": False,
        "water_reaction_note": None,
        "scene_approach": [
            "풍상측 접근, 마늘·생선 비린내 — 후각 빠르게 마비",
            "공기 중 자연 발화 가능 — 농도 차에 따라",
            "ERG 지침 119 참조 — 가연성 + 맹독성",
        ],
        "fire_tactics": [
            "분무 주수로 가스 확산 차단",
            "이산화탄소·분말 소화약제",
            "용기 냉각 우선",
        ],
        "leak_control": [
            "누출원 즉시 차단",
            "모든 점화원 제거",
            "분무 주수로 가스 흡수",
        ],
        "decon_recommendation": "비상 제독 — 즉시 환기 + 산소 투여",
        "bleve_risk": True,
        "bleve_evacuation_m": 1600,
        "resource_request": [
            "UN2199 + 누출량·풍향",
            "화학구조대 / 가스 농도계 / 중독센터(1339)",
        ],
        "absolute_prohibitions": [
            "레벨 A 미만 PPE로 접근 금지",
            "점화원 휴대 금지 — 자연 발화",
            "오염자 구강 대 구강 호흡 금지",
        ],
    },
    "carbon-tetrachloride": {
        "ppe_level": "B",
        "erg_guide_number": "151",
        "erg_distance": None,
        "water_reactive": False,
        "water_reaction_note": "물에 녹지 않음 — 액체 침강(공기보다 5배 무거움)",
        "scene_approach": [
            "풍상측·언덕 위 접근 — 증기는 공기보다 매우 무거움",
            "고온에서 분해 시 포스겐 발생 — 화재 노출 주의",
            "ERG 지침 151 참조 — 독성 액체",
        ],
        "fire_tactics": [
            "분무 주수로 증기 확산 차단·용기 냉각",
            "직접 강한 물 분사 금지 — 액체 비산",
            "화재 시 포스겐 발생 — 광역 대피 검토",
        ],
        "leak_control": [
            "둑쌓기 + 비활성 흡수재",
            "수계 유입 차단(발암물질·잔류)",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1846 + 누출량·화재 여부",
            "화학구조대 / 포스겐 측정 장비",
        ],
        "absolute_prohibitions": [
            "화재 노출 시 SCBA 필수 — 포스겐 분해",
            "수계 유입 방치 금지",
            "오염 의복 휴대 금지 — 발암물질",
        ],
    },
    "acrylonitrile": {
        "ppe_level": "A",
        "erg_guide_number": "131P",
        "erg_distance": {
            "small": (30, 0.2, 0.6),
            "large": (100, 1.2, 2.3),
        },
        "water_reactive": False,
        "water_reaction_note": "물에 녹음 — 분무 주수로 증기 흡수 가능",
        "scene_approach": [
            "풍상측 접근, 인화점 0°C — 매우 가연성",
            "발암물질 — 노출 시간 최소화",
            "ERG 지침 131P 참조 — 인화성 + 흡입독성 + 중합 위험",
        ],
        "fire_tactics": [
            "알콜 저항성 거품 또는 일반형 거품",
            "분무 주수로 탱크 냉각",
            "중합 반응 주의 — 안전밸브 소리 변화 시 철수",
        ],
        "leak_control": [
            "둑쌓기 + 비활성 흡수재",
            "모든 점화원·정전기 제거",
            "수계 유입 차단",
        ],
        "decon_recommendation": "급속 대량 제독 — 다량의 물 세척, Cyanokit 준비 (대사 후 시안 발생)",
        "bleve_risk": True,
        "bleve_evacuation_m": 1600,
        "resource_request": [
            "UN1093 + 누출량·풍향",
            "화학구조대 / 거품차 / Cyanokit",
        ],
        "absolute_prohibitions": [
            "레벨 A 미만 PPE로 접근 금지",
            "점화원 휴대 금지",
            "오염 의복 휴대 금지 — 발암물질",
        ],
    },
    "carbon-disulfide": {
        "ppe_level": "B",
        "erg_guide_number": "131",
        "erg_distance": {
            "small": (30, 0.1, 0.1),
            "large": (60, 0.2, 0.4),
        },
        "water_reactive": False,
        "water_reaction_note": "물에 녹지 않음 — 액체 침강",
        "scene_approach": [
            "풍상측 접근, 인화점 -30°C — 극도로 가연성",
            "자연 발화점 90°C — 뜨거운 표면 접촉 시 발화",
            "ERG 지침 131 참조 — 인화성 + 독성",
        ],
        "fire_tactics": [
            "일반형 거품 또는 알콜 저항성 거품",
            "분무 주수로 탱크 냉각",
            "이산화탄소·분말 소화약제",
        ],
        "leak_control": [
            "둑쌓기 + 흡수재(모래·규조토)",
            "모든 점화원·뜨거운 표면 제거",
            "수계 유입 차단",
        ],
        "decon_recommendation": "기술적 제독 — 비누·세제 세척",
        "bleve_risk": False,
        "resource_request": [
            "UN1131 + 누출량·풍향",
            "화학구조대 / 거품차",
        ],
        "absolute_prohibitions": [
            "뜨거운 표면 접촉 금지 — 자연 발화",
            "점화원 휴대 금지",
            "수계 방치 금지",
        ],
    },
}


def fmt_str_array(arr, indent="        "):
    lines = []
    for s in arr:
        lines.append(f'{indent}"{s}",')
    return "\n".join(lines)


def fmt_res_protocol(data):
    erg_distance_block = ""
    if data["erg_distance"]:
        d = data["erg_distance"]
        s = d["small"]
        l = d["large"]
        erg_distance_block = f"""      erg_distance: {{
        initial_isolation_m: {{ small_spill: {s[0]}, large_spill: {l[0]} }},
        protective_action_km: {{
          small_day: {s[1]}, small_night: {s[2]},
          large_day: {l[1]}, large_night: {l[2]},
        }},
      }},
"""

    water_note_line = ""
    if data["water_reaction_note"]:
        water_note_line = f'      water_reaction_note: "{data["water_reaction_note"]}",\n'

    bleve_lines = ""
    if data["bleve_risk"]:
        bleve_lines = f'      bleve_risk: true,\n      bleve_evacuation_m: {data["bleve_evacuation_m"]},\n'
    else:
        bleve_lines = "      bleve_risk: false,\n"

    erg_guide_line = ""
    if data.get("erg_guide_number"):
        erg_guide_line = f'      erg_guide_number: "{data["erg_guide_number"]}",\n'

    return f"""    res_protocol: {{
      ppe_level: "{data["ppe_level"]}",
{erg_guide_line}{erg_distance_block}      water_reactive: {str(data["water_reactive"]).lower()},
{water_note_line}      scene_approach: [
{fmt_str_array(data["scene_approach"])}
      ],
      fire_tactics: [
{fmt_str_array(data["fire_tactics"])}
      ],
      leak_control: [
{fmt_str_array(data["leak_control"])}
      ],
      decon_recommendation: "{data["decon_recommendation"]}",
{bleve_lines}      resource_request: [
{fmt_str_array(data["resource_request"])}
      ],
      absolute_prohibitions: [
{fmt_str_array(data["absolute_prohibitions"])}
      ],
    }},
"""


def main():
    src_text = SRC.read_text()

    for chem_id, data in RES_DATA.items():
        # Find the chemical block by id
        pattern = re.compile(
            r'(\{\s*\n\s*id: "' + re.escape(chem_id) + r'",.*?)(\n\s*ems_protocol:)',
            re.DOTALL,
        )
        match = pattern.search(src_text)
        if not match:
            print(f"❌ NOT FOUND: {chem_id}")
            continue

        block = fmt_res_protocol(data)
        # Insert res_protocol before ems_protocol
        replacement = match.group(1) + "\n" + block.rstrip("\n") + match.group(2)
        src_text = src_text[:match.start()] + replacement + src_text[match.end():]
        print(f"✓ {chem_id}")

    SRC.write_text(src_text)
    print(f"\nTotal: {len(RES_DATA)} chemicals updated.")


if __name__ == "__main__":
    main()
