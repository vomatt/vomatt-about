import { ReactNode } from 'react';

import CustomPortableText from '@/components/CustomPortableText';
import PageModules, { type PageModule } from '@/components/PageModules';
import { type Locale, LOCALES } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';

// "October 29, 2026" or "2026年10月29日", the day in Taiwan, as vomatt-web shows it
const lastUpdatedFormat = (locale: Locale) =>
	new Intl.DateTimeFormat(LOCALES[locale].intl, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Asia/Taipei',
	});

/** A Sanity page, in the language it's written in (the fallback's when the URL's has no translation). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PageGeneral({ data, children }: { data: any; children?: ReactNode }) {
	const { title, layout, content, pageModules: modules, showLastUpdated, _updatedAt } = data;
	const language: Locale = data.language;
	const lang = LOCALES[language].htmlLang;

	if (layout === 'editor') {
		return (
			<article lang={lang} className="page-general">
				<h1 className="mb-4 display-heading text-[30px] text-foreground md:text-[40px]">{title}</h1>
				{showLastUpdated && _updatedAt && (
					<p className="mb-8 text-[14px] text-muted-foreground">
						{MESSAGES[language].page.lastUpdated}{' '}
						<time dateTime={_updatedAt}>{lastUpdatedFormat(language).format(new Date(_updatedAt))}</time>
					</p>
				)}
				<div className="cms-prose text-lg">{content && <CustomPortableText blocks={content} />}</div>
				{children}
			</article>
		);
	}

	// A Hero with a heading carries the page's h1; without one the title still names the page
	const hasHeroHeading = modules?.some((module: PageModule) => module._type === 'hero' && module.heading);

	return (
		<div lang={lang} className="page-general flex flex-col gap-14 md:gap-16">
			{!hasHeroHeading && <h1 className="sr-only">{title}</h1>}
			{modules?.map((module: PageModule) => (
				<PageModules key={module._key} module={module} />
			))}
			{children}
		</div>
	);
}
