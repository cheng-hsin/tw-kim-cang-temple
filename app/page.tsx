import { LanguageProvider } from "./components/LanguageContext";
import DemoBanner from "./components/DemoBanner";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import LotusDivider from "./components/LotusDivider";
import About from "./components/About";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";

// 首頁有些照片(背景照片、活動輪播、相簿)是後台上傳後直接讀檔案系統顯示的,
// 需要每次請求都重新檢查檔案是否存在,所以這裡不用靜態預先產生的頁面。
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <LanguageProvider>
      <DemoBanner />
      <Nav />
      <Hero />
      <LotusDivider />
      <About />
      <Events />
      <Gallery />
      <FAQ />
      <Contact />
    </LanguageProvider>
  );
}
