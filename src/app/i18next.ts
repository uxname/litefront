import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// Initialize i18n with necessary plugins and configurations
i18n
  .use(Backend) // Load translations using HTTP (check /public/locales)
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Integrate i18n with react-i18next
  .init({
    react: {
      useSuspense: false, // Avoid using suspense for translation loading
    },
    fallbackLng: "en", // Default language if the user's language is not available
    debug: import.meta.env.DEV, // Enable debug mode in development
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to translation files
    },
    detection: {
      order: ["navigator", "htmlTag", "path", "subdomain"], // Language detection order
    },
  });

// Default export for i18n instance

export { default } from "i18next";
