import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import roTranslation from "@/translations/ro.json";
import enTranslation from "@/translations/en.json";

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: "ro",
    debug: false,
    fallbackLng: "ro",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      ro: {
        translation: roTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
  });

export default i18n;
