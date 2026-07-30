import fs from "node:fs";
import path from "node:path";

// 「圖片欄位」清單:網站上每一張可以在後台上傳更換的照片,都有一個固定的 key。
// 上傳時不管副檔名是什麼,都會存成 public/images/<key>.<副檔名>,
// 顯示時依序找 jpg/jpeg/png/webp/gif,找到哪個就顯示哪個(找不到就顯示佔位色塊)。
// 要新增可上傳的欄位,只要在這裡加一筆,並在對應的元件用 resolveSlotImage(key) 讀取即可。

export type ImageSlot = {
  key: string;
  label: { vi: string; zh: string };
};

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "hero", label: { vi: "Ảnh nền trang chủ", zh: "首頁背景照片" } },
  { key: "calendar", label: { vi: "Ảnh lịch hoạt động", zh: "活動年曆圖片" } },
  { key: "carousel-1", label: { vi: "Băng chuyền hoạt động 1", zh: "活動輪播 1" } },
  { key: "carousel-2", label: { vi: "Băng chuyền hoạt động 2", zh: "活動輪播 2" } },
  { key: "carousel-3", label: { vi: "Băng chuyền hoạt động 3", zh: "活動輪播 3" } },
  { key: "carousel-4", label: { vi: "Băng chuyền hoạt động 4", zh: "活動輪播 4" } },
  { key: "carousel-5", label: { vi: "Băng chuyền hoạt động 5", zh: "活動輪播 5" } },
  { key: "gallery-1", label: { vi: "Ảnh thư viện 1", zh: "相簿照片 1" } },
  { key: "gallery-2", label: { vi: "Ảnh thư viện 2", zh: "相簿照片 2" } },
  { key: "gallery-3", label: { vi: "Ảnh thư viện 3", zh: "相簿照片 3" } },
  { key: "gallery-4", label: { vi: "Ảnh thư viện 4", zh: "相簿照片 4" } },
  { key: "gallery-5", label: { vi: "Ảnh thư viện 5", zh: "相簿照片 5" } },
  { key: "gallery-6", label: { vi: "Ảnh thư viện 6", zh: "相簿照片 6" } },
];

export const SLOT_KEYS = IMAGE_SLOTS.map((s) => s.key);

export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"] as const;

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

// 伺服器端專用:檢查這個欄位目前有沒有實際上傳的檔案,有的話回傳網址,沒有回傳空字串。
export function resolveSlotImage(key: string): string {
  for (const ext of ALLOWED_EXTENSIONS) {
    const file = `${key}.${ext}`;
    if (fs.existsSync(path.join(IMAGES_DIR, file))) {
      return `/images/${file}`;
    }
  }
  return "";
}

// 上傳新圖片前,先把這個欄位舊的檔案(不管副檔名)都刪掉,避免新舊檔案同時存在造成顯示錯亂。
export function clearSlotImage(key: string): void {
  for (const ext of ALLOWED_EXTENSIONS) {
    const file = path.join(IMAGES_DIR, `${key}.${ext}`);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}

export function slotFilePath(key: string, ext: string): string {
  return path.join(IMAGES_DIR, `${key}.${ext}`);
}
