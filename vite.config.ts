import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import neokapi from "@neokapi/i18n-react/vite";
import neokapiConfig from "./neokapi-i18n.config.json" with { type: "json" };

// The neokapi-i18n Vite plugin (runtime mode) instruments the natural-language
// JSX text in this app at build time — no message keys, no t() calls. You
// write English in the components; the plugin wires each string to the
// compiled per-locale catalog under public/translations/.
//
// GitHub Pages serves a project site under /<repo>/, so set VITE_BASE to
// "/<repo>/" in the Pages build (the deploy workflow does this).
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    react(),
    neokapi({ mode: "runtime", review: true, componentMap: neokapiConfig.componentMap }),
  ],
});
