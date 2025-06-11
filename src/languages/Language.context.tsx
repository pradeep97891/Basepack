import { createContext, FC, ReactNode, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18 from "./i18";
import CFG from "../config/config.json";

export const LangugeContext = createContext({
  lang: CFG.default_lang,
  changeLang: (lang: string) => {},
});

interface ChildInterface {
  children: ReactNode;
}

export const LanguageProvider: FC<ChildInterface> = ({ children }) => {
  const [lang, setLang] = useState<string>(CFG.default_lang);

  const changeLang = (newLang: string) => {
    if (newLang && newLang !== lang) {
      setLang(newLang);
    }
  };

  // combining all language providers
  return (
    <I18nextProvider i18n={i18}>
      <LangugeContext.Provider value={{ lang: lang, changeLang }}>
        {children}
      </LangugeContext.Provider>
    </I18nextProvider>
  );
};
