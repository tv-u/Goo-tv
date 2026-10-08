import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LOCALE,
  getLocale,
  getTmdbLocale,
  SUPPORTED_LOCALES,
  type LocaleCode,
} from './locales';
import { resources } from './resources';

const STORAGE_KEY = 'goo_tv_locale';

function detectInitialLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return getLocale(saved);
  } catch {}

  const browser = navigator.language || 'en';
  return getLocale(browser);
}

const initialLocale = detectInitialLocale();

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLocale,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export function setAppLocale(locale: string) {
  const normalized = getLocale(locale);

  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch {}

  document.documentElement.lang = normalized;
  document.documentElement.dir =
    ['ar', 'fa', 'he', 'ur'].includes(normalized) ? 'rtl' : 'ltr';

  void i18n.changeLanguage(normalized);

  window.dispatchEvent(
    new CustomEvent('goo-tv-language-change', {
      detail: {
        locale: normalized,
        tmdbLocale: getTmdbLocale(normalized),
      },
    })
  );

  return normalized;
}

export function getAppLocale(): LocaleCode {
  return getLocale(i18n.language);
}

export { i18n, SUPPORTED_LOCALES, getTmdbLocale };
export default i18n;
