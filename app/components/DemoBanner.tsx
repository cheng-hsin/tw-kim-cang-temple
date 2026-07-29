import { T } from "./LanguageContext";

export default function DemoBanner() {
  return (
    <div className="bg-maroon-deep px-4 py-2 text-center text-[13px] tracking-wide text-gold-light">
      <T
        vi="🔶 ĐÂY LÀ TRANG DEMO — nội dung là ví dụ, chưa phải thông tin thật"
        zh="🔶 這是示範網站 — 內容為範例,尚非真實資訊"
      />
    </div>
  );
}
