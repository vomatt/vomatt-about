import {
	createImageUrlBuilder,
	type ImageFormat,
	type SanityImageSource,
} from '@sanity/image-url';

import { dataset, projectId } from '../env';

// https://www.sanity.io/docs/image-url
export const imageBuilder = createImageUrlBuilder({
	projectId: projectId || '',
	dataset: dataset || '',
});

// Open Graph share image, 1200px wide. Not every link preview (LinkedIn) reads WebP, so JPG,
// or PNG when the upload is one, to keep its transparency. An asset id ends in its format: image-<hash>-1200x630-png
export function buildShareImageUrl(image: SanityImageSource) {
	const source = image as { _ref?: string; asset?: { _ref?: string } } | null;
	const id = source?._ref ?? source?.asset?._ref;
	return imageBuilder.image(image).format(id?.endsWith('-png') ? 'png' : 'jpg').width(1200).url();
}

type BuildImageSrcOptions = {
	width?: number;
	height?: number;
	format?: ImageFormat;
	quality?: number;
};

export function buildImageSrc(
	image: SanityImageSource | null | undefined,
	{ width, height, format, quality = 80 }: BuildImageSrcOptions
) {
	if (!image) {
		return undefined;
	}

	let imgSrc = imageBuilder.image(image);

	if (width) {
		imgSrc = imgSrc.width(Math.round(width));
	}

	if (height) {
		imgSrc = imgSrc.height(Math.round(height));
	}

	if (format) {
		imgSrc = imgSrc.format(format);
	}

	return imgSrc.quality(quality).fit('max').auto('format').url();
}
