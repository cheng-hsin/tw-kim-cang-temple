import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "../../../lib/session";
import { createEbook, listEbooks } from "../../../lib/ebooks";

export const dynamic = "force-dynamic";

function requireAuth(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  return NextResponse.json({ ebooks: listEbooks() });
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const titleVi = String(body?.title?.vi ?? "").trim();
  const titleZh = String(body?.title?.zh ?? "").trim();
  if (!titleVi || !titleZh) {
    return NextResponse.json({ error: "請填寫中文與越南文標題" }, { status: 400 });
  }

  const descVi = String(body?.description?.vi ?? "").trim();
  const descZh = String(body?.description?.zh ?? "").trim();

  const ebook = createEbook({
    title: { vi: titleVi, zh: titleZh },
    description: descVi || descZh ? { vi: descVi, zh: descZh } : undefined,
  });

  return NextResponse.json({ ebook });
}
