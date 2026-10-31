const fetchMock = jest.fn();
const cacheLifeMock = jest.fn();
const cacheTagMock = jest.fn();

jest.mock('@/sanity/lib/client', () => ({
	client: { fetch: (...args: unknown[]) => fetchMock(...args) },
}));

jest.mock('next/cache', () => ({
	cacheLife: (...args: unknown[]) => cacheLifeMock(...args),
	cacheTag: (...args: unknown[]) => cacheTagMock(...args),
}));

import { sanityFetch, UNTRACKED_TAG } from '@/sanity/lib/live';

function respond(syncTags: string[] | undefined, result: unknown) {
	fetchMock.mockResolvedValueOnce({ result, syncTags });
}

describe('sanityFetch', () => {
	const original = { ...process.env };

	beforeEach(() => {
		fetchMock.mockReset();
		cacheLifeMock.mockReset();
		cacheTagMock.mockReset();
		process.env.SANITY_REVALIDATE_SECRET = 'secret';
		process.env.VERCEL_ENV = 'production';
	});

	afterAll(() => {
		process.env = original;
	});

	it('returns the query result wrapped in { data }', async () => {
		respond(['s1:a'], { title: 'About' });

		await expect(sanityFetch({ query: '*[0]' })).resolves.toEqual({
			data: { title: 'About' },
		});
	});

	it('fetches the content and its sync tags in one request', async () => {
		respond(['s1:a'], null);

		await sanityFetch({ query: '*[slug == $slug]', params: { slug: 'about' } });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledWith(
			'*[slug == $slug]',
			{ slug: 'about' },
			{ filterResponse: false }
		);
	});

	it('tags the content with its own sync tags', async () => {
		respond(['s1:a', 's1:b'], null);

		await sanityFetch({ query: '*' });

		expect(cacheTagMock).toHaveBeenCalledWith('sanity:s1:a', 'sanity:s1:b');
	});

	it('falls back to the untracked tag when Sanity returns no sync tags', async () => {
		respond(undefined, null);

		await sanityFetch({ query: '*' });

		expect(cacheTagMock).toHaveBeenCalledWith(UNTRACKED_TAG);
	});

	it('falls back to the untracked tag when there are more sync tags than Next can store', async () => {
		respond(
			Array.from({ length: 129 }, (_, i) => `s1:${i}`),
			null
		);

		await sanityFetch({ query: '*' });

		expect(cacheTagMock).toHaveBeenCalledWith(UNTRACKED_TAG);
	});

	it('refreshes hourly in production, as a fallback to publish expiry', async () => {
		respond(['s1:a'], null);

		await sanityFetch({ query: '*' });

		expect(cacheLifeMock).toHaveBeenCalledWith('hours');
	});

	it('refreshes every 60s when no secret is set, since nothing can expire the cache', async () => {
		delete process.env.SANITY_REVALIDATE_SECRET;
		respond(['s1:a'], null);

		await sanityFetch({ query: '*' });

		expect(cacheLifeMock).toHaveBeenCalledWith({ revalidate: 60 });
	});

	it('refreshes every 60s outside production, which the Sanity Function never calls', async () => {
		process.env.VERCEL_ENV = 'preview';
		respond(['s1:a'], null);

		await sanityFetch({ query: '*' });

		expect(cacheLifeMock).toHaveBeenCalledWith({ revalidate: 60 });
	});

	it('rejects when the client fails', async () => {
		fetchMock.mockRejectedValue(new Error('network'));

		await expect(sanityFetch({ query: '*' })).rejects.toThrow('network');
	});
});
