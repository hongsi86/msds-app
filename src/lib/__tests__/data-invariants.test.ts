import { describe, expect, it } from 'vitest';
import { CHEMICALS } from '@/lib/chemicals-data';

// 의료·전술 내용의 옳고 그름은 학회 감수가 판단한다. 여기서는 기계적으로 잡을 수 있는 오류만 막는다.
describe('물질 데이터 불변식', () => {
  it('id 가 중복되지 않는다', () => {
    const ids = CHEMICALS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 물질에 ERG 지침번호가 있다', () => {
    for (const c of CHEMICALS) expect(c.res_protocol.erg_guide_number, c.id).toBeTruthy();
  });

  it('ERG 표1 거리: 대량 ≥ 소량, 밤 ≥ 낮', () => {
    for (const c of CHEMICALS) {
      const d = c.res_protocol.erg_distance;
      if (!d) continue;
      const p = d.protective_action_km;
      expect(d.initial_isolation_m.large_spill, c.id).toBeGreaterThanOrEqual(d.initial_isolation_m.small_spill);
      expect(p.small_night, c.id).toBeGreaterThanOrEqual(p.small_day);
      expect(p.large_night, c.id).toBeGreaterThanOrEqual(p.large_day);
      expect(p.large_day, c.id).toBeGreaterThanOrEqual(p.small_day);
    }
  });

  it('서로 다른 물질의 방호거리 표가 통째로 같으면 복사 오류로 본다', () => {
    // 2026-09 점검에서 발견, 학회 감수 대기 중인 쌍. 감수로 정정되면 여기서 지운다.
    const KNOWN_UNDER_REVIEW = new Set(['ammonia|ethylene-oxide']);
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const c of CHEMICALS) {
      const d = c.res_protocol.erg_distance;
      if (!d) continue;
      const key = JSON.stringify(d.protective_action_km);
      const prev = seen.get(key);
      if (prev) {
        const pair = [prev, c.id].sort().join('|');
        if (!KNOWN_UNDER_REVIEW.has(pair)) duplicates.push(pair);
      } else {
        seen.set(key, c.id);
      }
    }
    expect(duplicates).toEqual([]);
  });
});

describe('RES 불변식', () => {
  it('SCBA 필수라고 적은 물질의 PPE 가 C/D(공기정화식)이면 안 된다', () => {
    const bad = CHEMICALS.filter(
      (c) => ['C', 'D'].includes(c.res_protocol.ppe_level) &&
        c.res_protocol.scene_approach.some((s) => /SCBA\s*필수/.test(s)),
    ).map((c) => c.id);
    expect(bad).toEqual([]);
  });
});
