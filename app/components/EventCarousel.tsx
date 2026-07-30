"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { T } from "./LanguageContext";

type Slide = {
  image: string;
  color: string;
  caption: { vi: string; zh: string };
};

export default function EventCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  function goPrev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-[#E3D8BF]">
      {slide.image ? (
        <a
          key={index}
          href={slide.image}
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute inset-0 block cursor-zoom-in"
        >
          <Image
            src={slide.image}
            alt={`${slide.caption.vi} / ${slide.caption.zh}`}
            fill
            sizes="(max-width: 640px) 100vw, 448px"
            className="object-cover transition group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8 text-center text-sm font-medium text-white">
            <T vi={slide.caption.vi} zh={slide.caption.zh} />
          </div>
        </a>
      ) : (
        <div
          key={index}
          className={`flex h-full w-full items-center justify-center p-6 text-center text-lg font-bold text-ivory ${slide.color}`}
        >
          <T vi={slide.caption.vi} zh={slide.caption.zh} />
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-ivory transition hover:bg-black/55"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-ivory transition hover:bg-black/55"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-ivory" : "w-1.5 bg-ivory/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
