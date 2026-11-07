import { fireEvent, render, screen } from '@testing-library/react';

import { AccordionItem } from '@/components/modules/AccordionItem';

type FakeAnimation = { cancel: jest.Mock; onfinish: (() => void) | null };
let animations: FakeAnimation[];

function mockReducedMotion(reduce: boolean) {
	window.matchMedia = jest.fn().mockReturnValue({ matches: reduce }) as unknown as typeof window.matchMedia;
}

function renderItem() {
	render(<AccordionItem title="Why sealed?">Nobody sees the count early.</AccordionItem>);
	const summary = screen.getByText('Why sealed?');
	return { summary, details: summary.closest('details')! };
}

const finishLatest = () => animations.at(-1)!.onfinish?.();

beforeEach(() => {
	animations = [];
	HTMLElement.prototype.animate = jest.fn(() => {
		const animation: FakeAnimation = { cancel: jest.fn(), onfinish: null };
		animations.push(animation);
		return animation as unknown as Animation;
	});
	mockReducedMotion(false);
});

describe('AccordionItem', () => {
	it('opens on click', () => {
		const { summary, details } = renderItem();
		fireEvent.click(summary);
		expect(details.open).toBe(true);
	});

	it('stays open while it slides shut, then closes', () => {
		const { summary, details } = renderItem();
		fireEvent.click(summary);
		finishLatest();
		fireEvent.click(summary);
		expect(details.open).toBe(true);
		finishLatest();
		expect(details.open).toBe(false);
	});

	it('reopens when clicked again mid-close', () => {
		const { summary, details } = renderItem();
		fireEvent.click(summary);
		finishLatest();
		fireEvent.click(summary);
		fireEvent.click(summary);
		finishLatest();
		expect(details.open).toBe(true);
	});

	it('toggles natively without animating under reduced motion', () => {
		mockReducedMotion(true);
		const { summary, details } = renderItem();
		fireEvent.click(summary);
		expect(details.open).toBe(true);
		expect(HTMLElement.prototype.animate).not.toHaveBeenCalled();
	});
});
