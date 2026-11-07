import type { WrittenPaths } from '@/components/LanguageSwitcher';
import { isLocale, type Locale } from '@/i18n/locales';
import { sanityFetch } from '@/sanity/lib/live';
import { sitemapQuery } from '@/sanity/lib/queries';

/** Every published page ('/', '/about') with the language it's written in. The sitemap and the language switcher both read it. */
export async function getWrittenPages() {
	const { data } = await sanityFetch({ query: sitemapQuery });
	return ((data ?? []) as { path: string; language: string }[]).filter(
		(page): page is { path: string; language: Locale } => isLocale(page.language)
	);
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
