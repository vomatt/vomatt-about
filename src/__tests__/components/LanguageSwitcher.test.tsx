import { fireEvent, render, screen } from '@testing-library/react';

const pathnameMock = jest.fn();
jest.mock('next/navigation', () => ({ usePathname: () => pathnameMock() }));

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Every page written in both languages unless a test says otherwise
const written = { en: ['/', '/about', '/privacy-policy'], zh: ['/', '/about', '/privacy-policy'] };

describe('LanguageSwitcher', () => {
	it.each([
		// An English page reads either its own URL or the /en path the proxy rewrote it to
		['/about', '/zh/about'],
		['/en/about', '/zh/about'],
		['/en', '/zh'],
		['/', '/zh'],
	])('on the English page %s links to the Chinese page %s', (pathname, href) => {
		pathnameMock.mockReturnValue(pathname);
		render(<LanguageSwitcher locale="en" label="Language" written={written} />);
		const link = screen.getByRole('link', { name: '繁體中文' });
		expect(link).toHaveAttribute('href', href);
		expect(link).toHaveAttribute('lang', 'zh-TW');
	});

	it.each([
		['/zh/about', '/about'],
		['/zh', '/'],
	])('on the Chinese page %s links to the English page %s', (pathname, href) => {
		pathnameMock.mockReturnValue(pathname);
		render(<LanguageSwitcher locale="zh" label="語言" written={written} />);
		expect(screen.getByRole('navigation', { name: '語言' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', href);
		expect(screen.queryByRole('link', { name: '繁體中文' })).not.toBeInTheDocument();
	});

	it('keeps the query string and anchor when switching', () => {
		window.history.replaceState(null, '', '/privacy-policy?utm_source=news#cookies');
		pathnameMock.mockReturnValue('/privacy-policy');
		render(<LanguageSwitcher locale="en" label="Language" written={written} />);
		const link = screen.getByRole('link', { name: '繁體中文' });
		link.addEventListener('click', (event) => event.preventDefault());
		fireEvent.click(link);
		expect(link).toHaveAttribute('href', '/zh/privacy-policy?utm_source=news#cookies');
	});

	it('offers no link to a language the page is not written in', () => {
		pathnameMock.mockReturnValue('/about');
		render(<LanguageSwitcher locale="en" label="Language" written={{ en: ['/about'], zh: ['/'] }} />);
		expect(screen.queryByRole('navigation', { name: 'Language' })).not.toBeInTheDocument();
	});

	it('links a Chinese URL showing the English fallback back to the English page', () => {
		pathnameMock.mockReturnValue('/zh/about');
		render(<LanguageSwitcher locale="zh" label="語言" written={{ en: ['/about'] }} />);
		expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/about');
	});

	it('matches a non-ASCII slug the URL percent-encodes', () => {
		pathnameMock.mockReturnValue('/zh/%E9%97%9C%E6%96%BC');
		render(<LanguageSwitcher locale="zh" label="語言" written={{ en: ['/關於'] }} />);
		expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/關於');
	});
});
