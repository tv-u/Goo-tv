// AUTO-GENERATED — loads real per-locale JSON from ./locales/*.json
import { SUPPORTED_LOCALES } from "./locales";

// Vite: eager import of all locale JSONs at build time
const files = import.meta.glob<Record<string, string>>("./locales/*.json", {
  eager: true,
  import: "default",
});

function load(code: string): Record<string, string> {
  const hit = files[`./locales/${code}.json`];
  if (hit) return hit;
  // English fallback
  return files[`./locales/en.json`] ?? {};
}

export const LOCALE_CODES = SUPPORTED_LOCALES.map(l => l.code);
export type LocaleCode = (typeof LOCALE_CODES)[number];

export const resources = LOCALE_CODES.reduce<
  Record<string, { translation: Record<string, string> }>
>((acc, code) => {
  acc[code] = { translation: load(code) };
  return acc;
}, {});

export default resources;
