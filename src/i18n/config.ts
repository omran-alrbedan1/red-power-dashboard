import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import arCommon from "./locales/ar/common.json"
import enCommon from "./locales/en/common.json"

import arCustomers from "./locales/ar/customers.json"
import enCustomers from "./locales/en/customers.json"

import arMaintenance from "./locales/ar/maintenance.json"
import enMaintenance from "./locales/en/maintenance.json"

import arEmployees from "./locales/ar/employees.json"
import enEmployees from "./locales/en/employees.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        common: arCommon,
        customers: arCustomers,
        maintenance: arMaintenance,
        employees: arEmployees,
      },
      en: {
        common: enCommon,
        customers: enCustomers,
        maintenance: enMaintenance,
        employees: enEmployees,
      },
    },
    fallbackLng: "ar",
    defaultNS: "common",
    ns: ["common", "customers", "maintenance", "employees"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "red-power-language",
    },
  })

// Set RTL direction on init
const setDirection = (lng: string) => {
  const dir = lng === "ar" ? "rtl" : "ltr"
  document.documentElement.dir = dir
  document.documentElement.lang = lng
}

i18n.on("languageChanged", setDirection)
setDirection(i18n.language || "ar")

export default i18n
