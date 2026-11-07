import type { WrittenPaths } from '@/components/LanguageSwitcher';
import { isLocale, type Locale, locales } from '@/i18n/locales';
import { sanityFetch } from '@/sanity/lib/live';
import { sitemapQuery } from '@/sanity/lib/queries';

/** Pages built in code rather than in Sanity, written in every language. */
const CODE_PAGES = ['/contact'];

/** Every published page ('/', '/about') with the language it's written in. The sitemap and the language switcher both read it. */
export async function getWrittenPages() {
	const { data } = await sanityFetch({ query: sitemapQuery });
	// A code page takes its URL ahead of a Sanity page with the same slug, so that Sanity page is never served
	const sanityPages = (
		(data ?? []) as { path: string; language: string }[]
	).filter(
		(page): page is { path: string; language: Locale } =>
			isLocale(page.language) && !CODE_PAGES.includes(page.path)
	);
	return [
		...sanityPages,
		...CODE_PAGES.flatMap((path) =>
			locales.map((language) => ({ path, language }))
		),
	];
}

/** The paths written in each language other than `locale`, for the language switcher; without Sanity it offers none. */
export function getOtherLanguagePaths(locale: Locale): Promise<WrittenPaths> {
	return getWrittenPages()
		.then((pages) => {
			const written: WrittenPaths = {};
			for (const { path, language } of pages) {
				if (language !== locale) (written[language] ??= []).push(path);
			}
			return written;
		})
		.catch((error) => {
			console.error('Failed to load page languages from Sanity', error);
			return {};
		});
}
