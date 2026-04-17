import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

const SYSTEM_PROMPT =
  '당신은 화학물질 사고 전문가입니다. 사용자가 설명하는 증상, 냄새, 색깔, 상황, 장소를 분석하여 가능성 있는 화학물질을 추정합니다. ' +
  '반드시 JSON 배열 형태로만 응답하세요: [{chemical_name, cas_number, confidence, reasoning, immediate_actions}]. ' +
  '최대 3개까지 제시하고 가능성 높은 순으로 정렬하세요. confidence는 "높음", "중간", "낮음" 중 하나.';

export async function POST(req: Request) {
  const body = await req.json();
  const description: string | undefined = body?.description;

  if (!description || description.trim() === '') {
    return new Response(
      JSON.stringify({ error: '증상 또는 상황 설명이 필요합니다.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    prompt: description,
  });

  return result.toTextStreamResponse();
}
