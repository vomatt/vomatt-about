/**
 * The site's languages. Every locale-dependent behavior (URL prefix, `<html lang>`, hreflang,
 * og:locale, date and number formats) reads this table. Matches vomatt-web's en + zh.
 */
export const LOCALES = {
	en: { label: 'English', prefix: '', htmlLang: 'en', ogLocale: 'en_US', intl: 'en-US' },
	zh: { label: '繁體中文', prefix: '/zh', htmlLang: 'zh-TW', ogLocale: 'zh_TW', intl: 'zh-TW' },
} as const;

export type Locale = keyof typeof LOCALES;

/** Served without a prefix; also the language a page falls back to when it has no translation. */
export const DEFAULT_LOCALE: Locale = 'en';

export const locales = Object.keys(LOCALES) as Locale[];

export const isLocale = (value: string): value is Locale => Object.hasOwn(LOCALES, value);

/** `path` ('/' or '/about') as a URL in `locale`: '/zh/about', '/about', '/zh', '/'. */
export function localizedPath(locale: Locale, path: string) {
	const rest = path === '/' ? '' : path;
	return `${LOCALES[locale].prefix}${rest}` || '/';
}

/** Splits a pathname into its locale prefix (null when it has none) and the path after it. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
	const [, first = '', ...rest] = pathname.split('/');
	if (!isLocale(first)) return { locale: null, path: pathname };
	return { locale: first, path: `/${rest.join('/')}` };
}
