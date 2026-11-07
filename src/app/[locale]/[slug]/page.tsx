import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { BrandMark } from '@/components/BrandMark';
import { CookieSettingsButton } from '@/components/CookieConsent';
import PageGeneral from '@/components/PageGeneral';
import { getLocale } from '@/i18n/server';
import defineMetadata from '@/lib/defineMetadata';
import { MOVED_PAGES } from '@/lib/movedPages';
import { getSiteSettings } from '@/lib/siteSettings';
import { sanityFetch } from '@/sanity/lib/live';
import { localeParams, pageGeneralQuery, pageGeneralSlugsQuery } from '@/sanity/lib/queries';

// Every published page is prerendered; an unknown slug may block so it can answer with a real 404
export const instant = false;

// Every slug in every locale: a page without a translation shows its English original
export async function generateStaticParams() {
	const { data } = await sanityFetch({ query: pageGeneralSlugsQuery });
	const slugs = new Set(
		((data ?? []) as { slug: string }[]).map(({ slug }) => slug).filter((slug) => !(`/${slug}` in MOVED_PAGES))
	);
	return [...slugs].map((slug) => ({ slug }));
}

async function getPage(slug: string) {
	const locale = await getLocale();
	const { data } = await sanityFetch({ query: pageGeneralQuery, params: { slug, ...localeParams(locale) } });
	return data;
}

export async function generateMetadata(
	{ params }: PageProps<'/[locale]/[slug]'>,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { slug } = await params;
	const [locale, data, { openGraph }] = await Promise.all([getLocale(), getPage(slug), parent]);
	return defineMetadata({ data, locale, path: `/${slug}`, parentOpenGraph: openGraph });
}

export default async function PageSlugRoute({ params }: PageProps<'/[locale]/[slug]'>) {
	const { slug } = await params;
	const isAbout = slug === 'about';
	const data = await getPage(slug);
	if (!data) notFound();
	// The page that lists the cookies turns this on in Sanity, so the choice can be changed there
	const settings = data.showCookieSettings ? await getSiteSettings() : null;

	return (
		<>
			{isAbout && <BrandMark className="mb-8" />}
			<PageGeneral data={data}>
				{data.showCookieSettings && <CookieSettingsButton locale={data.language} integrations={settings?.integrations} />}
			</PageGeneral>
		</>
	);
}
