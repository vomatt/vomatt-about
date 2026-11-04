import { render, screen } from '@testing-library/react';

const pathnameMock = jest.fn();
jest.mock('next/navigation', () => ({ usePathname: () => pathnameMock() }));

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

describe('LanguageSwitcher', () => {
	it.each([
		// An English page reads either its own URL or the /en path the proxy rewrote it to
		['/about', '/zh/about'],
		['/en/about', '/zh/about'],
		['/en', '/zh'],
		['/', '/zh'],
	])('on the English page %s links to the Chinese page %s', (pathname, href) => {
		pathnameMock.mockReturnValue(pathname);
		render(<LanguageSwitcher locale="en" label="Language" />);
		const link = screen.getByRole('link', { name: '繁體中文' });
		expect(link).toHaveAttribute('href', href);
		expect(link).toHaveAttribute('lang', 'zh-TW');
	});

	it.each([
		['/zh/about', '/about'],
		['/zh', '/'],
	])('on the Chinese page %s links to the English page %s', (pathname, href) => {
		pathnameMock.mockReturnValue(pathname);
		render(<LanguageSwitcher locale="zh" label="語言" />);
		expect(screen.getByRole('navigation', { name: '語言' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', href);
		expect(screen.queryByRole('link', { name: '繁體中文' })).not.toBeInTheDocument();
	});
});
