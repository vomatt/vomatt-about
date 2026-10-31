import { render, screen } from '@testing-library/react';

import CMSLink from '@/components/CMSLink';

describe('CMSLink', () => {
	const original = process.env.NEXT_PUBLIC_APP_URL;

	beforeAll(() => {
		process.env.NEXT_PUBLIC_APP_URL = 'https://vomatt.com';
	});

	afterAll(() => {
		process.env.NEXT_PUBLIC_APP_URL = original;
	});

	function hrefOf(link: { linkType: string; href: string }) {
		render(<CMSLink link={{ _type: 'link', isNewTab: false, ...link }}>Go</CMSLink>);
		return screen.getByRole('link').getAttribute('href');
	}

	it('sends a relative external link to the app', () => {
		expect(hrefOf({ linkType: 'external', href: '/explore' })).toBe('https://vomatt.com/explore');
	});

	it('keeps an internal page link on this site', () => {
		expect(hrefOf({ linkType: 'internal', href: '/privacy-policy' })).toBe('/privacy-policy');
	});

	it('leaves an absolute external link as it is', () => {
		expect(hrefOf({ linkType: 'external', href: 'https://example.com' })).toBe('https://example.com');
	});
});
