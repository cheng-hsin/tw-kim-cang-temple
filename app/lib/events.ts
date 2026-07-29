// 這個檔案負責「從全年活動清單裡,自動挑出接下來要顯示的近期活動」。
// 你不需要自己判斷哪些活動快到了、哪些已經過期 —— 只要在 content.ts 裡把全年
// 活動都填進去(含正確的國曆日期),這裡會自動排序、過濾掉已過期的活動。

export type Bilingual = { vi: string; zh: string };

export type EventItem = {
  // 單次活動:填正確的「國曆」日期,格式 YYYY-MM-DD
  date?: string;
  // 每週固定活動:填星期幾(0=週日 ... 6=週六),不用填 date
  recurring?: { weekday: number };
  // 如果這是農曆節日,可以額外標註農曆日期給訪客看(純顯示用,不影響排序)
  lunarLabel?: Bilingual;
  title: Bilingual;
  desc: Bilingual;
};

const WEEKDAY_LABEL: { vi: string; zh: string }[] = [
  { vi: "CN", zh: "日" },
  { vi: "T2", zh: "一" },
  { vi: "T3", zh: "二" },
  { vi: "T4", zh: "三" },
  { vi: "T5", zh: "四" },
  { vi: "T6", zh: "五" },
  { vi: "T7", zh: "六" },
];

const MONTH_LABEL_VI = (m: number) => `Tháng ${m}`;
const MONTH_LABEL_ZH = (m: number) => `${m}月`;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// 算出這個活動「下一次發生」的日期
function nextOccurrence(item: EventItem): Date {
  if (item.recurring) {
    const today = startOfToday();
    const diff = (item.recurring.weekday - today.getDay() + 7) % 7;
    const next = new Date(today);
    next.setDate(today.getDate() + diff);
    return next;
  }
  // 單次活動:直接用填好的日期
  return new Date(`${item.date}T00:00:00`);
}

export type ResolvedEvent = EventItem & {
  nextDate: Date;
  badgeTop: Bilingual; // 卡片左邊日期方塊的大字(日期或星期)
  badgeBottom: Bilingual; // 小字(月份或"每週")
};

// 主要函式:傳入全年活動清單,回傳「接下來要顯示的近期活動」,已排序、已過濾過期
export function getUpcomingEvents(
  items: EventItem[],
  limit: number = 4
): ResolvedEvent[] {
  const today = startOfToday();

  return items
    .map((item) => ({ item, nextDate: nextOccurrence(item) }))
    // 單次活動如果日期已經過了,就不顯示;每週活動一定會有下一次,永遠保留
    .filter(({ item, nextDate }) => item.recurring || nextDate >= today)
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, limit)
    .map(({ item, nextDate }) => {
      if (item.recurring) {
        return {
          ...item,
          nextDate,
          badgeTop: WEEKDAY_LABEL[item.recurring.weekday],
          badgeBottom: { vi: "Hàng tuần", zh: "每週" },
        };
      }
      const month = nextDate.getMonth() + 1;
      return {
        ...item,
        nextDate,
        badgeTop: { vi: String(nextDate.getDate()), zh: String(nextDate.getDate()) },
        badgeBottom: item.lunarLabel ?? {
          vi: MONTH_LABEL_VI(month),
          zh: MONTH_LABEL_ZH(month),
        },
      };
    });
}
