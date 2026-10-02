# ChemGuard

화학물질 사고 현장에서 물질별 대응 정보를 직군별(RES 구조·EMS 구급·MED 의료·DM 재난관리·CSA 화학물질안전)로 보여주는 모바일 우선 웹앱. 대한화학손상연구회.

- 배포: https://msds-app-pearl.vercel.app (master 푸시 시 Vercel 자동 배포)
- 스택: Next.js 16 (App Router) · React 19 · Tailwind v4 · Leaflet · Vercel AI SDK(Gemini)

> Next.js 16 은 이전 버전과 API 가 다르다. 코드를 고치기 전에 `node_modules/next/dist/docs/` 를 확인할 것 (AGENTS.md).

## 실행

```bash
npm install
npm run dev      # 개발 (서비스워커 등록 안 함)
npm run build && npm start   # 오프라인·설치 동작은 프로덕션 빌드에서만 확인 가능
npm test         # vitest
```

환경 변수(`.env.local`, `.env.example` 참고):

| 이름 | 용도 |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI 증상 추정·사진 식별·AI 검색 |
| `KMA_API_KEY` | 기상청 초단기실황(풍향·풍속) |

## 구조

| 경로 | 내용 |
|---|---|
| `src/lib/chemicals-data.ts` | 검증 데이터(물질·직군별 프로토콜). 검색도 브라우저에서 이 데이터로 한다 |
| `src/lib/erg.ts` | **이격거리의 유일한 출처.** 지도·Zone 은 여기서만 거리를 얻는다. 값이 없으면 수치를 지어내지 않는다 |
| `src/app/chemical/[id]` | 물질 상세(빌드 시 전 물질 정적 생성) |
| `src/app/map`, `src/app/zone` | ERG 초기 이격 원 + 풍하 방호활동 사각형 / 카메라 구역 판정 |
| `src/app/api/*` | AI 3종(identify·vision·search-ai)과 기상 프록시 |
| `src/app/sw.js/route.ts` | 서비스워커. 빌드마다 커밋 기준 캐시 이름과 사전 캐시 목록을 만든다 |

## 원칙

- **거리·약물 용량은 검증 데이터에서만.** AI 는 수치를 내지 않도록 프롬프트로 막고, 모든 AI 결과에 경고를 붙인다.
- **의료 내용은 학회 전문가 감수 후 확정.** 감수 전 EMS·MED 탭에는 경고 배너를 둔다.
- **오프라인 우선.** 검색·물질 상세·Zone 계산은 연결 없이 동작해야 한다. 지도 배경·AI·기상은 연결 필요.

## 오프라인 확인 절차 (릴리스마다)

1. `npm run build && npm start` 후 Chrome 으로 접속, DevTools → Application 에서 서비스워커 activated 확인
2. Cache Storage 에 `/chemical/*` 전부와 `/_next/static` 청크가 있는지 확인
3. Network 를 Offline 으로 바꾸고 `/`, `/chemical/chlorine?role=EMS`, `/zone?chem=chlorine` 새로고침, 검색 동작 확인
