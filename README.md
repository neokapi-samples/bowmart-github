# BowMart — a server-connected React localization demo (Bowrain + GitHub)

A sample storefront that shows how to localize a React app with
[Bowrain](https://bowrain.cloud), the governed localization platform. Unlike the
kapi-in-CI samples, the translations are **not** produced in this pipeline: you
push the source copy to Bowrain, which converges it (translation memory → AI →
checks) and delivers the reviewed translations back as **pull requests**. The
live multilingual site is published on GitHub Pages.

**Live site:** _(enable Pages on this repo → Settings → Pages → Source: GitHub
Actions; the first push deploys it)_

## From plain React to a Bowrain-connected, localized app

The source is a small storefront (home, products, cart, checkout, account)
written in plain English. Adding localization took neokapi-i18n, a `kapi.yaml` recipe
with a `server:` block, and connecting the recipe to a Bowrain project — no
message keys and no `t()` calls in the components. Diff the localization commit
to see exactly what it takes.

## How it works

You write natural English in your components — no message keys, no `t()` calls:

```tsx
<button className="cta">Browse products</button>
```

The [neokapi-i18n](https://www.npmjs.com/package/@neokapi/i18n-react) Vite plugin
instruments those strings at build time, and its CLI extracts them into a source
catalog. From there the flow is server-side:

```
neokapi-i18n extract   src/**/*.tsx   → i18n/src/**/*.klf        (source catalog)
kapi push            i18n/          → Bowrain               (send source to the server)
Bowrain              converges: translation memory → AI → brand & terminology checks
kapi pull  /  PR     Bowrain        → i18n/<lang>/          (reviewed translations back)
neokapi-i18n compile   i18n/<lang>/   → public/translations/<lang>.json
vite build           → the static site → GitHub Pages
```

A language that is only partway translated falls back to English on the live
site. Coverage grows over time; it never blocks a deploy.

## The Bowrain connection

The `kapi.yaml` recipe declares a `server:` block pointing at a Bowrain
project (`<server>/<workspace>/<project-id>`). Two commands drive the loop:

- **`kapi push`** — sends the source catalogs to Bowrain. The server converges
  them: it leverages the project translation memory, fills gaps with an AI
  provider, and runs brand-voice and terminology checks (the project glossary is
  a committed `l10n/termbase.klftb` — brand terms like *BowMart* are marked
  do-not-translate and stay verbatim in every locale).
- **`kapi pull`** — brings the reviewed translations back into `i18n/<lang>/`.
  On a connected repository the Bowrain **GitHub App** opens a pull request
  instead, so a human reviews the translations before they land.

Translation and governance happen on the server, not in your CI — this pipeline
only rebuilds and publishes the site.

## The pipeline (`.github/workflows/pages.yml`)

One workflow, no translation in CI: it regenerates the source catalog
(`i18n/src/**/*.klf`) from the React source, compiles the committed catalogs (source
+ any Bowrain-delivered `i18n/<lang>/`) into the runtime dictionaries the app
loads, builds with the Pages base path, and deploys to GitHub Pages.

## Run it locally

```bash
npm install
npm run dev            # the storefront in English; switch languages top-right

npm run i18n:extract   # pull strings from the React source → i18n/
npm run i18n:compile   # build the runtime catalogs the app loads
```

Producing the translations is Bowrain's job — `kapi push` to send the source,
`kapi pull` to bring the reviewed translations back. See the
[kapi CLI](https://github.com/neokapi/neokapi).

## In-context review

The deployed site embeds a read-only review overlay: append `?kapi-review` to the
URL (or click the *kapi review* pill) to highlight every translated string and
browse them by file, or `?kapi-focus=<hash>` to jump straight to one block in
context.
