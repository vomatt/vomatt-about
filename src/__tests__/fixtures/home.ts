import type { HomeContent } from '@/components/home/content';
import type { Locale } from '@/i18n/locales';

const block = (key: string, children: { text: string; marks?: string[] }[], markDefs: ({ _type: string; _key: string } & Record<string, unknown>)[] = []) => ({
	_type: 'block',
	_key: key,
	style: 'normal',
	markDefs,
	children: children.map((child, index) => ({ _type: 'span', _key: `${key}${index}`, marks: [], ...child })),
});

const items = (count: number, prefix: string) =>
	Array.from({ length: count }, (_, index) => ({ title: `${prefix} ${index + 1}`, body: `${prefix} body ${index + 1}` }));

/** A pHome as homeQuery returns it, its strings tagged with the language so a test can tell which doc rendered. */
export function homeFixture(language: Locale, words: { heading: string; start: string; privacy: string }): HomeContent {
	return {
		language,
		translations: ['en', 'zh'],
		sharing: { metaTitle: `${language} title`, siteTitle: 'vomatt' },
		hero: {
			badge: `${language} badge`,
			heading: words.heading,
			body: `${language} hero body`,
			primaryLabel: words.start,
			secondaryLabel: `${language} how it works`,
		},
		howItWorks: {
			eyebrow: `${language} eyebrow`,
			heading: `${language} steps heading`,
			intro: `${language} steps intro`,
			steps: items(3, `${language} step`),
		},
		whySealed: {
			eyebrow: `${language} why`,
			heading: `${language} why heading`,
			intro: `${language} why intro`,
			openCount: { label: `${language} open label`, title: `${language} open title`, body: `${language} open body` },
			sealed: { label: `${language} sealed label`, title: `${language} sealed title`, body: `${language} sealed body` },
		},
		features: {
			eyebrow: `${language} features`,
			heading: `${language} features heading`,
			intro: '',
			items: items(6, `${language} feature`),
		},
		useCases: {
			eyebrow: `${language} use cases`,
			heading: `${language} use cases heading`,
			intro: `${language} use cases intro`,
			items: Array.from({ length: 4 }, (_, index) => ({
				who: `${language} who ${index + 1}`,
				body: `${language} use body ${index + 1}`,
				question: `${language} question ${index + 1}`,
			})),
		},
		promise: {
			eyebrow: `${language} promise`,
			heading: `${language} promise heading`,
			intro: `${language} promise intro`,
			rules: items(4, `${language} rule`),
			footnote: [
				block(
					'f',
					[{ text: `${language} see the ` }, { text: words.privacy, marks: ['l'] }, { text: '.' }],
					[
						{
							_type: 'link',
							_key: 'l',
							linkType: 'internal',
							href: language === 'en' ? '/privacy-policy' : '/zh/privacy-policy',
							isNewTab: false,
						},
					]
				),
			],
		},
		finalCta: {
			heading: `${language} final heading`,
			body: `${language} final body`,
			primaryLabel: words.start,
			secondaryLabel: `${language} explore`,
		},
	};
}

export const enHome = homeFixture('en', {
	heading: 'Ask everyone. Hear what they really think.',
	start: 'Start a poll',
	privacy: 'Privacy Policy',
});

export const zhHome = homeFixture('zh', { heading: '問問大家，聽聽真心話。', start: '發起投票', privacy: '隱私權政策' });
