import { loadTranslations, setTranslations } from "@neokapi/i18n-react/runtime";

// Locale plumbing for the neokapi-i18n runtime. Compiled per-locale catalogs
// ship as static assets at public/translations/<locale>.json (produced by
// `neokapi-i18n compile`). English is the source: it needs no catalog and never
// flashes. A missing or partial catalog is never an error — untranslated
// strings render the English source, so a language that is only partway done
// simply falls back where it is not yet covered. That is the whole point of
// the pipeline: coverage grows, it never blocks the app.

export const LOCALE_KEY = "bowmart.locale";

export const LOCALES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
  { value: "nb", label: "Norsk" },
  // The always-on keyless pipeline fills this pseudo-locale: every string is
  // expanded and accented, so truncation and layout bugs surface before a
  // translator is ever involved. A real localization QA technique — and proof
  // the pipeline is running.
  { value: "qps", label: "Pseudo (QA)" },
] as const;

export type Locale = (typeof LOCALES)[number]["value"];

export function storedLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_KEY);
    if (raw && LOCALES.some((l) => l.value === raw)) return raw as Locale;
  } catch {
    /* storage disabled */
  }
  return "en";
}

export async function applyLocale(locale: Locale): Promise<void> {
  if (locale === "en") {
    setTranslations("en", {});
    return;
  }
  try {
    await loadTranslations(locale, `${import.meta.env.BASE_URL}translations/${locale}.json`);
  } catch {
    // Catalog not present yet — keep rendering English source.
  }
}

export async function setLocale(locale: Locale): Promise<void> {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    /* best-effort */
  }
  await applyLocale(locale);
}
