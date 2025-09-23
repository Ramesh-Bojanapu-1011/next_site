import { ThemeProvider } from "@/components/theme/ThemeProvider";
import i18n from "@/i18n";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [langReady, setLangReady] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("selectedLanguage");
      if (savedLang === "English" && i18n.language !== "en")
        i18n.changeLanguage("en");
      else if (savedLang === "Arabic" && i18n.language !== "ar")
        i18n.changeLanguage("ar");
      else if (savedLang === "Hebrew" && i18n.language !== "he")
        i18n.changeLanguage("he");
      setLangReady(true);
    }
  }, []);
  if (!langReady) return null;
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
