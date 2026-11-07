import { locales,localizedPath } from '../i18n/locales';

/** Pages folded into another, by path. Kept out of the sitemap and slugs while Sanity still publishes them. */
export const MOVED_PAGES: Record<string, string> = {
	'/cookies-policy': '/privacy-policy',
};

/** Permanent redirects for every moved page in every language, for next.config.ts. */
export function movedPageRedirects() {
	return Object.entries(MOVED_PAGES).flatMap(([from, to]) =>
		locales.map((locale) => ({
			source: localizedPath(locale, from),
			destination: localizedPath(locale, to),
			permanent: true,
		}))
	);
}
