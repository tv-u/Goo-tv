export const SUPPORTED_LOCALES = [
  { code: 'en',  name: 'English', nativeName: 'English', tmdb: 'en-US' },
  { code: 'hi',  name: 'Hindi', nativeName: 'हिन्दी', tmdb: 'hi-IN' },
  { code: 'bn',  name: 'Bengali', nativeName: 'বাংলা', tmdb: 'bn-IN' },
  { code: 'ta',  name: 'Tamil', nativeName: 'தமிழ்', tmdb: 'ta-IN' },
  { code: 'te',  name: 'Telugu', nativeName: 'తెలుగు', tmdb: 'te-IN' },
  { code: 'mr',  name: 'Marathi', nativeName: 'मराठी', tmdb: 'mr-IN' },
  { code: 'gu',  name: 'Gujarati', nativeName: 'ગુજરાતી', tmdb: 'gu-IN' },
  { code: 'kn',  name: 'Kannada', nativeName: 'ಕನ್ನಡ', tmdb: 'kn-IN' },
  { code: 'ml',  name: 'Malayalam', nativeName: 'മലയാളം', tmdb: 'ml-IN' },
  { code: 'pa',  name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', tmdb: 'pa-IN' },

  { code: 'ur',  name: 'Urdu', nativeName: 'اردو', tmdb: 'ur-PK' },
  { code: 'ar',  name: 'Arabic', nativeName: 'العربية', tmdb: 'ar-SA' },
  { code: 'fa',  name: 'Persian', nativeName: 'فارسی', tmdb: 'fa-IR' },
  { code: 'tr',  name: 'Turkish', nativeName: 'Türkçe', tmdb: 'tr-TR' },
  { code: 'fr',  name: 'French', nativeName: 'Français', tmdb: 'fr-FR' },
  { code: 'de',  name: 'German', nativeName: 'Deutsch', tmdb: 'de-DE' },
  { code: 'es',  name: 'Spanish', nativeName: 'Español', tmdb: 'es-ES' },
  { code: 'pt',  name: 'Portuguese', nativeName: 'Português', tmdb: 'pt-BR' },
  { code: 'it',  name: 'Italian', nativeName: 'Italiano', tmdb: 'it-IT' },
  { code: 'nl',  name: 'Dutch', nativeName: 'Nederlands', tmdb: 'nl-NL' },

  { code: 'ru',  name: 'Russian', nativeName: 'Русский', tmdb: 'ru-RU' },
  { code: 'uk',  name: 'Ukrainian', nativeName: 'Українська', tmdb: 'uk-UA' },
  { code: 'pl',  name: 'Polish', nativeName: 'Polski', tmdb: 'pl-PL' },
  { code: 'cs',  name: 'Czech', nativeName: 'Čeština', tmdb: 'cs-CZ' },
  { code: 'sk',  name: 'Slovak', nativeName: 'Slovenčina', tmdb: 'sk-SK' },
  { code: 'ro',  name: 'Romanian', nativeName: 'Română', tmdb: 'ro-RO' },
  { code: 'hu',  name: 'Hungarian', nativeName: 'Magyar', tmdb: 'hu-HU' },
  { code: 'el',  name: 'Greek', nativeName: 'Ελληνικά', tmdb: 'el-GR' },
  { code: 'sv',  name: 'Swedish', nativeName: 'Svenska', tmdb: 'sv-SE' },
  { code: 'da',  name: 'Danish', nativeName: 'Dansk', tmdb: 'da-DK' },

  { code: 'no',  name: 'Norwegian', nativeName: 'Norsk', tmdb: 'no-NO' },
  { code: 'fi',  name: 'Finnish', nativeName: 'Suomi', tmdb: 'fi-FI' },
  { code: 'is',  name: 'Icelandic', nativeName: 'Íslenska', tmdb: 'is-IS' },
  { code: 'he',  name: 'Hebrew', nativeName: 'עברית', tmdb: 'he-IL' },
  { code: 'th',  name: 'Thai', nativeName: 'ไทย', tmdb: 'th-TH' },
  { code: 'vi',  name: 'Vietnamese', nativeName: 'Tiếng Việt', tmdb: 'vi-VN' },
  { code: 'id',  name: 'Indonesian', nativeName: 'Bahasa Indonesia', tmdb: 'id-ID' },
  { code: 'ms',  name: 'Malay', nativeName: 'Bahasa Melayu', tmdb: 'ms-MY' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', tmdb: 'fil-PH' },
  { code: 'ja',  name: 'Japanese', nativeName: '日本語', tmdb: 'ja-JP' },

  { code: 'ko',  name: 'Korean', nativeName: '한국어', tmdb: 'ko-KR' },
  { code: 'zh',  name: 'Chinese', nativeName: '中文', tmdb: 'zh-CN' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', tmdb: 'zh-TW' },
  { code: 'sw',  name: 'Swahili', nativeName: 'Kiswahili', tmdb: 'sw-TZ' },
  { code: 'af',  name: 'Afrikaans', nativeName: 'Afrikaans', tmdb: 'af-ZA' },
  { code: 'sq',  name: 'Albanian', nativeName: 'Shqip', tmdb: 'sq-AL' },
  { code: 'bg',  name: 'Bulgarian', nativeName: 'Български', tmdb: 'bg-BG' },
  { code: 'hr',  name: 'Croatian', nativeName: 'Hrvatski', tmdb: 'hr-HR' },
  { code: 'sr',  name: 'Serbian', nativeName: 'Српски', tmdb: 'sr-RS' },
  { code: 'sl',  name: 'Slovenian', nativeName: 'Slovenščina', tmdb: 'sl-SI' },
] as const;

export type LocaleCode = typeof SUPPORTED_LOCALES[number]['code'];

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function getLocale(code?: string | null): LocaleCode {
  if (!code) return DEFAULT_LOCALE;

  const exact = SUPPORTED_LOCALES.find(
    locale => locale.code.toLowerCase() === code.toLowerCase()
  );

  if (exact) return exact.code;

  const base = code.toLowerCase().split('-')[0];

  const match = SUPPORTED_LOCALES.find(
    locale => locale.code.toLowerCase() === base
  );

  return match?.code || DEFAULT_LOCALE;
}

export function getTmdbLocale(locale: string): string {
  return (
    SUPPORTED_LOCALES.find(item => item.code === locale)?.tmdb ||
    'en-US'
  );
}
