// 全年活動總表。你只需要維護這份清單,把全年活動都填進來,
// 首頁「近期活動」區塊會自動判斷今天日期,只顯示還沒過去的活動(依日期排序)。

export type TempleEvent = {
  date: string; // 開始日期,格式 YYYY-MM-DD
  endDate?: string; // 若為連續多天的活動,填結束日期;單日活動可省略
  title: { vi: string; zh: string };
  highlight?: boolean; // 想特別標示的重要活動(例如佛誕節)設為 true
};

export const events: TempleEvent[] = [
  { date: "2026-01-04", title: { vi: "Vía Phật A Di Đà", zh: "彌陀聖誕" } },
  { date: "2026-01-25", title: { vi: "Vía Phật Thích Ca Thành Đạo", zh: "釋迦佛成道紀念日" } },
  { date: "2026-02-06", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-02-16", endDate: "2026-02-21", title: { vi: "Tết Nguyên Đán / Vía Phật Di Lặc", zh: "農曆春節期間 / 彌勒佛聖誕" } },
  { date: "2026-03-01", title: { vi: "Cúng Rằm Tháng Giêng Và Huý Kỵ Chùa Kim Cang", zh: "上元節以及金剛寺紀念日" } },
  { date: "2026-03-07", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-03-19", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-03-20", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-03-21", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-03-22", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-04-05", title: { vi: "Vía Bồ Tát Quán Thế Âm / Khoá tu", zh: "觀音菩薩聖誕 / 每月共修日" } },
  { date: "2026-04-19", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-04-26", title: { vi: "Khoá tu định kỳ hàng tháng", zh: "每月共修日" } },
  { date: "2026-05-03", title: { vi: "Vía Bồ Tát Chuẩn Đề", zh: "準提菩薩聖誕" } },
  { date: "2026-05-31", title: { vi: "Lễ Phật Đản", zh: "佛誕節" }, highlight: true },
  { date: "2026-06-21", title: { vi: "Tết Đoan Ngọ", zh: "端午節" } },
  { date: "2026-07-05", title: { vi: "Khoá Tu", zh: "薰修" } },
  { date: "2026-07-19", title: { vi: "Khoá Tu", zh: "薰修" } },
  { date: "2026-08-02", title: { vi: "Khoá Tu", zh: "薰修" } },
  { date: "2026-08-16", title: { vi: "Lễ Vu Lan Báo Hiếu", zh: "盂蘭盆" }, highlight: true },
  { date: "2026-09-06", title: { vi: "Vía Bồ Tát Địa Tạng", zh: "地藏菩薩聖誕" } },
  { date: "2026-09-27", title: { vi: "Tết Trung Thu", zh: "中秋節" } },
  { date: "2026-10-11", title: { vi: "Khoá Tu", zh: "薰修" } },
  { date: "2026-10-25", title: { vi: "Vía Bồ Tát Quán Thế Âm", zh: "觀音菩薩聖誕" } },
  { date: "2026-11-08", title: { vi: "Vía Phật Dược Sư", zh: "藥師佛聖誕" } },
  { date: "2026-11-22", title: { vi: "Lễ Hạ Nguyên", zh: "下元節" } },
  { date: "2026-12-13", title: { vi: "Vía Phật A Di Đà", zh: "彌陀聖誕" } },
  { date: "2026-12-27", title: { vi: "Khoá Tu", zh: "薰修" } },
];
