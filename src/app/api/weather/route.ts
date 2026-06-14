import { NextRequest, NextResponse } from 'next/server';
import { toKmaGrid } from '@/lib/weather';

export const runtime = 'nodejs';

interface KmaItem {
  category: string;
  obsrValue: string;
  baseDate: string;
  baseTime: string;
}

function buildBaseDateTime(now: Date): { baseDate: string; baseTime: string } {
  const d = new Date(now);
  if (d.getMinutes() < 40) d.setHours(d.getHours() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  return { baseDate: `${yyyy}${mm}${dd}`, baseTime: `${hh}00` };
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.KMA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'KMA_API_KEY가 설정되지 않았습니다. .env.local에 키를 추가하세요.' },
      { status: 503 }
    );
  }

  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat, lon 쿼리 파라미터가 필요합니다.' }, { status: 400 });
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
    return NextResponse.json({ error: `기상청 API 호출 실패: ${(e as Error).message}` }, { status: 502 });
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
