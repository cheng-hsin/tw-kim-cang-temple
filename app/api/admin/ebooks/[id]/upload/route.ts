import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "../../../../../lib/session";
import {
  detectEbookFileKind,
  ebookExists,
  removeEbookFile,
  saveEbookFile,
  type EbookFileKind,
} from "../../../../../lib/ebooks";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 30 * 1024 * 1024;

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!ebookExists(id)) {
    return NextResponse.json({ error: "找不到這本電子書" }, { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "沒有收到檔案" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "檔案太大,請小於 30MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detectEbookFileKind(buffer);
  if (!kind) {
    return NextResponse.json({ error: "只接受 PDF 或 EPUB 檔案" }, { status: 400 });
  }

  const saved = await saveEbookFile(id, kind, buffer);
  if (!saved) {
    return NextResponse.json(
      { error: "上傳失敗:伺服器檔案系統無法寫入,且未設定 GITHUB_TOKEN 備份,請聯絡管理員設定" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, kind });
}

export async function DELETE(request: NextRequest, context: Context) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!ebookExists(id)) {
    return NextResponse.json({ error: "找不到這本電子書" }, { status: 404 });
  }

  const kind = request.nextUrl.searchParams.get("kind") as EbookFileKind | null;
  if (kind !== "pdf" && kind !== "epub") {
    return NextResponse.json({ error: "不明的檔案類型" }, { status: 400 });
  }

  await removeEbookFile(id, kind);
  return NextResponse.json({ ok: true });
}
