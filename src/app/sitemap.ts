import type { MetadataRoute } from 'next';

import type { Locale } from '@/i18n/locales';
import { languageAlternates, pageUrl } from '@/lib/defineMetadata';
import { getWrittenPages } from '@/lib/writtenPages';

/** Each page in each language it's written in, with its translations as hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const languagesByPath = new Map<string, Set<Locale>>();
	for (const { path, language } of await getWrittenPages()) {
		languagesByPath.set(path, (languagesByPath.get(path) ?? new Set()).add(language));
	}

	return [...languagesByPath].flatMap(([path, languageSet]) => {
		const languages = [...languageSet];
		return languages.map((locale) => ({
			url: pageUrl(locale, path),
			alternates: { languages: languageAlternates(path, languages) },
		}));
	});
}
