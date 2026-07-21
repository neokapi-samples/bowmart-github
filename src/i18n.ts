import { loadTranslations, setTranslations } from "@neokapi/i18n-react/runtime";
import { setPseudoMode } from "@neokapi/i18n-react/runtime/pseudo";

// Locale plumbing for the neokapi-i18n runtime. Compiled per-locale catalogs
// ship as static assets at public/translations/<locale>.json (produced by
// `neokapi-i18n compile`). English is the source: it needs no catalog and never
// flashes. A missing or partial catalog is never an error — untranslated
// strings render the English source, so a language that is only partway done
// simply falls back where it is not yet covered. That is the whole point of
// the pipeline: coverage grows, it never blocks the app.

export const LOCALE_KEY = "bowmart.locale";

// English is the source language — no catalog, always available.
export const SOURCE_LOCALE = "en";

// The dev-only pseudo locale. It is NOT a translated catalog: selecting it
// flips the runtime pseudo transform on (accent + expand every string on the
// fly), so truncation and layout bugs surface before a translator is involved.
export const PSEUDO_LOCALE = "qps";

// Target locales the pipeline translates into. Which of these actually appear
// in the picker — and whether they carry an "AI" badge — is decided at runtime
// by public/ship.json (emitted by `kapi status --ship`), not hardcoded here.
export const TARGET_LOCALES = ["fr", "de", "ja", "nb"] as const;

// Every code the picker may offer: the English source, the AI/human targets,
// and the dev pseudo locale. Display labels are derived from the codes by
// Intl.DisplayNames (fr → Français, ja → 日本語); the pseudo code is labelled
// explicitly by the picker.
export const PICKER_LOCALES: string[] = [SOURCE_LOCALE, ...TARGET_LOCALES, PSEUDO_LOCALE];

export type Locale = string;

export function storedLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_KEY);
    if (raw && PICKER_LOCALES.includes(raw)) return raw;
  } catch {
    /* storage disabled */
  }
  return SOURCE_LOCALE;
}

export async function applyLocale(locale: Locale): Promise<void> {
  if (locale === PSEUDO_LOCALE) {
    // Runtime pseudo: no catalog to load. Reset to the English source and let
    // the pseudo transform accent + expand it live.
    setTranslations(SOURCE_LOCALE, {});
    setPseudoMode({});
    return;
  }
  // Any real locale turns the pseudo transform back off.
  setPseudoMode(null);
  if (locale === SOURCE_LOCALE) {
    setTranslations(SOURCE_LOCALE, {});
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
