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
