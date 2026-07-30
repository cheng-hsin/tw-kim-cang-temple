import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { commitFileBestEffort, deleteFileBestEffort } from "./github";

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
const STORE_REPO_PATH = "app/data/ebooks-store.json";

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

// 正式站(例如 Vercel)執行階段的檔案系統是唯讀的,寫入一定會丟例外;
// 本機開發時檔案系統可以寫,所以這裡失敗只印 log、不往外丟,讓呼叫端改用 GitHub 備份當作真正的持久化。
function tryMkdirLocal(dir: string): void {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`[ebooks] 建立本機資料夾失敗(正式站唯讀檔案系統下是正常現象):`, err);
  }
}

function tryWriteLocal(filePath: string, buffer: Buffer): boolean {
  try {
    fs.writeFileSync(filePath, buffer);
    return true;
  } catch (err) {
    console.error(`[ebooks] 寫入本機檔案失敗(正式站唯讀檔案系統下是正常現象):`, err);
    return false;
  }
}

function tryUnlinkLocal(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`[ebooks] 刪除本機檔案失敗(正式站唯讀檔案系統下是正常現象):`, err);
  }
}

function writeStore(list: EbookMeta[]): void {
  const json = JSON.stringify(list, null, 2);
  tryMkdirLocal(path.dirname(STORE_FILE));
  tryWriteLocal(STORE_FILE, Buffer.from(json));
  // 清單本身也備份到 GitHub,不然重新部署後新增/刪除的電子書紀錄會消失,
  // 就算 PDF/EPUB 檔案本身有備份也對不到。不等它完成,失敗只印 log。
  void commitFileBestEffort(STORE_REPO_PATH, Buffer.from(json), "更新電子書清單");
}

function ebookFilePath(id: string, kind: EbookFileKind): string {
  return path.join(EBOOKS_DIR, `${id}.${kind}`);
}

function ebookRepoPath(id: string, kind: EbookFileKind): string {
  return `public/ebooks/${id}.${kind}`;
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
  void removeEbookFile(id, "pdf");
  void removeEbookFile(id, "epub");
  return true;
}

// 回傳值:只要本機寫入或 GitHub 備份「其中一個」成功就算真的存下來了;兩個都失敗代表上傳沒有留下任何痕跡。
export async function saveEbookFile(
  id: string,
  kind: EbookFileKind,
  buffer: Buffer
): Promise<boolean> {
  tryMkdirLocal(EBOOKS_DIR);
  const localOk = tryWriteLocal(ebookFilePath(id, kind), buffer);
  const githubOk = await commitFileBestEffort(
    ebookRepoPath(id, kind),
    buffer,
    `上傳電子書檔案:${id}.${kind}`
  );
  return localOk || githubOk;
}

export async function removeEbookFile(id: string, kind: EbookFileKind): Promise<void> {
  const file = ebookFilePath(id, kind);
  if (fs.existsSync(file)) {
    tryUnlinkLocal(file);
  }
  await deleteFileBestEffort(ebookRepoPath(id, kind), `刪除電子書檔案:${id}.${kind}`);
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
