import { useEffect, useRef, useState } from "react";
import { useShipStatus, type PickerLocale } from "@neokapi/i18n-react/ship/react";
import { PICKER_LOCALES, PSEUDO_LOCALE } from "./i18n";

// The picker reads public/ship.json (emitted by `kapi status --ship`) at
// runtime: only SHIPPABLE locales are offered, and each unverified-but-shippable
// locale is badged "AI". `languagePickerModel` (via the useShipStatus hook)
// derives display labels from the codes with Intl.DisplayNames — fr → Français,
// ja → 日本語 — so there is no label table to maintain. The pseudo locale is the
// one code Intl cannot name, so we label it explicitly and badge it "dev".
const SHIP_URL = `${import.meta.env.BASE_URL}ship.json`;
const LABEL_OVERRIDES = { [PSEUDO_LOCALE]: "Pseudo English" } as const;

type Badge = { kind: "ai" | "dev"; text: string } | null;

// The only end-user badge is "AI" (shippable but not human-verified); a verified
// locale carries none. The pseudo locale gets a sample-side "dev" badge.
function badgeFor(entry: PickerLocale): Badge {
  if (entry.locale === PSEUDO_LOCALE) return { kind: "dev", text: "dev" };
  if (entry.badge === "ai") return { kind: "ai", text: "AI" };
  return null;
}

export function LanguagePicker({
  locale,
  onChange,
}: {
  locale: string;
  onChange: (next: string) => void;
}) {
  const model = useShipStatus(PICKER_LOCALES, SHIP_URL, { labels: LABEL_OVERRIDES });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = model.find((m) => m.locale === locale);

  return (
    <div className="lang" ref={ref} translate="no">
      <button
        type="button"
        className="langbtn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((o) => !o)}
      >
        <TranslateIcon />
        <span className="langcur">{active ? active.label : locale}</span>
      </button>
      {open && (
        <ul className="langmenu" role="menu">
          {model.map((entry) => {
            const badge = badgeFor(entry);
            return (
              <li key={entry.locale} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={entry.locale === locale}
                  className={entry.locale === locale ? "langitem active" : "langitem"}
                  onClick={() => {
                    onChange(entry.locale);
                    setOpen(false);
                  }}
                >
                  <span className="langlabel">{entry.label}</span>
                  {badge && <span className={`langbadge ${badge.kind}`}>{badge.text}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// The Docusaurus translate glyph, matching neokapi.github.io.
function TranslateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  );
}
