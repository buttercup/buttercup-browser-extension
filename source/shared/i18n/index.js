import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import localesConfig from "../../../locales/config.json";

const languages = {};
Object.keys(localesConfig.languages).forEach((key, lang) => {
    languages[key] = {};
    languages[key].name = localesConfig.languages[key].name;

    localesConfig.types.forEach(type => {
        languages[key][type] = require(`../../../locales/${key}/${type}.json`);
    });
});

const resources = Object.keys(languages).reduce((accumulator, key) => {
    accumulator[key] = {};

    localesConfig.types.forEach(type => {
        accumulator[key][type] = languages[key][type];
    });

    return accumulator;
}, {});

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: localesConfig.fallbackLng,
    react: {
        wait: false,
    },
    ns: ["base"],
    defaultNS: "base",
    nsSeparator: ":",
    keySeparator: ".",
    pluralSeparator: "_",
    contextSeparator: "-",
    debug: false,
    saveMissingTo: "all",
    saveMissing: false,
    returnEmptyString: false,
});

export default i18n;
