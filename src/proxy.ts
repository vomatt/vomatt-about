import { type NextRequest, NextResponse } from 'next/server';

import { DEFAULT_LOCALE, splitLocale } from '@/i18n/locales';

/**
 * English is served without a prefix: `/about` renders `/en/about`, and `/en/about` redirects to
 * `/about` so each page has one URL. Other locales keep their prefix (`/zh/about`).
 */
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const { locale, path } = splitLocale(pathname);

	if (locale === DEFAULT_LOCALE) {
		const url = request.nextUrl.clone();
		url.pathname = path;
		return NextResponse.redirect(url, 308);
	}
	if (locale) return NextResponse.next();

	const url = request.nextUrl.clone();
	url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
	return NextResponse.rewrite(url);
}

export const config = {
	// Pages only: not the API, Next's own files, or files with an extension (robots.txt, sitemap.xml, favicon.ico)
	matcher: ['/((?!api/|_next/|_vercel/|.*\\..*).*)'],
};
