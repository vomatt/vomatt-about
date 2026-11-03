import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

jest.mock('@/sanity/lib/live', () => ({
	sanityFetch: jest.fn().mockResolvedValue({ data: [{ slug: 'about' }, { slug: 'privacy-policy' }] }),
}));

describe('robots and sitemap', () => {
	const original = process.env.SITE_URL;
	beforeAll(() => {
		process.env.SITE_URL = 'https://about.vomatt.com';
	});
	afterAll(() => {
		process.env.SITE_URL = original;
	});

	it('lists the homepage and every published page', async () => {
		expect((await sitemap()).map(({ url }) => url)).toEqual([
			'https://about.vomatt.com',
			'https://about.vomatt.com/about',
			'https://about.vomatt.com/privacy-policy',
		]);
	});

	it('points crawlers at the sitemap and keeps them out of the API', () => {
		expect(robots()).toEqual({
			rules: { userAgent: '*', allow: '/', disallow: '/api/' },
			sitemap: 'https://about.vomatt.com/sitemap.xml',
		});
	});
});
