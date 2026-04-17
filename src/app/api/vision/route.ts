import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

const SYSTEM_PROMPT = `당신은 화학물질 사고 현장 이미지 분석 전문가입니다. KOSHA MSDS, ERG 2024, GHS, NFPA 기준에 정통합니다.

## 분석 대상
1. GHS 픽토그램 (불꽃, 해골, 부식, 감탄표, 환경 등)
2. UN 다이아몬드 (위험물 표지)
3. NFPA 704 다이아몬드 (건강/화재/반응성/특수)
4. 화학물질 라벨 (물질명, CAS 번호, 경고문구)
5. 용기 형태 (드럼, 탱크로리, IBC, 봄베 등)
6. 경고 표지판
7. 누출/유출 특성 (색상, 상태)

## 응답 규칙
- 반드시 JSON 배열만 출력
- 마크다운 코드 블록, 설명 텍스트 절대 출력 금지
- 식별 불가 시 빈 배열 [] 출력
- 최대 3개 물질 추정

출력 형식:
[
  {
    "chemical_name": "한국어 물질명",
    "name_en": "English Name",
    "cas_number": "CAS 번호 (확인 가능 시)",
    "confidence": "높음|중간|낮음",
    "identified_from": "식별 근거 (라벨 텍스트, GHS 픽토그램, 용기 형태 등)",
    "hazard_class": "GHS 위험성 분류",
    "danger_level": 1~4,
    "immediate_actions": ["즉각 조치 1", "즉각 조치 2", "즉각 조치 3"]
  }
]`;

export async function POST(req: Request) {
  const body = await req.json();
  const imageData: string | undefined = body?.image;

  if (!imageData) {
    return new Response(
      JSON.stringify({ error: '이미지 데이터가 필요합니다.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: imageData },
            {
              type: 'text',
              text: `${SYSTEM_PROMPT}\n\n이 이미지를 분석하여 화학물질을 식별하세요. 라벨, GHS 픽토그램, UN 다이아몬드, NFPA 마크, 용기 형태, 누출 특성 등 모든 단서를 활용하십시오.`,
            },
          ],
        },
      ],
    });

    return new Response(result.text, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Vision API error:', error);
    return new Response(
      JSON.stringify({ error: 'AI 분석 중 오류가 발생했습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
