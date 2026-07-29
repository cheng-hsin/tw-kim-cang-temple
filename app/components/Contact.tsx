import { T } from "./LanguageContext";
import { content } from "../data/content";

export default function Contact() {
  const { contact, footer } = content;
  return (
    <>
      <section id="lien-he" className="bg-maroon px-6 py-16 text-center text-ivory">
        <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[2px] text-gold-light">
          <T vi={contact.label.vi} zh={contact.label.zh} />
        </div>
        <h2 className="mb-6 font-display text-[clamp(24px,3.5vw,34px)] font-bold text-gold-light">
          <T vi={contact.title.vi} zh={contact.title.zh} />
        </h2>

        <p className="mx-auto max-w-lg opacity-90">
          <T vi={contact.address.vi} zh={contact.address.zh} />
        </p>
        <p className="mt-2 opacity-90">
          <T vi={contact.hours.vi} zh={contact.hours.zh} />
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3.5">
          <a
            href="https://maps.app.goo.gl/ebb2EWK1CVWdWvNv9"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-maroon-deep transition hover:bg-gold-light"
          >
            <T vi={contact.mapCta.vi} zh={contact.mapCta.zh} />
          </a>
          <a
            href="#"
            className="rounded-full border-[1.5px] border-ivory px-6 py-3 text-sm font-bold text-ivory transition hover:bg-ivory hover:text-maroon"
          >
            <T vi={contact.fbCta.vi} zh={contact.fbCta.zh} />
          </a>
        </div>
      </section>

      <footer className="bg-ivory px-6 py-6 text-center text-xs text-ink-soft">
        <T vi={footer.vi} zh={footer.zh} />
      </footer>
    </>
  );
}
