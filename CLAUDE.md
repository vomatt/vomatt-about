# CLAUDE.md

@AGENTS.md

## Commands

```bash
npm run dev     # Dev server (Turbopack, port 3004)
npm run build   # Production build
npm run lint    # ESLint (next/core-web-vitals + simple-import-sort)
npm run test    # Jest (jsdom), tests in src/__tests__/
npx tsc --noEmit
```

## Architecture

**vomatt-about** is the marketing site at about.vomatt.com: About and the legal pages (Privacy, Terms; the cookie list is a section of the Privacy Policy, and `src/lib/movedPages.ts` redirects the old `/cookies-policy`). The app lives at vomatt.com in `vomatt-web` (sibling repo); the Sanity Studio and schemas live in `vomatt-admin`. All three share one Sanity project and dataset. Each document type has one consumer: this site owns `pGeneral`, `pHome`, `gHeader`, `gFooter`, `gAnnouncement`, `p404` and the page-builder modules; `vomatt-web` owns `pSignUp`; `settingsGeneral` and `settingsIntegration` are shared. Check vomatt-admin's schemas when a query here changes. `pGeneral` and `pHome` are localized one document per language (`language`: `en` | `zh`); a doc with no `language` is English.

Next.js 16 with Cache Components (`cacheComponents: true`). Read side in `src/sanity/{env.ts,lib/client.ts,lib/live.ts,lib/image.ts,lib/queries.ts}` on `@sanity/client` + `groq`:

```ts
import { sanityFetch } from '@/sanity/lib/live'
import { pageGeneralQuery } from '@/sanity/lib/queries'

const { data } = await sanityFetch({ query: pageGeneralQuery, params: { slug } })
```

`sanityFetch` is a `'use cache'` function: one request returns the content and its Sanity sync tags, which it tags as `sanity:<syncTag>` (or `sanity:untracked` when there are none or more than 128). In production with `SANITY_REVALIDATE_SECRET` set it refreshes hourly as a fallback to publish expiry; elsewhere every 60s. On publish, vomatt-admin's `invalidate-tags` Sanity Function POSTs `{ syncTags }` to `/api/revalidate`, which expires those tags and `sanity:untracked` with `{ expire: 0 }`.

### Languages

English and Traditional Chinese. `src/i18n/locales.ts` is the one table of locales (URL prefix, `<html lang>`/hreflang, og:locale, Intl format) with `localizedPath(locale, path)`; read it rather than branching on a locale. English has no prefix (`/about`), Chinese has `/zh` (`/zh/about`). Every page lives under `src/app/[locale]/`; `src/proxy.ts` rewrites unprefixed paths to `/en/...` and permanently redirects `/en/...` to the unprefixed URL. There's no Accept-Language redirect. Server Components read the locale with `getLocale()` (`src/i18n/server.ts`, on `next/root-params`); Client Components get it as a prop.

Page content comes from Sanity; interface strings (header, footer, language switcher, 404, "Last updated", cookie banner, the homepage's mock-poll microcopy) live in `src/i18n/messages.ts`, typed so a missing `zh` string fails type-check. When a page has no doc in the URL's language, the English doc renders in its place: its content (and the strings inside it) is marked `lang="en"` and its canonical points at the English URL. hreflang and the sitemap list only the languages a page is written in. Every query that resolves internal links takes `$locale`, so those hrefs keep the reader's language.

### Routes

- `/[slug]` renders a `pGeneral` page (`src/components/PageGeneral.tsx`): `editor` layout is Portable Text, `modules` layout is the page builder (`src/components/PageModules.tsx`). Every published slug is prerendered in both languages; `instant = false` lets an unknown slug block until it's found to be a 404 (the status is 200 for a single-segment unknown slug, as before localization). Deeper unknown paths hit `[...rest]`, which 404s inside the locale's layout.
- `/` is the homepage (`src/app/[locale]/page.tsx`, sections in `src/components/home/`, motion in `home.css` there). Its words come from `pHome` (`homeQuery`, shape in `src/components/home/content.ts`); the mock polls beside them are drawn in code and pair with Sanity's steps, features, use cases and rules by index, so those arrays have fixed lengths in the Studio. It sets `data-wide-frame`, so the `max-w-frame` utility in `global.css` widens the header, footer and main column to `max-w-page`; other pages keep `max-w-main`. Its mock polls copy vomatt-web's poll card, ballot, Seal and results, so check them when those change. `gHeader`, `gFooter`, `gAnnouncement` and `p404` are empty in Sanity, so the header, footer links (`src/components/SiteChrome.tsx`) and 404 are static. Carousel and marquee modules aren't ported (embla 6 needs React 17).
- `/about` opens with the brand mark (`src/components/BrandMark.tsx`): a copy of vomatt-web's first-load loader (`src/lib/brand/mark.ts` and the `ballot-drop` keyframes in `global.css`) dropping the ballot on a loop, so check it when vomatt-web's `src/lib/brand/mark.ts` changes.
- Links: an internal Sanity reference stays on this site in the reader's language; an external link with a relative URL (`/explore`, `/login`) is a vomatt-web route and goes to `NEXT_PUBLIC_APP_URL` (`src/components/CMSLink.tsx`).
- `/contact` is built in code (`src/app/[locale]/contact/`), not Sanity: `ContactForm` posts through the `sendContact` Server Action to vomatt-api's `POST /api/contact`, forwarding the visitor's IP like vomatt-web (`src/lib/api/client-ip.ts`); `getWrittenPages` lists it in both languages for the sitemap and language switcher.
- Cookie consent (`src/components/CookieConsent.tsx`) sets its cookie on `vomatt.com` in production so the app and this site share one answer, and renders nothing until `settingsIntegration` has an analytics ID.

## UI

Before UI work read `DESIGN.md` and `PRODUCT.md`. Both are copied from vomatt-web, so the app-only parts (sidebar, polls, ballots) don't apply here; the tokens in `src/styles/global.css` and the type rules do. Fonts: Geist and Geist Mono via `next/font`.

## Environment Variables

See `.env.example`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SITE_URL` and `NEXT_PUBLIC_APP_URL` (origins, no trailing slash), `API_URL` (vomatt-api's origin, for the contact form) and `CLIENT_IP_SECRET` (the API's value), `SANITY_REVALIDATE_SECRET` (production only).
