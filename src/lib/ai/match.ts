import { CHEMICALS } from '@/lib/chemicals-data';
import type { Chemical } from '@/lib/types';

// AI 가 낸 물질 후보를 검증 데이터와 맞춰 본다. AI 문장 대신 검증 카드로 보내기 위함.
// CAS 가 맞으면 그것으로, 아니면 이름·동의어가 정확히 같을 때만 매칭한다(부분 일치로 엉뚱한 카드를 열지 않게).

const norm = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[\s\-()·]/g, '');

export function matchAiCandidate({ cas, name }: { cas?: string; name?: string }): Chemical | undefined {
  const c = cas?.trim();
  if (c) {
    const hit = CHEMICALS.find((x) => x.cas_number === c);
    if (hit) return hit;
  }
  const n = name ? norm(name) : '';
  if (!n) return undefined;
  return CHEMICALS.find((x) => [x.name_ko, x.name_en, ...x.synonyms].some((t) => norm(t) === n));
}
