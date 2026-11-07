import { getOtherLanguagePaths, getWrittenPages } from '@/lib/writtenPages';
import { sanityFetch } from '@/sanity/lib/live';

jest.mock('@/sanity/lib/live', () => ({ sanityFetch: jest.fn() }));
const fetchMock = sanityFetch as jest.Mock;

describe('written pages', () => {
	beforeEach(() => {
		fetchMock.mockResolvedValue({
			data: [
				{ path: '/', language: 'en' },
				{ path: '/about', language: 'en' },
				{ path: '/about', language: 'zh' },
				{ path: '/about', language: 'fr' },
			],
		});
	});

	it('drops pages in a language the site does not serve', async () => {
		expect(await getWrittenPages()).toEqual([
			{ path: '/', language: 'en' },
			{ path: '/about', language: 'en' },
			{ path: '/about', language: 'zh' },
		]);
	});

	it('gives an English page only the Chinese paths', async () => {
		expect(await getOtherLanguagePaths('en')).toEqual({ zh: ['/about'] });
	});

	it('gives a Chinese page only the English paths', async () => {
		expect(await getOtherLanguagePaths('zh')).toEqual({ en: ['/', '/about'] });
	});

	it('offers no other language when Sanity fails', async () => {
		fetchMock.mockRejectedValue(new Error('down'));
		jest.spyOn(console, 'error').mockImplementation(() => {});
		expect(await getOtherLanguagePaths('en')).toEqual({});
	});
});
