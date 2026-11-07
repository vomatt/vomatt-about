import type { PortableTextBlock } from '@portabletext/react';

import CustomPortableText from '@/components/CustomPortableText';

import { AccordionItem } from './AccordionItem';
import { ModuleSection, type SectionHeadingData } from './shared';

export type AccordionListData = SectionHeadingData & {
	items?: { _key: string; title?: string; content?: PortableTextBlock[] }[];
};

/** Questions or tips that each open and close on their own, on native <details>. */
export default function AccordionList({ data }: { data: AccordionListData }) {
	const { eyebrow, heading, intro, items = [] } = data;

	return (
		<ModuleSection eyebrow={eyebrow} heading={heading} intro={intro}>
			<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
				{items.map((item) => (
					<AccordionItem key={item._key} title={item.title}>
						<CustomPortableText blocks={item.content} />
					</AccordionItem>
				))}
			</div>
		</ModuleSection>
	);
}
