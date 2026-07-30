import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// 電子經書清單:標題/簡介存在 JSON 檔裡,PDF / EPUB 檔案存在 public/ebooks/<id>.pdf|epub。
// 判斷「有沒有檔案」的方式跟 imageSlots.ts 一樣:直接看檔案在不在,不用另外存旗標,
// 這樣後台上傳/刪除檔案時不會跟 JSON 記錄的狀態對不上。

export type EbookMeta = {
  id: string;
  title: { vi: string; zh: string };
  description?: { vi: string; zh: string };
};

export type Ebook = EbookMeta & {
  pdf: string;
  epub: string;
};

export type EbookFileKind = "pdf" | "epub";

const EBOOKS_DIR = path.join(process.cwd(), "public", "ebooks");
const STORE_FILE = path.join(process.cwd(), "app", "data", "ebooks-store.json");

const DEFAULT_EBOOKS: EbookMeta[] = [
  {
    id: "kinh-a-di-da",
    title: { vi: "Kinh A Di Đà", zh: "阿彌陀經" },
    description: {
      vi: "Bản kinh song ngữ Việt – Hán, dùng để tụng niệm hằng ngày.",
      zh: "越漢雙語經文,適合日常課誦使用。",
    },
  },
  {
    id: "kinh-vu-lan-bao-hieu",
    title: { vi: "Kinh Vu Lan Báo Hiếu", zh: "盂蘭盆經" },
    description: {
      vi: "Kinh về công ơn cha mẹ, thường tụng vào mùa Vu Lan.",
      zh: "闡述孝道與報恩,盂蘭盆法會常用經文。",
    },
  },
  {
    id: "chu-dai-bi",
    title: { vi: "Chú Đại Bi", zh: "大悲咒" },
    description: {
      vi: "Thần chú của Bồ Tát Quán Thế Âm, kèm phiên âm Việt – Hán.",
      zh: "觀世音菩薩神咒,附越南語拼音對照。",
    },
  },
];

function readStore(): EbookMeta[] {
  if (!fs.existsSync(STORE_FILE)) {
    writeStore(DEFAULT_EBOOKS);
    return DEFAULT_EBOOKS;
  }
  try {
    return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8")) as EbookMeta[];
  } catch {
    return [];
  }
}

function writeStore(list: EbookMeta[]): void {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2));
}

function ebookFilePath(id: string, kind: EbookFileKind): string {
  return path.join(EBOOKS_DIR, `${id}.${kind}`);
}

function resolveEbookFile(id: string, kind: EbookFileKind): string {
  return fs.existsSync(ebookFilePath(id, kind)) ? `/ebooks/${id}.${kind}` : "";
}

export function listEbooks(): Ebook[] {
  return readStore().map((meta) => ({
    ...meta,
    pdf: resolveEbookFile(meta.id, "pdf"),
    epub: resolveEbookFile(meta.id, "epub"),
  }));
}

export function ebookExists(id: string): boolean {
  return readStore().some((e) => e.id === id);
}

export function createEbook(meta: {
  title: { vi: string; zh: string };
  description?: { vi: string; zh: string };
}): Ebook {
  const list = readStore();
  const entry: EbookMeta = {
    id: crypto.randomUUID(),
    title: meta.title,
    description: meta.description,
  };
  list.push(entry);
  writeStore(list);
  return { ...entry, pdf: "", epub: "" };
}

export function deleteEbook(id: string): boolean {
  const list = readStore();
  const next = list.filter((e) => e.id !== id);
  if (next.length === list.length) return false;

  writeStore(next);
  removeEbookFile(id, "pdf");
  removeEbookFile(id, "epub");
  return true;
}

export function saveEbookFile(id: string, kind: EbookFileKind, buffer: Buffer): void {
  fs.mkdirSync(EBOOKS_DIR, { recursive: true });
  fs.writeFileSync(ebookFilePath(id, kind), buffer);
}

export function removeEbookFile(id: string, kind: EbookFileKind): void {
  const file = ebookFilePath(id, kind);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

// 不能只看客戶端宣稱的 Content-Type,要看檔案實際的 magic bytes 才可靠。
export function detectEbookFileKind(buffer: Buffer): EbookFileKind | null {
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "pdf";
  }
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
  ) {
    return "epub";
  }
  return null;
}
