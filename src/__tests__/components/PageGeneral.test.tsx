import { render, screen } from '@testing-library/react';

import PageGeneral from '@/components/PageGeneral';

const page = {
	title: 'Terms',
	layout: 'editor',
	showLastUpdated: true,
	_updatedAt: '2026-10-29T03:00:00Z',
	content: [],
};

describe('PageGeneral', () => {
	it('marks a page in its own language and dates it in that language', () => {
		const { container } = render(<PageGeneral data={{ ...page, title: '服務條款', language: 'zh' }} />);
		expect(container.querySelector('article')).toHaveAttribute('lang', 'zh-TW');
		expect(screen.getByText(/最後更新/)).toHaveTextContent('最後更新 2026年10月29日');
	});

	it('marks the English original as English wherever it is shown', () => {
		const { container } = render(<PageGeneral data={{ ...page, language: 'en' }} />);
		expect(container.querySelector('article')).toHaveAttribute('lang', 'en');
		expect(screen.getByText(/Last updated/)).toHaveTextContent('Last updated October 29, 2026');
	});
});
