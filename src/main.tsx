import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// In-context review on the deployed site. neokapi-i18n stamps every string, and
// this overlay lets a reviewer deep-link to any block — open
// ?kapi-focus=<hash> and the matching element is scrolled to, outlined, and
// its source/target/annotations shown (read-only, from public/translations/
// review.json). Dev uses the plugin's own live overlay, so gate this to prod.
if (import.meta.env.PROD) {
  void import("@neokapi/i18n-react/review/hosted").then((m) => m.initKapiReviewHosted());
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
