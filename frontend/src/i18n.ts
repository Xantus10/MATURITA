/**
 * File: i18n.ts
 * Purpose: Initialization of the localization system + plugins
 */


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';


i18n.use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',

      ns: ['homepage', 'loginpage', 'components', 'userpages', 'admin'],
      defaultNS: 'components',

      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      }
    })

export default i18n;
