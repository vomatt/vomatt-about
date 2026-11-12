import { render } from '@testing-library/react';

jest.mock('@/sanity/env', () => ({ projectId: 'proj', dataset: 'prod' }));

import Img from '@/components/Image';

const asset = { _ref: 'image-abc123-2000x1000-jpg' };

describe('Img', () => {
	it("reads the image's alt text", () => {
		const { container } = render(<Img image={{ asset, alt: 'A sealed ballot box' }} />);

		expect(container.querySelector('img')).toHaveAttribute('alt', 'A sealed ballot box');
	});

	it('is decorative without alt text', () => {
		const { container } = render(<Img image={{ asset }} />);

		expect(container.querySelector('img')).toHaveAttribute('alt', '');
	});

	it('requests the full-size image on the first render', () => {
		const { container } = render(<Img image={{ asset }} />);

		expect(decodeURIComponent(container.querySelector('img')!.src)).toContain('w=2000');
	});

	it('renders nothing for an asset that is not an image', () => {
		const { container } = render(<Img image={{ asset: { _ref: 'file-abc123-pdf' } }} />);

		expect(container).toBeEmptyDOMElement();
	});
});
