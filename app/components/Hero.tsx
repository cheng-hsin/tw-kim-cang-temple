import { T } from "./LanguageContext";
import { content } from "../data/content";
import { resolveSlotImage } from "../lib/imageSlots";

export default function Hero() {
  const { hero } = content;
  const backgroundImage = resolveSlotImage("hero");
  const hasPhoto = Boolean(backgroundImage);

  return (
    <header
      className={`relative overflow-hidden px-6 pb-24 pt-16 text-center ${
        hasPhoto ? "" : "bg-gradient-to-b from-ivory to-[#EDE3CE]"
      }`}
    >
      {hasPhoto ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/55 via-maroon-deep/45 to-maroon-deep/65" />
        </>
      ) : (
        <svg
          className="pointer-events-none absolute left-0 top-0 w-full opacity-50"
          viewBox="0 0 1000 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0 140 Q100 60 200 130 Q280 80 340 130 Q420 40 500 130 Q580 40 660 130 Q720 80 800 130 Q900 60 1000 140"
            fill="none"
            stroke="#C69214"
            strokeWidth="2"
          />
        </svg>
      )}

      <div className="relative mx-auto max-w-2xl">
        <div
          className={`mb-4 text-[13px] font-bold tracking-[2px] ${
            hasPhoto ? "text-gold-light" : "text-jade"
          }`}
        >
          <T vi={hero.eyebrow.vi} zh={hero.eyebrow.zh} />
        </div>

        <h1
          className={`font-display text-[clamp(34px,6vw,58px)] font-black leading-tight ${
            hasPhoto ? "text-ivory" : "text-maroon"
          }`}
        >
          <T vi={hero.name.vi} zh={hero.name.zh} />
        </h1>

        <div
          className={`mt-1.5 text-[clamp(20px,3vw,28px)] font-medium tracking-[4px] ${
            hasPhoto ? "text-ivory/80" : "text-ink-soft"
          }`}
        >
          <T vi={hero.name.zh} zh={hero.name.vi} />
        </div>

        <p
          className={`mx-auto mt-5 max-w-lg text-[17px] ${
            hasPhoto ? "text-ivory/90" : "text-ink-soft"
          }`}
        >
          <T vi={hero.tagline.vi} zh={hero.tagline.zh} />
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <a
            href="#lien-he"
            className={`rounded-full px-6 py-3 text-sm font-bold transition ${
              hasPhoto
                ? "bg-gold text-maroon-deep hover:bg-gold-light"
                : "bg-maroon text-ivory hover:bg-maroon-deep"
            }`}
          >
            <T vi={hero.ctaPrimary.vi} zh={hero.ctaPrimary.zh} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100064023428270"
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full border-[1.5px] px-6 py-3 text-sm font-bold transition ${
              hasPhoto
                ? "border-ivory text-ivory hover:bg-ivory hover:text-maroon-deep"
                : "border-jade text-jade hover:bg-jade hover:text-ivory"
            }`}
          >
            <T vi={hero.ctaSecondary.vi} zh={hero.ctaSecondary.zh} />
          </a>
        </div>
      </div>
    </header>
  );
}
