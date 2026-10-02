import { NextRequest, NextResponse } from 'next/server';
import { toKmaGrid } from '@/lib/weather';

export const runtime = 'nodejs';

interface KmaItem {
  category: string;
  obsrValue: string;
  baseDate: string;
  baseTime: string;
}

// 기상청 base_time 은 한국 시각 기준이다. Vercel 서버는 UTC 라 로컬 시각을 쓰면 9시간 어긋난다
export function buildBaseDateTime(now: Date): { baseDate: string; baseTime: string } {
  const d = new Date(now.getTime() + 9 * 3600_000);
  if (d.getUTCMinutes() < 40) d.setUTCHours(d.getUTCHours() - 1);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  return { baseDate: `${yyyy}${mm}${dd}`, baseTime: `${hh}00` };
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.KMA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: '기상 자동 조회를 쓸 수 없습니다. 풍향을 직접 입력하세요.' },
      { status: 503 }
    );
  }

  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  // 기상청 격자는 한반도 주변만 유효하다 — 범위 밖 요청으로 일일 할당량을 쓰지 않게 막는다
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 32 || lat > 39.5 || lon < 123 || lon > 132.5) {
    return NextResponse.json({ error: '국내 좌표만 조회할 수 있습니다.' }, { status: 400 });
  }

  const { x, y } = toKmaGrid({ lat, lon });
  const { baseDate, baseTime } = buildBaseDateTime(new Date());

  const url = new URL('https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst');
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '50');
  url.searchParams.set('dataType', 'JSON');
  url.searchParams.set('base_date', baseDate);
  url.searchParams.set('base_time', baseTime);
  url.searchParams.set('nx', String(x));
  url.searchParams.set('ny', String(y));

  let resp: Response;
  try {
    resp = await fetch(url.toString(), { cache: 'no-store' });
  } catch (e) {
    console.error('[weather] KMA fetch failed', e);
    return NextResponse.json({ error: '기상청 연결 실패 — 풍향을 직접 입력하세요.' }, { status: 502 });
  }
  if (!resp.ok) {
    return NextResponse.json({ error: `기상청 응답 오류 ${resp.status}` }, { status: 502 });
  }
  const json = await resp.json();
  const items: KmaItem[] | undefined = json?.response?.body?.items?.item;
  if (!items?.length) {
    return NextResponse.json({ error: '기상청 데이터가 비어있습니다.' }, { status: 502 });
  }

  const vec = items.find((i) => i.category === 'VEC')?.obsrValue;
  const wsd = items.find((i) => i.category === 'WSD')?.obsrValue;
  const t1h = items.find((i) => i.category === 'T1H')?.obsrValue;

  if (vec === undefined || wsd === undefined) {
    return NextResponse.json({ error: '풍향·풍속 값이 응답에 없습니다.' }, { status: 502 });
  }

  return NextResponse.json({
    wind_direction_deg: Number(vec),
    wind_speed_ms: Number(wsd),
    temperature_c: t1h !== undefined ? Number(t1h) : undefined,
    observed_at: `${baseDate} ${baseTime}`,
    source: 'kma',
  });
}
