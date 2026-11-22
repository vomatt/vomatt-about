import { render } from '@testing-library/react';

import PageSlugRoute from '@/app/[locale]/[slug]/page';

jest.mock('@/i18n/server', () => ({ getLocale: async () => 'en' }));
jest.mock('@/sanity/lib/live', () => ({
	sanityFetch: async () => ({ data: { title: 'Page', layout: 'editor', language: 'en', content: [] } }),
}));

const renderPage = async (slug: string) =>
	render(await PageSlugRoute({ params: Promise.resolve({ slug }) } as PageProps<'/[locale]/[slug]'>));

describe('the brand mark', () => {
	it('opens the about page, with a ballot dropping into its slot', async () => {
		const { container } = await renderPage('about');
		const ballot = container.querySelector('svg .mark-ballot');
		expect(ballot?.closest('[aria-hidden]')).toBeInTheDocument();
	});

	it('stays off other pages', async () => {
		const { container } = await renderPage('terms-of-service');
		expect(container.querySelector('svg .mark-ballot')).not.toBeInTheDocument();
	});
});
