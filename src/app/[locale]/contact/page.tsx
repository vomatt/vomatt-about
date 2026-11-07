import type { Metadata, ResolvingMetadata } from 'next';

import { ContactForm } from '@/components/ContactForm';
import { locales } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';
import { getLocale } from '@/i18n/server';
import defineMetadata from '@/lib/defineMetadata';

// Built in code, so it's written in every language
export async function generateMetadata(
	_props: PageProps<'/[locale]/contact'>,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const [locale, { openGraph }] = await Promise.all([getLocale(), parent]);
	const { title, intro } = MESSAGES[locale].contact;
	return defineMetadata({
		data: { title, sharing: { metaDesc: intro }, language: locale, translations: locales },
		locale,
		path: '/contact',
		parentOpenGraph: openGraph,
	});
}

export default async function ContactPage() {
	const locale = await getLocale();
	const { title, intro } = MESSAGES[locale].contact;
	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="mb-4 display-heading text-[30px] text-foreground md:text-[40px]">{title}</h1>
				<p className="text-lg text-muted-foreground">{intro}</p>
			</div>
			<ContactForm locale={locale} />
		</div>
	);
}
