/** @jest-environment node */
// The docs name unstable_doesProxyMatch, but Next 16.4 ships only the middleware-named matcher
import { getRedirectUrl, getRewrittenUrl, isRewrite, unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';

import { config, proxy } from '@/proxy';

const origin = 'https://about.vomatt.com';
const visit = (path: string) => proxy(new NextRequest(`${origin}${path}`));

describe('proxy', () => {
	it.each([
		['/', `${origin}/en`],
		['/about', `${origin}/en/about`],
		['/english', `${origin}/en/english`],
	])('serves %s from the English pages', (path, rewritten) => {
		const response = visit(path);
		expect(isRewrite(response)).toBe(true);
		expect(getRewrittenUrl(response)).toBe(rewritten);
	});

	it.each([
		['/en', `${origin}/`],
		['/en/about', `${origin}/about`],
		['/en/about?ref=mail', `${origin}/about?ref=mail`],
	])('redirects %s permanently to its URL without the prefix', (path, target) => {
		const response = visit(path);
		expect(response.status).toBe(308);
		expect(getRedirectUrl(response)).toBe(target);
	});

	it.each(['/zh', '/zh/about'])('lets %s through as it is', (path) => {
		const response = visit(path);
		expect(isRewrite(response)).toBe(false);
		expect(getRedirectUrl(response)).toBeNull();
	});

	it.each(['/api/revalidate', '/_next/static/chunk.js', '/robots.txt', '/sitemap.xml', '/favicon.ico', '/avatars/bao.svg'])(
		'does not run for %s',
		(url) => {
			expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
		}
	);

	it.each(['/', '/about', '/en/about', '/zh'])('runs for the page %s', (url) => {
		expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
	});
});
