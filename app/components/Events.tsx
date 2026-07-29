"use client";

import { useEffect, useMemo, useState } from "react";
import { T } from "./LanguageContext";
import { events, TempleEvent } from "../data/events";
import { content } from "../data/content";

const WEEKDAY = {
  vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  zh: ["日", "一", "二", "三", "四", "五", "六"],
};

const MONTH_NAME = {
  vi: (m: number) => `Tháng ${m}`,
  zh: (m: number) => `${m}月`,
};

function formatDate(iso: string, lang: "vi" | "zh") {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return lang === "vi" ? `${day}/${month}` : `${month}月${day}日`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// 找出某一天有哪些活動(含跨天活動,例如連續好幾天的春節期間)
function eventsOnDate(iso: string) {
  return events.filter((e) => iso >= e.date && iso <= (e.endDate ?? e.date));
}

export default function Events() {
  const [today, setToday] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    []
  );

  const years = useMemo(() => {
    const set = new Set<number>();
    events.forEach((e) => {
      set.add(Number(e.date.slice(0, 4)));
      if (e.endDate) set.add(Number(e.endDate.slice(0, 4)));
    });
    return Array.from(set).sort();
  }, []);

  if (!today) return null;

  const upcoming = sorted.filter((e) => (e.endDate ?? e.date) >= today).slice(0, 5);
  const selectedEvents = selectedDate ? eventsOnDate(selectedDate) : [];

  return (
    <section id="le-hoi" className="mx-auto max-w-4xl px-6 pb-16">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold">
        <T vi={content.events.label.vi} zh={content.events.label.zh} />
      </div>
      <h2 className="mb-6 font-display text-[clamp(24px,3.5vw,34px)] font-bold text-maroon">
        <T vi={content.events.title.vi} zh={content.events.title.zh} />
      </h2>

      {!showCalendar ? (
        <div className="flex flex-col gap-3.5">
          {upcoming.map((e, i) => (
            <div
              key={i}
              className={`flex items-center gap-5 rounded-2xl border px-5.5 py-4.5 ${
                e.highlight ? "border-gold bg-gold/10" : "border-[#E3D8BF] bg-white"
              }`}
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-maroon px-1 text-center font-display text-ivory">
                <span className="text-sm font-bold leading-tight">
                  <T vi={formatDate(e.date, "vi")} zh={formatDate(e.date, "zh")} />
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">
                  <T vi={e.title.vi} zh={e.title.zh} />
                </h3>
                {e.endDate && (
                  <p className="mt-0.5 text-xs text-ink-soft">
                    <T
                      vi={`đến ${formatDate(e.endDate, "vi")}`}
                      zh={`至 ${formatDate(e.endDate, "zh")}`}
                    />
                  </p>
                )}
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-ink-soft">
              <T vi="Chưa có hoạt động sắp tới được cập nhật." zh="目前尚無近期活動更新。" />
            </p>
          )}
        </div>
      ) : (
        <div>
          {years.map((year) => (
            <div key={year} className="mb-10">
              <div className="mb-4 font-display text-lg font-bold text-maroon">{year}</div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MonthCalendar
                    key={month}
                    year={year}
                    month={month}
                    today={today}
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="mt-2 rounded-2xl border border-[#E3D8BF] bg-white p-5">
            {selectedEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="text-sm font-bold text-maroon">
                  <T vi={formatDate(selectedDate!, "vi")} zh={formatDate(selectedDate!, "zh")} />
                </div>
                {selectedEvents.map((e, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold text-ink">
                      <T vi={e.title.vi} zh={e.title.zh} />
                    </p>
                    {e.endDate && (
                      <p className="text-xs text-ink-soft">
                        <T
                          vi={`đến ${formatDate(e.endDate, "vi")}`}
                          zh={`至 ${formatDate(e.endDate, "zh")}`}
                        />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">
                <T
                  vi="Chọn một ngày có đánh dấu để xem chi tiết hoạt động."
                  zh="點選有標記的日期,查看活動詳情。"
                />
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setShowCalendar((s) => !s);
          setSelectedDate(null);
        }}
        className="mt-6 text-sm font-bold text-jade underline underline-offset-4"
      >
        <T
          vi={showCalendar ? "Chỉ xem hoạt động sắp tới" : "Xem toàn bộ lịch năm"}
          zh={showCalendar ? "只看近期活動" : "查看全年行事曆"}
        />
      </button>
    </section>
  );
}

function MonthCalendar({
  year,
  month,
  today,
  selectedDate,
  onSelect,
}: {
  year: number;
  month: number;
  today: string;
  selectedDate: string | null;
  onSelect: (iso: string) => void;
}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = new Date(year, month - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-xl border border-[#E3D8BF] bg-white p-3.5">
      <div className="mb-2.5 text-center text-sm font-bold text-maroon">
        <T vi={MONTH_NAME.vi(month)} zh={MONTH_NAME.zh(month)} />
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] text-ink-soft">
        {WEEKDAY.vi.map((_, i) => (
          <div key={i} className="font-medium">
            <T vi={WEEKDAY.vi[i]} zh={WEEKDAY.zh[i]} />
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = `${year}-${pad(month)}-${pad(day)}`;
          const dayEvents = eventsOnDate(iso);
          const hasEvent = dayEvents.length > 0;
          const isHighlight = dayEvents.some((e) => e.highlight);
          const isToday = iso === today;
          const isSelected = iso === selectedDate;

          return (
            <button
              key={i}
              onClick={() => hasEvent && onSelect(iso)}
              disabled={!hasEvent}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full text-[11px] ${
                isSelected
                  ? "bg-maroon font-bold text-ivory"
                  : isToday
                  ? "border border-jade font-bold text-jade"
                  : hasEvent
                  ? "font-bold text-ink hover:bg-ivory"
                  : "text-ink-soft/50"
              }`}
            >
              {day}
              {hasEvent && !isSelected && (
                <span
                  className={`absolute bottom-0.5 h-1 w-1 rounded-full ${
                    isHighlight ? "bg-gold" : "bg-maroon"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
