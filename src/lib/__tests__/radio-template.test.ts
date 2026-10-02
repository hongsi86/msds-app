import { describe, expect, it } from 'vitest';
import { getChemicalById } from '../chemicals-data';
import { composeRadio } from '../radio-template';

const chlorine = getChemicalById('chlorine')!;
const noon = new Date('2026-10-02T12:00:00+09:00');

describe('무전 문안 — 입력하지 않은 사실을 적지 않는다', () => {
  it('통보 여부를 표시하지 않으면 "통보 완료" 가 나오지 않는다', () => {
    const text = composeRadio('initial', { chemical: chlorine, reportedAt: noon, patientsExposed: 3 });
    expect(text).not.toContain('통보 완료');
    expect(text).toContain('통보 전');
  });

  it('통보를 표시하면 "통보 완료"', () => {
    const text = composeRadio('initial', {
      chemical: chlorine, reportedAt: noon, patientsExposed: 3, hospitalNotified: true,
    });
    expect(text).toContain('응급실 사전 통보 완료');
  });

  it('환자 수를 모르면 "확인 중"', () => {
    expect(composeRadio('initial', { chemical: chlorine, reportedAt: noon })).toContain('환자 — 확인 중');
  });

  it('종료 요약이 비면 "완료" 를 지어내지 않는다', () => {
    const text = composeRadio('closing', { chemical: chlorine, reportedAt: noon });
    expect(text).not.toMatch(/통제.*완료|인계 완료/);
    expect(text).toContain('입력 필요');
  });

  it('누출량을 모르면 대량 누출 기준 거리와 방호거리를 적는다', () => {
    const text = composeRadio('initial', { chemical: chlorine, reportedAt: noon });
    expect(text).toContain('누출량 미상');
    expect(text).toContain('풍하 방호');
  });
});
