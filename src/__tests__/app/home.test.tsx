import 'react-intersection-observer/test-utils';

import { render, screen } from '@testing-library/react';

import { enHome, zhHome } from '../fixtures/home';

const localeMock = jest.fn();
const fetchMock = jest.fn();

jest.mock('next/root-params', () => ({ locale: () => localeMock() }), { virtual: true });
jest.mock('@/sanity/lib/live', () => ({ sanityFetch: (...args: unknown[]) => fetchMock(...args) }));

import HomePage from '@/app/[locale]/page';

/** The homepage at `locale` when Sanity answers with `doc`. */
async function renderHome(locale: string, doc: unknown) {
	localeMock.mockResolvedValue(locale);
	fetchMock.mockResolvedValue({ data: doc });
	return render(await HomePage());
}

describe('HomePage', () => {
	const original = process.env.NEXT_PUBLIC_APP_URL;

	beforeAll(() => {
		process.env.NEXT_PUBLIC_APP_URL = 'https://vomatt.com';
		// jsdom has no matchMedia; the page asks it whether to animate
		window.matchMedia = jest.fn().mockReturnValue({ matches: false });
	});

	afterAll(() => {
		process.env.NEXT_PUBLIC_APP_URL = original;
	});

	it('asks Sanity for the homepage in the URL’s locale', async () => {
		await renderHome('zh', zhHome);
		expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ params: { locale: 'zh' } }));
	});

	it('leads with the headline from Sanity', async () => {
		await renderHome('en', enHome);
		expect(
			screen.getByRole('heading', { level: 1, name: 'Ask everyone. Hear what they really think.' })
		).toBeInTheDocument();
	});

	it('sends both start buttons and the explore button to the app', async () => {
		await renderHome('en', enHome);
		const startLinks = screen.getAllByRole('link', { name: 'Start a poll' });
		expect(startLinks).toHaveLength(2);
		startLinks.forEach((link) => expect(link).toHaveAttribute('href', 'https://vomatt.com/login'));
		expect(screen.getByRole('link', { name: 'en explore' })).toHaveAttribute('href', 'https://vomatt.com/explore');
	});

	it('links How it works to its section and the footnote to the Privacy Policy', async () => {
		await renderHome('en', enHome);
		expect(screen.getByRole('link', { name: 'en how it works' })).toHaveAttribute('href', '#how-it-works');
		expect(screen.getByRole('region', { name: 'en steps heading' })).toHaveAttribute('id', 'how-it-works');
		expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy-policy');
	});

	it('pairs each step, feature, use case and rule from Sanity with its place on the page', async () => {
		await renderHome('en', enHome);
		expect(screen.getAllByRole('heading', { level: 3, name: /^en step \d$/ })).toHaveLength(3);
		expect(screen.getAllByRole('heading', { level: 3, name: /^en feature \d$/ })).toHaveLength(6);
		expect(screen.getAllByRole('heading', { level: 3, name: /^en who \d$/ })).toHaveLength(4);
		expect(screen.getByText('en question 4')).toBeInTheDocument();
		expect(screen.getByText('en rule 4')).toBeInTheDocument();
	});

	it('shows the Chinese homepage with its mock polls in Chinese', async () => {
		const { container } = await renderHome('zh', zhHome);
		expect(screen.getByRole('heading', { level: 1, name: '問問大家，聽聽真心話。' })).toBeInTheDocument();
		expect(screen.getAllByRole('link', { name: '發起投票' })).toHaveLength(2);
		expect(screen.getByRole('link', { name: '隱私權政策' })).toHaveAttribute('href', '/zh/privacy-policy');
		expect(screen.getAllByText('投票結束後才會公開結果').length).toBeGreaterThan(0);
		expect(screen.queryByText('Results are revealed when the poll ends')).not.toBeInTheDocument();
		expect(container.querySelector('[data-wide-frame]')).toHaveAttribute('lang', 'zh-TW');
	});

	it('falls back to the English homepage, mock polls and all, marked as English', async () => {
		const { container } = await renderHome('zh', enHome);
		expect(
			screen.getByRole('heading', { level: 1, name: 'Ask everyone. Hear what they really think.' })
		).toBeInTheDocument();
		expect(screen.getAllByText('Results are revealed when the poll ends').length).toBeGreaterThan(0);
		expect(container.querySelector('[data-wide-frame]')).toHaveAttribute('lang', 'en');
	});

	it('is not found when Sanity has no homepage', async () => {
		localeMock.mockResolvedValue('en');
		fetchMock.mockResolvedValue({ data: null });
		await expect(HomePage()).rejects.toThrow();
	});
});
