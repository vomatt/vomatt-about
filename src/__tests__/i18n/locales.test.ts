import { localizedPath, splitLocale } from '@/i18n/locales';

describe('localizedPath', () => {
	it.each([
		['en', '/', '/'],
		['en', '/about', '/about'],
		['zh', '/', '/zh'],
		['zh', '/about', '/zh/about'],
	] as const)('puts %s %s at %s', (locale, path, url) => {
		expect(localizedPath(locale, path)).toBe(url);
	});
});

describe('splitLocale', () => {
	it.each([
		['/zh/about', 'zh', '/about'],
		['/zh', 'zh', '/'],
		['/en/about', 'en', '/about'],
		['/about', null, '/about'],
		['/zhuyin', null, '/zhuyin'],
	])('reads %s as locale %s and path %s', (pathname, locale, path) => {
		expect(splitLocale(pathname)).toEqual({ locale, path });
	});
});
