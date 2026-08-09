import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from '../../messages/en.json';
import hiMessages from '../../messages/hi.json';

const LanguageContext = createContext();

const messages = {
  en: enMessages,
  hi: hiMessages
};

export function LanguageProvider({ children }) {
  // Detect browser language on first visit, defaulting to 'en' unless Hindi 'hi' is detected
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('app_locale');
    if (saved && (saved === 'en' || saved === 'hi')) return saved;
    const navLang = navigator.language || navigator.userLanguage || '';
    return navLang.startsWith('hi') ? 'hi' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const switchLanguage = (newLocale) => {
    if (newLocale === 'en' || newLocale === 'hi') {
      setLocale(newLocale);
    }
  };

  // Helper translation function t("nav.dashboard") or t("dashboard.welcomeMsg", { name: "Alexander" })
  const t = (keyPath, params = {}) => {
    const keys = keyPath.split('.');
    let current = messages[locale] || messages.en;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if key missing
        let fallback = messages.en;
        for (const k of keys) {
          fallback = fallback?.[k];
        }
        current = fallback || keyPath;
        break;
      }
    }

    if (typeof current === 'string') {
      return Object.keys(params).reduce((str, paramKey) => {
        return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      }, current);
    }

    return current || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ locale, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
