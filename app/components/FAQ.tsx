import { T } from "./LanguageContext";
import { content } from "../data/content";

export default function FAQ() {
  const { faq } = content;
  return (
    <section id="hoi-dap" className="mx-auto max-w-4xl px-6 pb-16">
      <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold">
        <T vi={faq.label.vi} zh={faq.label.zh} />
      </div>
      <h2 className="mb-6 font-display text-[clamp(24px,3.5vw,34px)] font-bold text-maroon">
        <T vi={faq.title.vi} zh={faq.title.zh} />
      </h2>

      <div>
        {faq.items.map((f, i) => (
          <div key={i} className="border-b border-[#E3D8BF] py-4.5">
            <h3 className="mb-1.5 text-[15px] font-bold text-maroon">
              <T vi={f.q.vi} zh={f.q.zh} />
            </h3>
            <p className="text-sm text-ink-soft">
              <T vi={f.a.vi} zh={f.a.zh} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
