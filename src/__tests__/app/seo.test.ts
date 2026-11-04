import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

jest.mock('@/sanity/lib/live', () => ({
	sanityFetch: jest.fn().mockResolvedValue({
		data: [
			{ path: '/', language: 'en' },
			{ path: '/', language: 'zh' },
			// A second English homepage: still one entry
			{ path: '/', language: 'en' },
			{ path: '/about', language: 'en' },
			{ path: '/about', language: 'zh' },
			{ path: '/privacy-policy', language: 'en' },
		],
	}),
}));

const site = 'https://about.vomatt.com';

describe('robots and sitemap', () => {
	const original = process.env.SITE_URL;
	beforeAll(() => {
		process.env.SITE_URL = site;
	});
	afterAll(() => {
		process.env.SITE_URL = original;
	});

	it('lists each page in every language it is written in', async () => {
		expect((await sitemap()).map(({ url }) => url)).toEqual([
			`${site}/`,
			`${site}/zh`,
			`${site}/about`,
			`${site}/zh/about`,
			`${site}/privacy-policy`,
		]);
	});

	it('gives each page its translations as hreflang alternates', async () => {
		const entries = await sitemap();
		const about = entries.find(({ url }) => url === `${site}/zh/about`);
		expect(about?.alternates?.languages).toEqual({
			en: `${site}/about`,
			'zh-TW': `${site}/zh/about`,
			'x-default': `${site}/about`,
		});
		const privacy = entries.find(({ url }) => url === `${site}/privacy-policy`);
		expect(privacy?.alternates?.languages).toEqual({ en: `${site}/privacy-policy`, 'x-default': `${site}/privacy-policy` });
	});

	it('points crawlers at the sitemap and keeps them out of the API', () => {
		expect(robots()).toEqual({
			rules: { userAgent: '*', allow: '/', disallow: '/api/' },
			sitemap: `${site}/sitemap.xml`,
		});
	});
});
