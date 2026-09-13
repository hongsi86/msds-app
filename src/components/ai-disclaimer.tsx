/** 모든 AI 결과 위에 붙는 경고. 작게 숨기지 않는다. */
export function AiDisclaimer() {
  return (
    <div role="note" className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3">
      <p className="text-sm font-bold text-amber-800">⚠ AI 추정 결과 — 검증되지 않음</p>
      <p className="mt-1 text-xs leading-relaxed text-amber-900">
        틀릴 수 있습니다. 물질이 확인되면 &lsquo;검증 데이터&rsquo; 카드와 공식 MSDS·ERG로 다시 확인하고,
        이격거리·약물 용량은 AI 답변을 근거로 쓰지 마십시오.
      </p>
    </div>
  );
}
