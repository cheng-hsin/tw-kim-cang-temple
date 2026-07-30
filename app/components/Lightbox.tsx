"use client";

import { useEffect, useState, type ReactNode } from "react";
import { T } from "./LanguageContext";

// 圖片縮圖的通用「點擊放大」包裝元件:點縮圖時在當前頁面用全螢幕覆蓋層放大,
// 不開新分頁。放大層自己記著目前看到第幾張(images 陣列裡的 index),
// 跟外面輪播/清單的狀態脫鉤,所以外面的輪播繼續跑也不會把放大畫面跳掉;
// 放大時可以用左右按鈕(或鍵盤方向鍵)在 images 裡面切換,並附下載按鈕。
// 縮圖本身(children)由呼叫端傳入,可以是 Server Component 渲染出來的 <Image>。

export type LightboxImage = { src: string; alt: string };

export default function Lightbox({
  images,
  startIndex,
  className,
  children,
  onOpenChange,
}: {
  images: LightboxImage[];
  startIndex: number;
  className?: string;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(startIndex);

  function openLightbox() {
    setIndex(startIndex);
    setOpen(true);
    onOpenChange?.(true);
  }

  function close() {
    setOpen(false);
    onOpenChange?.(false);
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  const current = images[index];
  const filename = current.src.split("/").pop() || "image";
  const hasMultiple = images.length > 1;

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        className={`block w-full appearance-none border-0 bg-transparent p-0 text-left ${className ?? ""}`}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-ivory transition hover:bg-black/60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-ivory transition hover:bg-black/60 sm:left-4"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-ivory transition hover:bg-black/60 sm:right-4"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          <div
            className="flex max-h-full max-w-full flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[80vh] max-w-full rounded-xl object-contain"
            />
            <a
              href={current.src}
              download={filename}
              className="rounded-full bg-jade px-6 py-2 text-sm font-bold text-ivory transition hover:opacity-90"
            >
              <T vi="Tải ảnh xuống" zh="下載圖片" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
