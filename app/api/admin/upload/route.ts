import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { SLOT_KEYS, clearSlotImage, slotFilePath } from "../../../lib/imageSlots";
import { COOKIE_NAME, verifySessionToken } from "../../../lib/session";

export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// 不能只看客戶端宣稱的 Content-Type(可以任意偽造),要看檔案實際的 magic bytes 才可靠。
function detectImageExt(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const form = await request.formData();
  const key = String(form.get("key") ?? "");
  const file = form.get("file");

  if (!SLOT_KEYS.includes(key)) {
    return NextResponse.json({ error: "不明的圖片欄位" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "沒有收到檔案" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "檔案太大,請小於 8MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = detectImageExt(buffer);
  if (!ext) {
    return NextResponse.json({ error: "只接受 JPG / PNG / WEBP / GIF 圖片" }, { status: 400 });
  }

  clearSlotImage(key);
  fs.writeFileSync(slotFilePath(key, ext), buffer);

  return NextResponse.json({ ok: true });
}
