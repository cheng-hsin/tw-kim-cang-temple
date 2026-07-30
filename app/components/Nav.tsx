"use client";

import Link from "next/link";
import { useLang, T } from "./LanguageContext";
import { content } from "../data/content";

export default function Nav() {
  const { lang, toggle } = useLang();
  return (
    <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-5">
      <Link href="/" className="font-display text-lg font-bold text-maroon">
        {content.brand.vi} <span className="opacity-40">·</span> {content.brand.zh}
      </Link>

      <div className="flex items-center gap-3.5 sm:gap-5">
        <Link
          href="/#le-hoi"
          className="text-[13px] font-medium text-ink-soft transition hover:text-maroon sm:text-sm"
        >
          <T vi="Hoạt động" zh="近期活動" />
        </Link>
        <Link
          href="/#hinh-anh"
          className="text-[13px] font-medium text-ink-soft transition hover:text-maroon sm:text-sm"
        >
          <T vi="Hình ảnh" zh="相簿" />
        </Link>
        <Link
          href="/ebooks"
          className="text-[13px] font-medium text-ink-soft transition hover:text-maroon sm:text-sm"
        >
          <T vi="Kinh sách điện tử" zh="電子書專區" />
        </Link>
        <Link
          href="/#lien-he"
          className="text-[13px] font-medium text-ink-soft transition hover:text-maroon sm:text-sm"
        >
          <T vi="Liên hệ" zh="參拜資訊" />
        </Link>
        <button
          onClick={toggle}
          aria-pressed={lang === "zh"}
          className="rounded-full border-[1.5px] border-maroon px-3.5 py-1.5 text-[13px] font-medium text-maroon transition hover:bg-maroon hover:text-ivory sm:px-4 sm:text-sm"
        >
          中文 / VI
        </button>
      </div>
    </nav>
  );
}
