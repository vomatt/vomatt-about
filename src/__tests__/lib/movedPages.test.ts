import nextConfig from '../../../next.config';

describe('moved pages', () => {
	it('send the Cookies Policy to the Privacy Policy in every language, permanently', async () => {
		expect(await nextConfig.redirects?.()).toEqual([
			{ source: '/cookies-policy', destination: '/privacy-policy', permanent: true },
			{ source: '/zh/cookies-policy', destination: '/zh/privacy-policy', permanent: true },
		]);
	});
});
