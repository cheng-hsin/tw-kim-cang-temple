import type { Metadata } from "next";
import Link from "next/link";
import { LanguageProvider } from "../components/LanguageContext";
import DemoBanner from "../components/DemoBanner";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { T } from "../components/LanguageContext";
import { content } from "../data/content";
import { listEbooks } from "../lib/ebooks";

export const metadata: Metadata = {
  title: "電子書專區 Kinh sách điện tử — Chùa Kim Cang 金剛寺",
  description: "免費下載 PDF、EPUB 電子經書 / Tải về miễn phí kinh sách PDF, EPUB",
};

export const dynamic = "force-dynamic";

export default function EbooksPage() {
  const { ebooks: text } = content;
  const ebooks = listEbooks();

  return (
    <LanguageProvider>
      <DemoBanner />
      <Nav />

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-4">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold">
          <T vi={text.label.vi} zh={text.label.zh} />
        </div>
        <h1 className="mb-2 font-display text-[clamp(28px,4vw,40px)] font-bold text-maroon">
          <T vi={text.title.vi} zh={text.title.zh} />
        </h1>
        <p className="mb-8 max-w-xl text-sm text-ink-soft">
          <T vi={text.intro.vi} zh={text.intro.zh} />
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((book) => (
            <div
              key={book.id}
              className="flex flex-col rounded-2xl border border-[#E3D8BF] bg-white p-5"
            >
              <h2 className="font-display text-base font-bold text-maroon">
                <T vi={book.title.vi} zh={book.title.zh} />
              </h2>
              {book.description && (
                <p className="mt-1.5 text-sm text-ink-soft">
                  <T vi={book.description.vi} zh={book.description.zh} />
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2.5">
                {book.pdf && (
                  <a
                    href={book.pdf}
                    download
                    className="rounded-full bg-maroon px-4 py-1.5 text-xs font-bold text-ivory transition hover:bg-maroon-deep"
                  >
                    PDF
                  </a>
                )}
                {book.epub && (
                  <a
                    href={book.epub}
                    download
                    className="rounded-full border-[1.5px] border-jade px-4 py-1.5 text-xs font-bold text-jade transition hover:bg-jade hover:text-ivory"
                  >
                    EPUB
                  </a>
                )}
                {!book.pdf && !book.epub && (
                  <span className="text-xs font-medium text-ink-soft/70">
                    <T vi={text.comingSoon.vi} zh={text.comingSoon.zh} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-bold text-jade underline underline-offset-4"
        >
          <T vi={text.backHome.vi} zh={text.backHome.zh} />
        </Link>
      </section>

      <Footer />
    </LanguageProvider>
  );
}
