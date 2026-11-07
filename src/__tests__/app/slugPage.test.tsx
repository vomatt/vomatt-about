import { render, screen } from '@testing-library/react';

import PageSlugRoute from '@/app/[locale]/[slug]/page';
import { getSiteSettings } from '@/lib/siteSettings';

jest.mock('@/i18n/server', () => ({ getLocale: async () => 'en' }));
jest.mock('@/lib/siteSettings', () => ({ getSiteSettings: jest.fn() }));
// The pages that list the cookies turn the Cookie settings button on in Sanity
jest.mock('@/sanity/lib/live', () => ({
	sanityFetch: async ({ params }: { params?: { slug?: string } }) => ({
		data: { title: 'Page', layout: 'editor', language: 'en', content: [], showCookieSettings: ['privacy-policy', 'data-notice'].includes(params?.slug ?? '') },
	}),
}));
const settingsMock = getSiteSettings as jest.Mock;

const renderPage = async (slug: string) =>
	render(await PageSlugRoute({ params: Promise.resolve({ slug }) } as PageProps<'/[locale]/[slug]'>));

describe('the Cookie settings button', () => {
	beforeEach(() => settingsMock.mockReset());

	it('lets a visitor change their choice on a page that turns it on, once analytics is set up', async () => {
		settingsMock.mockResolvedValue({ integrations: { gaIDs: ['G-TEST'] } });
		await renderPage('privacy-policy');
		expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeEnabled();
	});

	it('follows the page setting rather than the slug', async () => {
		settingsMock.mockResolvedValue({ integrations: { gaIDs: ['G-TEST'] } });
		await renderPage('data-notice');
		expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeEnabled();
	});

	it('still renders, with the button off, when the settings cannot be loaded', async () => {
		settingsMock.mockResolvedValue(null);
		await renderPage('privacy-policy');
		expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeDisabled();
	});

	it('stays off a page that leaves it off, whatever its slug, and skips the settings fetch', async () => {
		await renderPage('about');
		expect(screen.queryByRole('button', { name: 'Cookie settings' })).not.toBeInTheDocument();
		expect(settingsMock).not.toHaveBeenCalled();
	});
});

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
