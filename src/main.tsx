import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { applyLocale, storedLocale } from "./i18n";
import "./styles.css";

// Apply the stored locale BEFORE the first render so the app paints straight
// into the chosen language — no flash of English. `applyLocale` loads the
// compiled catalog (or flips on runtime pseudo for the dev locale); English is
// the source and needs no catalog, so it resolves instantly.
async function bootstrap() {
  // In-context review on the deployed site. neokapi-i18n stamps every string,
  // and this overlay lets a reviewer deep-link to any block — open
  // ?kapi-focus=<hash> and the matching element is scrolled to, outlined, and
  // its source/target/annotations shown (read-only, from
  // public/translations/review.json). Dev uses the plugin's own live overlay,
  // so gate this to prod.
  if (import.meta.env.PROD) {
    void import("@neokapi/i18n-react/review/hosted").then((m) => m.initKapiReviewHosted());
  }

  await applyLocale(storedLocale());

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
