import type { Chemical } from '@/lib/types';
import { degToCompass16, windDownwindDeg, type GeoPoint, type WeatherSnapshot } from '@/lib/weather';

export type RadioKind = 'initial' | 'update' | 'closing';

export interface IncidentContext {
  chemical: Chemical;
  position?: GeoPoint;
  weather?: WeatherSnapshot;
  reportedAt?: Date;
  observerName?: string;
  spillVolumeL?: number;
  patientsExposed?: number;
  patientsTransport?: number;
  resourceRequests?: string[];
  changedSince?: string;
  closingSummary?: string;
}

function fmtTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function locationLine(ctx: IncidentContext): string {
  if (!ctx.position) return '위치 — 확인 중.';
  return `위치 — 위도 ${ctx.position.lat.toFixed(4)}, 경도 ${ctx.position.lon.toFixed(4)}.`;
}

function windLine(ctx: IncidentContext): string {
  if (!ctx.weather) return '풍향·풍속 — 미확인.';
  const fromDir = degToCompass16(ctx.weather.wind_direction_deg);
  const toDir = degToCompass16(windDownwindDeg(ctx.weather.wind_direction_deg));
  return `풍향 — ${fromDir}측에서 ${toDir}측으로 ${ctx.weather.wind_speed_ms} m/s.`;
}

function ergLine(ctx: IncidentContext): string {
  const r = ctx.chemical.res_protocol;
  const guide = r.erg_guide_number ? `ERG${r.erg_guide_number}` : 'ERG 미지정';
  const dist = r.erg_distance;
  if (dist) {
    const isolation =
      ctx.spillVolumeL && ctx.spillVolumeL > 208
        ? dist.initial_isolation_m.large_spill
        : dist.initial_isolation_m.small_spill;
    return `조치 — ${guide} 적용, 초기 격리 ${isolation}m. PPE ${r.ppe_level} 진입.`;
  }
  return `조치 — ${guide} 적용 (${r.erg_action_summary ?? '주황색 지침 확인 중'}). PPE ${r.ppe_level} 진입.`;
}

function substanceLine(ctx: IncidentContext): string {
  const c = ctx.chemical;
  const un = c.un_number ? `${c.un_number}` : 'UN 미상';
  const vol = ctx.spillVolumeL ? `누출량 추정 ${ctx.spillVolumeL}L` : '누출량 확인 중';
  return `물질 — ${c.name_ko}(${un}), ${vol}.`;
}

function patientLine(ctx: IncidentContext): string {
  const ex = ctx.patientsExposed ?? 0;
  if (ex === 0) return '환자 — 노출자 없음.';
  const trans = ctx.patientsTransport ?? 0;
  return `환자 — 노출자 ${ex}명, 이송 ${trans}명, 응급실 사전 통보 완료.`;
}

function resourceLine(ctx: IncidentContext): string {
  if (!ctx.resourceRequests?.length) return '지원 요청 — 없음.';
  return `지원 요청 — ${ctx.resourceRequests.join(', ')}.`;
}

export function composeRadio(kind: RadioKind, ctx: IncidentContext): string {
  const at = ctx.reportedAt ?? new Date();
  const head = ctx.observerName ? `본부, ${ctx.observerName} 현장 보고.` : '본부, 현장 보고.';
  const stamp = `[${fmtTime(at)}]`;

  if (kind === 'initial') {
    return [
      `${head} ${stamp} 초기 보고.`,
      locationLine(ctx),
      substanceLine(ctx),
      windLine(ctx),
      ergLine(ctx),
      patientLine(ctx),
      resourceLine(ctx),
      '이상.',
    ].join('\n');
  }

  if (kind === 'update') {
    return [
      `${head} ${stamp} 상황 변경.`,
      ctx.changedSince ? `변경 사항 — ${ctx.changedSince}.` : '변경 사항 — 확인 중.',
      substanceLine(ctx),
      windLine(ctx),
      ergLine(ctx),
      patientLine(ctx),
      resourceLine(ctx),
      '이상.',
    ].join('\n');
  }

  return [
    `${head} ${stamp} 상황 종료.`,
    ctx.closingSummary ? `종료 요약 — ${ctx.closingSummary}.` : '종료 요약 — 누출 통제·환자 인계 완료.',
    locationLine(ctx),
    substanceLine(ctx),
    patientLine(ctx),
    '본부 지시 대기. 이상.',
  ].join('\n');
}
