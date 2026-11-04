import defineMetadata from '@/lib/defineMetadata';

jest.mock('@/sanity/lib/image', () => ({ buildShareImageUrl: () => 'https://cdn.sanity.io/share.png' }));

const site = 'https://about.vomatt.com';

describe('defineMetadata', () => {
	const original = process.env.SITE_URL;
	beforeAll(() => {
		process.env.SITE_URL = site;
	});
	afterAll(() => {
		process.env.SITE_URL = original;
	});

	it('points a translated page at itself and lists every translation', () => {
		const metadata = defineMetadata({
			data: { title: '關於', language: 'zh', translations: ['en', 'zh'] },
			path: '/about',
		});
		expect(metadata.alternates).toEqual({
			canonical: `${site}/zh/about`,
			languages: { en: `${site}/about`, 'zh-TW': `${site}/zh/about`, 'x-default': `${site}/about` },
		});
		expect(metadata.openGraph).toMatchObject({ url: `${site}/zh/about`, locale: 'zh_TW' });
	});

	it('points a page shown in its English fallback at the English original', () => {
		const metadata = defineMetadata({
			data: { title: 'About', language: 'en', translations: ['en'] },
			path: '/about',
		});
		expect(metadata.alternates).toEqual({
			canonical: `${site}/about`,
			languages: { en: `${site}/about`, 'x-default': `${site}/about` },
		});
		expect(metadata.openGraph).toMatchObject({ url: `${site}/about`, locale: 'en_US' });
	});

	it('gives the homepage its Sanity title on its own, falling back to the site title', () => {
		expect(
			defineMetadata({
				data: { language: 'zh', translations: ['en', 'zh'], sharing: { metaTitle: 'vomatt：密封投票', siteTitle: 'vomatt' } },
				path: '/',
			})
		).toMatchObject({ title: { absolute: 'vomatt：密封投票' }, alternates: { canonical: `${site}/zh` } });
		expect(
			defineMetadata({ data: { language: 'en', translations: ['en'], sharing: { siteTitle: 'vomatt' } }, path: '/' })
		).toMatchObject({ title: { absolute: 'vomatt' }, alternates: { canonical: `${site}/` } });
	});

	it('keeps the site’s share image when the page has none of its own', () => {
		const images = [{ url: 'https://cdn.sanity.io/site.png' }];
		const metadata = defineMetadata({
			data: { language: 'en', translations: ['en'] },
			path: '/about',
			parentOpenGraph: { images, siteName: 'vomatt' } as never,
		});
		expect(metadata.openGraph).toMatchObject({ images, siteName: 'vomatt' });
	});
});
