import { T } from "./LanguageContext";
import { content } from "../data/content";

export default function Hero() {
  const { hero } = content;
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-ivory to-[#EDE3CE] px-6 pb-24 pt-16 text-center">
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

      <div className="relative mx-auto max-w-2xl">
        <div className="mb-4 text-[13px] font-bold tracking-[2px] text-jade">
          <T vi={hero.eyebrow.vi} zh={hero.eyebrow.zh} />
        </div>

        <h1 className="font-display text-[clamp(34px,6vw,58px)] font-black leading-tight text-maroon">
          <T vi={hero.name.vi} zh={hero.name.zh} />
        </h1>

        <div className="mt-1.5 text-[clamp(20px,3vw,28px)] font-medium tracking-[4px] text-ink-soft">
          <T vi={hero.name.zh} zh={hero.name.vi} />
        </div>

        <p className="mx-auto mt-5 max-w-lg text-[17px] text-ink-soft">
          <T vi={hero.tagline.vi} zh={hero.tagline.zh} />
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <a
            href="#lien-he"
            className="rounded-full bg-maroon px-6 py-3 text-sm font-bold text-ivory transition hover:bg-maroon-deep"
          >
            <T vi={hero.ctaPrimary.vi} zh={hero.ctaPrimary.zh} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100064023428270"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-[1.5px] border-jade px-6 py-3 text-sm font-bold text-jade transition hover:bg-jade hover:text-ivory"
          >
            <T vi={hero.ctaSecondary.vi} zh={hero.ctaSecondary.zh} />
          </a>
        </div>
      </div>
    </header>
  );
}
