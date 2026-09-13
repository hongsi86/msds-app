export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/** 깨진 JSON 본문에 500 대신 null 을 돌려준다 */
export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
