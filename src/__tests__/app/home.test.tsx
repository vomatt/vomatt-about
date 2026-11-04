import 'react-intersection-observer/test-utils';

import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

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

	it('leads with the headline', () => {
		render(<HomePage />);
		expect(
			screen.getByRole('heading', { level: 1, name: 'Ask everyone. Hear what they really think.' })
		).toBeInTheDocument();
	});

	it('sends Start a poll and Explore open polls to the app', () => {
		render(<HomePage />);
		const startLinks = screen.getAllByRole('link', { name: 'Start a poll' });
		expect(startLinks).toHaveLength(2);
		startLinks.forEach((link) => expect(link).toHaveAttribute('href', 'https://vomatt.com/login'));
		expect(screen.getByRole('link', { name: 'Explore open polls' })).toHaveAttribute(
			'href',
			'https://vomatt.com/explore'
		);
	});

	it('links How it works to its section and the rules to the Privacy Policy', () => {
		render(<HomePage />);
		expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
		expect(screen.getByRole('region', { name: 'One poll, from question to result' })).toHaveAttribute(
			'id',
			'how-it-works'
		);
		expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy-policy');
	});
});
