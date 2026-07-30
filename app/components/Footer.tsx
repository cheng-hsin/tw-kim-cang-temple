import { T } from "./LanguageContext";
import { content } from "../data/content";

export default function Footer() {
  return (
    <footer className="bg-ivory px-6 py-6 text-center text-xs text-ink-soft">
      <T vi={content.footer.vi} zh={content.footer.zh} />
    </footer>
  );
}
