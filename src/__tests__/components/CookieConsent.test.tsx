import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/components/HeadTrackingCode', () => ({
	HeadTrackingCode: () => <div data-testid="tracking" />,
}));

import { consentCookie, CookieConsent, CookieSettingsButton } from '@/components/CookieConsent';

const integrations = { gaIDs: ['G-TEST'] };

function clearConsent() {
	document.cookie = 'cookie-consent=; path=/; max-age=0';
}

beforeEach(clearConsent);

describe('CookieConsent', () => {
	it('renders nothing when no analytics ID is set', () => {
		const { container } = render(<CookieConsent locale="en" integrations={{ gaIDs: [] }} />);
		expect(container).toBeEmptyDOMElement();
	});

	it('asks first and does not load analytics before a choice', () => {
		render(<CookieConsent locale="en" integrations={integrations} />);
		expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
		expect(screen.queryByTestId('tracking')).not.toBeInTheDocument();
	});

	it('loads analytics and stores the choice after Accept', () => {
		render(<CookieConsent locale="en" integrations={integrations} />);
		fireEvent.click(screen.getByRole('button', { name: /accept/i }));
		expect(screen.getByTestId('tracking')).toBeInTheDocument();
		expect(document.cookie).toContain('cookie-consent=granted');
	});

	it('hides the banner without loading analytics after Decline', () => {
		render(<CookieConsent locale="en" integrations={integrations} />);
		fireEvent.click(screen.getByRole('button', { name: /decline/i }));
		expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
		expect(screen.queryByTestId('tracking')).not.toBeInTheDocument();
	});

	it('asks in Chinese on a Chinese page, linking to the Chinese Cookies Policy', () => {
		render(<CookieConsent locale="zh" integrations={integrations} />);
		expect(screen.getByRole('region', { name: 'Cookie 同意' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '接受分析' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Cookie 政策' })).toHaveAttribute('href', '/zh/cookies-policy');
	});

	it('remembers an earlier Accept', () => {
		document.cookie = 'cookie-consent=granted; path=/';
		render(<CookieConsent locale="en" integrations={integrations} />);
		expect(screen.getByTestId('tracking')).toBeInTheDocument();
	});
});

describe('CookieSettingsButton', () => {
	it('shows the banner again after a Decline', () => {
		document.cookie = 'cookie-consent=denied; path=/';
		render(
			<>
				<CookieConsent locale="en" integrations={integrations} />
				<CookieSettingsButton locale="en" />
			</>
		);
		expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: /cookie settings/i }));
		expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
	});
});

describe('consentCookie', () => {
	it('is shared across vomatt.com and its subdomains', () => {
		expect(consentCookie('granted', 'about.vomatt.com')).toContain('; domain=vomatt.com');
		expect(consentCookie('granted', 'vomatt.com')).toContain('; domain=vomatt.com');
	});

	it('stays on the host elsewhere, where vomatt.com is not a valid cookie domain', () => {
		expect(consentCookie('granted', 'localhost')).not.toContain('domain=');
		expect(consentCookie('granted', 'vomatt-about.vercel.app')).not.toContain('domain=');
	});

	it('clears with the same domain it was set on', () => {
		expect(consentCookie('', 'about.vomatt.com')).toBe(
			'cookie-consent=; path=/; max-age=0; samesite=lax; domain=vomatt.com'
		);
	});
});
