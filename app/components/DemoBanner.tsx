import { T } from "./LanguageContext";

export default function DemoBanner() {
  return (
    <div className="bg-maroon-deep px-4 py-2 text-center text-[13px] tracking-wide text-gold-light">
      <T
        vi="卍 Nam mô A Di Đà Phật 卍"
        zh="卍 南無阿彌陀佛 卍"
      />
    </div>
  );
}
