import { T } from "./LanguageContext";
import { content } from "../data/content";

export default function About() {
  const { about } = content;
  return (
    <section id="gioi-thieu" className="mx-auto max-w-4xl px-6 pb-16 pt-5">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold">
        <T vi={about.label.vi} zh={about.label.zh} />
      </div>
      <h2 className="mb-6 font-display text-[clamp(24px,3.5vw,34px)] font-bold text-maroon">
        <T vi={about.title.vi} zh={about.title.zh} />
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mb-3.5 text-base text-ink-soft">
              <T vi={p.vi} zh={p.zh} />
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.facts.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#E3D8BF] bg-white p-4.5"
            >
              <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-jade">
                <T vi={f.label.vi} zh={f.label.zh} />
              </div>
              <div className="text-[15px] font-medium text-ink">
                <T vi={f.value.vi} zh={f.value.zh} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
