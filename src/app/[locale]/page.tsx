import '@/components/home/home.css';

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import type { HomeContent } from '@/components/home/content';
import { Features } from '@/components/home/Features';
import { FinalCta } from '@/components/home/FinalCta';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { UseCases } from '@/components/home/UseCases';
import { VotePromise } from '@/components/home/VotePromise';
import { WhySealed } from '@/components/home/WhySealed';
import { LOCALES } from '@/i18n/locales';
import { getLocale } from '@/i18n/server';
import defineMetadata from '@/lib/defineMetadata';
import { sanityFetch } from '@/sanity/lib/live';
import { homeQuery } from '@/sanity/lib/queries';

async function getHome() {
	const locale = await getLocale();
	const { data } = await sanityFetch({ query: homeQuery, params: { locale } });
	return data as HomeContent | null;
}

export async function generateMetadata(_props: PageProps<'/[locale]'>, parent: ResolvingMetadata): Promise<Metadata> {
	const [data, { openGraph }] = await Promise.all([getHome(), parent]);
	return defineMetadata({ data, path: '/', parentOpenGraph: openGraph });
}

export default async function HomePage() {
	const data = await getHome();
	// A pHome without the homepage's sections is the old page-builder doc, not a homepage
	if (!data?.hero) notFound();

	// The mock polls speak the language the copy beside them is written in
	const locale = data.language;
	return (
		// Wide frame: the header, footer and main column take the page width (max-w-page) here
		<div data-wide-frame lang={LOCALES[locale].htmlLang} className="flex flex-col gap-24 md:gap-32">
			<Hero content={data.hero} locale={locale} />
			<HowItWorks content={data.howItWorks} locale={locale} />
			<WhySealed content={data.whySealed} locale={locale} />
			<Features content={data.features} locale={locale} />
			<UseCases content={data.useCases} locale={locale} />
			<VotePromise content={data.promise} />
			<FinalCta content={data.finalCta} />
		</div>
	);
}
