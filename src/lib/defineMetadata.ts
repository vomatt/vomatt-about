// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
import type { Metadata, ResolvedMetadata } from 'next';

import { DEFAULT_LOCALE, isLocale, type Locale, LOCALES, localizedPath } from '@/i18n/locales';
import { buildShareImageUrl } from '@/sanity/lib/image';

type Props = {
	data: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		sharing?: any;
		title?: string;
		/** The language the doc is written in, which can be the fallback rather than the URL's. */
		language: Locale;
		/** Every language the page is written in. */
		translations?: string[];
	} | null;
	/** The page's path without a locale: '/' or '/about'. */
	path: string;
	/** The root layout's Open Graph, whose site name and share image a page without its own keeps. */
	parentOpenGraph?: ResolvedMetadata['openGraph'];
};

/** `path` ('/' or '/about') in `locale`, as an absolute URL on this site. */
export const pageUrl = (locale: Locale, path: string) => `${process.env.SITE_URL}${localizedPath(locale, path)}`;

/** hreflang URLs for a page written in `languages`; x-default is the default locale's, when there is one. */
export function languageAlternates(path: string, languages: Locale[]) {
	return Object.fromEntries([
		...languages.map((locale) => [LOCALES[locale].htmlLang, pageUrl(locale, path)]),
		...(languages.includes(DEFAULT_LOCALE) ? [['x-default', pageUrl(DEFAULT_LOCALE, path)]] : []),
	]);
}

/**
 * A page's metadata. The canonical URL is the page in the language its content is written in, so a
 * page shown in the fallback language points at the original; hreflang lists only real translations.
 */
export default function defineMetadata({ data, path, parentOpenGraph }: Props): Metadata {
	const { sharing, title, language = DEFAULT_LOCALE, translations = [] } = data || {};
	const isHomepage = path === '/';

	const metaDesc = sharing?.metaDesc || '';
	const metaTitle = sharing?.metaTitle || (isHomepage ? sharing?.siteTitle : title) || `Page not found`;
	const shareGraphic = sharing?.shareGraphic?.asset;
	const disableIndex = sharing?.disableIndex;

	return {
		// The homepage's title stands alone, without the layout's "| site name"
		title: isHomepage ? { absolute: metaTitle } : metaTitle,
		description: metaDesc,
		openGraph: {
			title: metaTitle,
			description: metaDesc,
			url: pageUrl(language, path),
			siteName: parentOpenGraph?.siteName,
			images: shareGraphic
				? [{ url: buildShareImageUrl(shareGraphic), width: 1200, height: 630 }]
				: parentOpenGraph?.images,
			videos: parentOpenGraph?.videos,
			locale: LOCALES[language].ogLocale,
			type: 'website',
		},
		alternates: {
			canonical: pageUrl(language, path),
			languages: languageAlternates(path, translations.filter(isLocale)),
		},
		robots: {
			index: !disableIndex,
			follow: !disableIndex,
			nocache: true,
		},
	};
}
