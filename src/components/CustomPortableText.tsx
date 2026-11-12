import {
	PortableText,
	type PortableTextBlock,
	type PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react';

import CMSLink from '@/components/CMSLink';
import Img from '@/components/Image';
import { buttonVariants } from '@/components/ui/Button';

const PortableTextComponents: PortableTextComponentsType = {
	block: {
		h1: ({ children }) => <h1>{children}</h1>,
		h2: ({ children }) => <h2>{children}</h2>,
		h3: ({ children }) => <h3>{children}</h3>,
		h4: ({ children }) => <h4>{children}</h4>,
		h5: ({ children }) => <h5>{children}</h5>,
		h6: ({ children }) => <h6>{children}</h6>,
	},
	list: {
		bullet: ({ children }) => <ul>{children}</ul>,
		number: ({ children }) => <ol>{children}</ol>,
	},
	types: {
		image: (data) => {
			const { value } = data;
			return <Img image={value} />;
		},
		iframe: ({ value }) => {
			const { embedSnippet } = value;
			if (!embedSnippet) {
				return null;
			}
			const width = embedSnippet.match(/width="\s*(\d+)"/)?.[1];
			const height = embedSnippet.match(/height="\s*(\d+)"/)?.[1];
			const aspectRatio =
				width && height ? `${(height / width) * 100}%` : '56.25%';

			return (
				<div
					className="relative h-0 max-w-full overflow-hidden [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full"
					style={{ paddingBottom: aspectRatio }}
					dangerouslySetInnerHTML={{ __html: embedSnippet }}
				/>
			);
		},
	},
	marks: {
		link: ({ value, children }) => {
			return (
				<CMSLink link={value} className="text-link">
					{children}
				</CMSLink>
			);
		},
		callToAction: ({ value, children }) => {
			return (
				<CMSLink link={value.link} className={buttonVariants()}>
					{children}
				</CMSLink>
			);
		},
	},
};

type CustomPortableTextProps = {
	blocks?: PortableTextBlock[] | null;
};

export default function CustomPortableText({
	blocks,
}: CustomPortableTextProps) {
	if (!blocks) return null;

	return <PortableText value={blocks} components={PortableTextComponents} />;
}
