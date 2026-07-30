import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "../../../../lib/session";
import { deleteEbook } from "../../../../lib/ebooks";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = deleteEbook(id);
  if (!ok) {
    return NextResponse.json({ error: "找不到這本電子書" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
