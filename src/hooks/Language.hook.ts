import { useContext, useEffect, useState } from "react";
import { LangugeContext } from "../languages/Language.context";
import hiIN from "antd/lib/locale/hi_IN";
import enUS from "antd/lib/locale/en_US";
import { Locale } from "antd/lib/locale";
import { useTranslation } from "react-i18next";
import CFG from "../config/config.json";
import { useLocalStorage } from "./BrowserStorage.hook";

const useLang = () => {
  const [antdLangProvider, setAntdLangProvider] = useState<Locale>(enUS);
  const { lang, changeLang } = useContext(LangugeContext);
  const { i18n } = useTranslation();

  /* Localstorage language value & handlers */
  const [Llang, LsetLang] = useLocalStorage<string>("lang", CFG.default_lang);

  //in applifecycle, store the previous selected language is browser storage
  // in app init, set that language or init new one
  useEffect(() => {
    const initialLang = (Llang) ? Llang : CFG.default_lang;
    changeLang(initialLang as string); // eslint-disable-next-line
  }, []);

  // maintaining language states for antd and react
  // configProvider for antd language, it changes the default inbuilt languge in antd,
  //   ex: pagination text in antd pagination component

  useEffect(() => {
    if (lang) {
      switch (lang) {
        case "en-US":
          setAntdLangProvider(enUS);
          break;
        case "hi-IN":
          setAntdLangProvider(hiIN);
          break;
        default:
          console.info("language not yet implemented");
      }
      if (i18n.changeLanguage) {
        i18n.changeLanguage(lang);
      }
      if (Llang !== lang) {
        LsetLang(lang);
      }
    }
  }, [lang, i18n, Llang, LsetLang]);

  return { lang, changeLang, antdLangProvider };
};

export { useLang };
