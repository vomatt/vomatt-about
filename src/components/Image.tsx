import type { SanityImageSource } from '@sanity/image-url';
import Image from 'next/image'; /* https://nextjs.org/docs/api-reference/next/image */

import { buildImageSrc } from '@/sanity/lib/image';

type SanityRefLike = { _ref?: string; _id?: string };

export type ImgSource = Exclude<SanityImageSource, string> & {
	customRatio?: number;
	alt?: string;
};

type ImgProps = {
	image: ImgSource;
	alt?: string;
	className?: string;
};

function getSanityRefId(source: SanityImageSource) {
	if (typeof source === 'string') {
		return source;
	}

	const image = source as SanityRefLike & { asset?: SanityRefLike };

	if (image?.asset) {
		return image?.asset?._ref || image?.asset?._id;
	}

	return image._ref || image._id;
}

// An image asset's id carries its size: image-<hash>-<width>x<height>-<format>
function getImageDimensions(id: string) {
	const size = id.match(/-(\d+)x(\d+)-/);
	if (!size) return null;
	const [width, height] = [Number(size[1]), Number(size[2])];
	return { width, height, aspectRatio: width / height };
}

// The widest an image is shown: the main column
const SIZES = '(min-width: 712px) 680px, 100vw';

export default function Img({ image, alt, className }: ImgProps) {
	const imageId = getSanityRefId(image);
	const dimensions = imageId ? getImageDimensions(imageId) : null;
	// Not an image asset (or none): nothing to show
	if (!dimensions) return null;

	const aspectRatio = image.customRatio || dimensions.aspectRatio;
	const width = dimensions.width;
	const height = Math.round(width / aspectRatio);
	// Full quality from Sanity, so next/image's is the only lossy pass
	const src = buildImageSrc(image, { width, height, quality: 100 });
	if (!src) return null;

	return (
		<picture className={className}>
			<Image width={width} height={height} sizes={SIZES} src={src} alt={alt || image.alt || ''} />
		</picture>
	);
}
