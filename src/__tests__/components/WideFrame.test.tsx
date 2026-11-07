import { render } from '@testing-library/react';
import { act, Activity } from 'react';

import { WideFrame } from '@/components/home/WideFrame';

function inActivity(mode: 'visible' | 'hidden') {
	return (
		<Activity mode={mode}>
			<WideFrame />
		</Activity>
	);
}

describe('WideFrame', () => {
	it('widens the frame only while the homepage is visible', async () => {
		const { rerender } = render(inActivity('visible'));
		const frameRule = document.querySelector('style');
		expect(frameRule).toHaveTextContent('--frame-width: var(--frame-width-wide)');
		expect(frameRule?.media).not.toBe('not all');

		await act(async () => rerender(inActivity('hidden')));
		expect(frameRule?.media).toBe('not all');

		await act(async () => rerender(inActivity('visible')));
		expect(frameRule?.media).not.toBe('not all');
	});

	it('keeps the frame narrow when the homepage first mounts hidden', async () => {
		const { rerender } = await act(async () => render(inActivity('hidden')));
		const frameRule = document.querySelector('style');
		expect(frameRule?.media).toBe('not all');

		await act(async () => rerender(inActivity('visible')));
		expect(frameRule?.media).not.toBe('not all');
	});
});
