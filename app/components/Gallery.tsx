import Image from "next/image";
import { T } from "./LanguageContext";
import { content } from "../data/content";

export default function Gallery() {
  const { gallery } = content;
  return (
    <section id="hinh-anh" className="mx-auto max-w-4xl px-6 pb-16">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold">
        <T vi={gallery.label.vi} zh={gallery.label.zh} />
      </div>
      <h2 className="mb-6 font-display text-[clamp(24px,3.5vw,34px)] font-bold text-maroon">
        <T vi={gallery.title.vi} zh={gallery.title.zh} />
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gallery.items.map((g, i) =>
          g.src ? (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={g.src}
                alt={`${g.caption.vi} / ${g.caption.zh}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-center text-xs font-medium text-white">
                <T vi={g.caption.vi} zh={g.caption.zh} />
              </div>
            </div>
          ) : (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-xl p-3 text-center text-xs font-medium text-ivory ${g.color}`}
            >
              <T vi={g.caption.vi} zh={g.caption.zh} />
            </div>
          )
        )}
      </div>
    </section>
  );
}
