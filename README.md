# BowMart — localize a React app in GitHub Actions

A sample storefront that shows how to add localization to a React app with
[kapi](https://github.com/neokapi/neokapi) — the translations are produced in
your CI pipeline, delivered as pull requests, and published as a live
multilingual site on GitHub Pages.

**Live site:** _(enable Pages on this repo → Settings → Pages → Source: GitHub
Actions; the first push deploys it)_

## Read the git history

The three commits are the whole story:

1. **Scaffold** — a vanilla `npm create vite` React + TypeScript app.
2. **BowMart storefront** — a small store (home, products, cart, checkout,
   account) written in plain English. No localization yet.
3. **Add localization** — kapi-react, a `.kapi` recipe, and the CI pipeline.
   This is the only commit that adds i18n. Diff it to see exactly what it takes.

## How it works

You write natural English in your components — no message keys, no `t()` calls:

```tsx
<button className="cta">Browse products</button>
```

The [kapi-react](https://www.npmjs.com/package/@neokapi/kapi-react) Vite plugin
instruments those strings at build time, and its CLI extracts them into
translation catalogs. The pipeline then:

```
kapi-react extract   src/**/*.tsx   → i18n/**/*.klf              (source catalog)
kapi (in CI)         i18n/          → i18n-<lang>/                (translated)
kapi-react compile   i18n-<lang>/   → public/translations/<lang>.json
vite build           → the static site → GitHub Pages
```

A language that is only partway translated falls back to English on the live
site. Coverage grows over time; it never blocks a deploy.

## The pipeline (`.github/workflows/localize.yml`)

Three ways in, all dogfooding [`setup-kapi`](https://github.com/neokapi/setup-kapi)
+ [`kapi-action`](https://github.com/neokapi/kapi-action):

- **On a pull request** — the source gate. `kapi check` verifies the English
  copy against the brand voice *before* it is translated, and comments on the
  PR. Try adding a marketing cliché ("leverage synergy") and watch it fail.
- **Nightly / manual (pseudo)** — refreshes the pseudo-locale and opens a PR.
  Keyless, free, deterministic: every string is expanded and accented
  (`▒ Ƀŕöŵšé þŕöđüçţš ▒`), which surfaces truncation and layout bugs before a
  translator is involved. This is the always-on "watch the pipeline run" demo.
- **Manual (ai)** — translates into the real languages (French, German,
  Japanese, Norwegian) with an AI provider and opens a PR you review before
  merging. Add a `GEMINI_API_KEY` repo secret and run the workflow with
  `mode: ai`. (Any provider works — set the matching key and `KAPI_AI_PROVIDER`;
  this repo is wired for Gemini.)

The live site is rebuilt and deployed by `.github/workflows/pages.yml` on every
push to `main`.

## Run it locally

```bash
npm install
npm run dev            # the storefront in English; switch languages top-right

npm run i18n:extract   # pull strings from the React source → i18n/
npm run i18n:compile   # build the runtime catalogs the app loads
```

Producing the actual translations is the pipeline's job — see the workflow
above, or run `kapi` yourself with the [CLI](https://github.com/neokapi/neokapi).

## Use this yourself

This repo is a template — click **Use this template**, or copy the
`localize.yml` / `pages.yml` workflows and the `kapi-react` wiring into your own
Vite + React app.
