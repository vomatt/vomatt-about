import type { PortableTextBlock } from '@portabletext/react';

import type { Locale } from '@/i18n/locales';

type Heading = { eyebrow: string; heading: string; intro: string };
type Item = { title: string; body: string };
type Panel = { label: string; title: string; body: string };

/**
 * pHome as homeQuery returns it. The item arrays have fixed lengths in the Studio because each
 * item pairs with a mock visual drawn here, by index.
 */
export type HomeContent = {
	/** The language the doc is written in; the default locale's when the URL's has no translation. */
	language: Locale;
	translations: string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sharing?: any;
	hero: { badge: string; heading: string; body: string; primaryLabel: string; secondaryLabel: string };
	howItWorks: Heading & { steps: Item[] };
	whySealed: Heading & { openCount: Panel; sealed: Panel };
	features: Heading & { items: Item[] };
	useCases: Heading & { items: { who: string; body: string; question: string }[] };
	promise: Heading & { rules: Item[]; footnote?: PortableTextBlock[] };
	finalCta: { heading: string; body: string; primaryLabel: string; secondaryLabel: string };
};
