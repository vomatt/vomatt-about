import { render, screen } from '@testing-library/react';

import PageSlugRoute from '@/app/[locale]/[slug]/page';
import { getSiteSettings } from '@/lib/siteSettings';

jest.mock('@/i18n/server', () => ({ getLocale: async () => 'en' }));
jest.mock('@/lib/siteSettings', () => ({ getSiteSettings: jest.fn() }));
jest.mock('@/sanity/lib/live', () => ({
	sanityFetch: async () => ({ data: { title: 'Cookies Policy', layout: 'editor', language: 'en', content: [] } }),
}));
const settingsMock = getSiteSettings as jest.Mock;

const renderPage = async (slug: string) =>
	render(await PageSlugRoute({ params: Promise.resolve({ slug }) } as PageProps<'/[locale]/[slug]'>));

describe('the cookies policy page', () => {
	beforeEach(() => settingsMock.mockReset());

	it('lets a visitor change their choice once analytics is set up', async () => {
		settingsMock.mockResolvedValue({ integrations: { gaIDs: ['G-TEST'] } });
		await renderPage('cookies-policy');
		expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeEnabled();
	});

	it('still renders, with the button off, when the settings cannot be loaded', async () => {
		settingsMock.mockResolvedValue(null);
		await renderPage('cookies-policy');
		expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeDisabled();
	});

	it('shows no cookie settings on other pages, and skips the settings fetch', async () => {
		await renderPage('about');
		expect(screen.queryByRole('button', { name: 'Cookie settings' })).not.toBeInTheDocument();
		expect(settingsMock).not.toHaveBeenCalled();
	});
});
