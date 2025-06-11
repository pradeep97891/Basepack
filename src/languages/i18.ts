import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import CFG from '../config/config.json';

// abstracting the i18n setup and combining with antd,

i18next.use(HttpApi).init({
  lng: CFG.default_lang,
  fallbackLng: CFG.default_lang,
  load: 'currentOnly',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  react: { useSuspense: true },
});

export default i18next;
