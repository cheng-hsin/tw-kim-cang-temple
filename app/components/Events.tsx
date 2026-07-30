import Image from "next/image";
import { T } from "./LanguageContext";
import { content } from "../data/content";
import { resolveSlotImage } from "../lib/imageSlots";
import EventCarousel from "./EventCarousel";

export default function Events() {
  const { events } = content;
  const calendarImage = resolveSlotImage("calendar");
  const slides = events.carousel.map((slide, i) => ({
    ...slide,
    image: resolveSlotImage(`carousel-${i + 1}`),
  }));

  return (
    <section id="le-hoi" className="mx-auto max-w-4xl px-6 pb-16">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold">
        <T vi={events.label.vi} zh={events.label.zh} />
      </div>
      <h2 className="mb-2 font-display text-[clamp(24px,3.5vw,34px)] font-bold text-maroon">
        <T vi={events.title.vi} zh={events.title.zh} />
      </h2>
      <p className="mb-6 text-sm text-ink-soft">
        <T vi={events.intro.vi} zh={events.intro.zh} />
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {calendarImage ? (
          <a
            href={calendarImage}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mx-auto aspect-[3/4] w-full max-w-md cursor-zoom-in overflow-hidden rounded-2xl border border-[#E3D8BF] bg-white"
          >
            <Image
              src={calendarImage}
              alt={`${events.title.vi} / ${events.title.zh}`}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-contain transition group-hover:scale-[1.03]"
            />
          </a>
        ) : (
          <div className="mx-auto flex aspect-[3/4] w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-maroon to-maroon-deep p-6 text-center text-sm font-medium text-ivory">
            <T vi={events.comingSoon.vi} zh={events.comingSoon.zh} />
          </div>
        )}

        <EventCarousel slides={slides} />
      </div>
    </section>
  );
}
