"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "vi" | "zh";

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
}>({ lang: "vi", toggle: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");
  const toggle = () => setLang((l) => (l === "vi" ? "zh" : "vi"));
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

// 小工具元件:傳入 { vi, zh } 兩個語言版本的文字,會依照目前語言自動顯示對應版本
export function T({ vi, zh }: { vi: ReactNode; zh: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "vi" ? vi : zh}</>;
}
