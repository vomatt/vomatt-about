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

**vomatt-about** is the marketing site at about.vomatt.com: About and the legal pages (Privacy, Terms, Cookies). The app lives at vomatt.com in `vomatt-web` (sibling repo); the Sanity Studio and schemas live in `vomatt-admin`. All three share one Sanity project and dataset. Each document type has one consumer: this site owns `pGeneral`, `pHome`, `gHeader`, `gFooter`, `gAnnouncement`, `p404` and the page-builder modules; `vomatt-web` owns `pSignUp`; `settingsGeneral` and `settingsIntegration` are shared. Check vomatt-admin's schemas when a query here changes.

Next.js 16 with Cache Components (`cacheComponents: true`). Read side in `src/sanity/{env.ts,lib/client.ts,lib/live.ts,lib/image.ts,lib/queries.ts}` on `@sanity/client` + `groq`:

```ts
import { sanityFetch } from '@/sanity/lib/live'
import { pageGeneralQuery } from '@/sanity/lib/queries'

const { data } = await sanityFetch({ query: pageGeneralQuery, params: { slug } })
```

`sanityFetch` is a `'use cache'` function: one request returns the content and its Sanity sync tags, which it tags as `sanity:<syncTag>` (or `sanity:untracked` when there are none or more than 128). In production with `SANITY_REVALIDATE_SECRET` set it refreshes hourly as a fallback to publish expiry; elsewhere every 60s.

## UI

Before UI work read `DESIGN.md` and `PRODUCT.md`. Both are copied from vomatt-web, so the app-only parts (sidebar, polls, ballots) don't apply here; the tokens in `src/styles/global.css` and the type rules do. Fonts: Geist and Geist Mono via `next/font`. Content is not localized; the site is English only.

## Environment Variables

See `.env.example`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SITE_URL` (no trailing slash).
