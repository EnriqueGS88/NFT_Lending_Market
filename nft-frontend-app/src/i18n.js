import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(ChainedBackend) //This class allows us to use multiple Backends
  .use(languageDetector) //detects automatically the language in the Browser
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    preload: ["ca", "en", "es"],
    fallbackLng: "es", //If not supportedLanguage is detected, display the application in 'ca'
    debug: false,

    load: "languageOnly", //Some browsers like Chrome provide the following languages codes: 'es-ES', 'es-ARG'... We are only interested in the language
    supportedLngs: ["en", "es", "ca"],
    ns: ["translations"], //name of the files where the translations are written.
    defaultNS: "translations",

    backend: {
      //LocalStorageBackend allows us to cache the translations on the Browser
      //HttpBackend is a backend layer for i18next using Node.JS. It load translation using http
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
        },
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json", //Path where the translations are stored
        },
      ],
    },
  });

export default i18n;
