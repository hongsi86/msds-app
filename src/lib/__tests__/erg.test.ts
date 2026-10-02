import { describe, expect, it } from 'vitest';
import { CHEMICALS } from '@/lib/chemicals-data';
import { UNKNOWN_ZONES, classifyPosition, getErgZones } from '@/lib/erg';

const byId = (id: string) => {
  const c = CHEMICALS.find((x) => x.id === id);
  if (!c) throw new Error(`no chemical ${id}`);
  return c;
};

describe('getErgZones', () => {
  it('표1 등재 물질은 표 수치를 그대로 쓴다 (염소 대량·밤)', () => {
    expect(getErgZones(byId('chlorine'), { spill: 'large', dayNight: 'night' })).toMatchObject({
      source: 'table',
      isolationM: 600,
      protectiveM: 6700,
    });
  });

  it('소량·낮은 소량 초기 격리와 낮 방호거리', () => {
    expect(getErgZones(byId('chlorine'), { spill: 'small', dayNight: 'day' })).toMatchObject({
      isolationM: 60,
      protectiveM: 300,
    });
  });

  it('표 미등재 물질은 지침 권고문의 초기 격리만 쓰고 방호거리를 지어내지 않는다', () => {
    const z = getErgZones(byId('toluene'), { spill: 'large', dayNight: 'night' });
    expect(z).toMatchObject({ source: 'guide', isolationM: 50, fireIsolationM: 800 });
    expect(z?.protectiveM).toBeUndefined();
  });

  it('고체·액체 격리가 다르게 적혀 있으면 큰 값을 쓴다', () => {
    expect(getErgZones(byId('sodium-hydroxide'), { spill: 'large', dayNight: 'day' })?.isolationM).toBe(50);
  });

  it('미확인 물질은 ERG 지침 111(100m)', () => {
    expect(getErgZones(undefined, { spill: 'large', dayNight: 'day' })).toBe(UNKNOWN_ZONES);
    expect(UNKNOWN_ZONES.isolationM).toBe(100);
  });

  it('등록된 모든 물질이 지도·Zone 에서 초기 격리 거리를 얻는다', () => {
    for (const c of CHEMICALS) {
      expect(getErgZones(c, { spill: 'large', dayNight: 'day' }), c.id).not.toBeNull();
    }
  });
});

describe('classifyPosition', () => {
  // 염소 대량·낮: 초기 이격 600m, 방호 5.8km
  const z = getErgZones(byId('chlorine'), { spill: 'large', dayNight: 'day' })!;

  it('초기 이격 반경 안은 방향과 무관하게 isolation', () => {
    expect(classifyPosition(z, 300, 0, 0).status).toBe('isolation');
    expect(classifyPosition(z, 300, 180, 0).status).toBe('isolation');
  });

  it('바람이 북에서 불면 남쪽(풍하) 방호거리 안은 protective', () => {
    expect(classifyPosition(z, 1000, 180, 0)).toEqual({ status: 'protective', downwind: true });
  });

  it('풍상 쪽은 거리가 가까워도 방호구역이 아니다', () => {
    expect(classifyPosition(z, 1000, 0, 0).status).toBe('outside');
  });

  it('풍하라도 방호거리 밖은 outside', () => {
    expect(classifyPosition(z, 7000, 180, 0).status).toBe('outside');
  });

  it('동풍(바람이 동에서 불어옴)이면 서쪽이 풍하다', () => {
    expect(classifyPosition(z, 1000, 270, 90).status).toBe('protective');
    expect(classifyPosition(z, 1000, 90, 90).status).toBe('outside');
  });
});

describe('기상청 base_time (KST)', async () => {
  const { buildBaseDateTime } = await import('@/app/api/weather/route');
  it('UTC 05:50 = KST 14:50 → 1400', () => {
    expect(buildBaseDateTime(new Date('2026-10-02T05:50:00Z'))).toEqual({ baseDate: '20261002', baseTime: '1400' });
  });
  it('KST 00:10 은 전날 23시', () => {
    expect(buildBaseDateTime(new Date('2026-10-01T15:10:00Z'))).toEqual({ baseDate: '20261001', baseTime: '2300' });
  });
});
