// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
import type { Metadata } from 'next';

import { buildShareImageUrl } from '@/sanity/lib/image';

type Props = {
	data: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		sharing?: any;
		title?: string;
		isHomepage?: boolean;
		slug?: string;
	};
};

export default function defineMetadata({ data }: Props): Metadata {
	const { sharing, title, isHomepage, slug } = data || {};

	const metaDesc = sharing?.metaDesc || '';
	const metaTitle = sharing?.metaTitle || title || `Page not found`;
	const shareGraphic = sharing?.shareGraphic?.asset;
	const shareGraphicUrl = shareGraphic ? buildShareImageUrl(shareGraphic) : '';
	const disableIndex = sharing?.disableIndex;

	return {
		...(isHomepage ? null : { title: metaTitle }),
		description: metaDesc,
		openGraph: {
			title: metaTitle,
			description: metaDesc,
			images: shareGraphicUrl ? [{ url: shareGraphicUrl, width: 1200, height: 630 }] : [],
		},
		alternates: {
			canonical: `${process.env.SITE_URL}/${isHomepage ? '' : slug}`,
		},
		robots: {
			index: !disableIndex,
			follow: !disableIndex,
			nocache: true,
		},
	};
}
