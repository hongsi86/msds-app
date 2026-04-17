import { searchChemicals } from "@/lib/chemicals-data";
import type { Chemical } from "@/lib/types";

// GET /api/search?q=황산
// 응답: { results: Chemical[], total: number }
export async function GET(request: Request): Promise<Response> {
  // Route Handler에서 searchParams는 new URL(request.url)로 동기 접근
  // (async searchParams는 page.tsx / layout.tsx props에만 해당)
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  // q 파라미터가 없거나 2글자 미만이면 400
  if (!q || q.trim().length < 2) {
    return Response.json(
      {
        error: "검색어를 2글자 이상 입력하세요.",
        code: "QUERY_TOO_SHORT",
      },
      { status: 400 }
    );
  }

  const query = q.trim();

  try {
    const results: Chemical[] = searchChemicals(query);

    return Response.json(
      {
        results,
        total: results.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/search] 검색 중 오류 발생:", err);
    return Response.json(
      {
        error: "검색 처리 중 서버 오류가 발생했습니다.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
