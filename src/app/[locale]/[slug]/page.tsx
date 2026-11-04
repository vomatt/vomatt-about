import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { CookieSettingsButton } from '@/components/CookieConsent';
import PageGeneral from '@/components/PageGeneral';
import { getLocale } from '@/i18n/server';
import defineMetadata from '@/lib/defineMetadata';
import { sanityFetch } from '@/sanity/lib/live';
import { pageGeneralQuery, pageGeneralSlugsQuery } from '@/sanity/lib/queries';

// Every published page is prerendered; an unknown slug may block so it can answer with a real 404
export const instant = false;

// Every slug in every locale: a page without a translation shows its English original
export async function generateStaticParams() {
	const { data } = await sanityFetch({ query: pageGeneralSlugsQuery });
	const slugs = new Set(((data ?? []) as { slug: string }[]).map(({ slug }) => slug));
	return [...slugs].map((slug) => ({ slug }));
}

async function getPage(slug: string) {
	const locale = await getLocale();
	const { data } = await sanityFetch({ query: pageGeneralQuery, params: { slug, locale } });
	return data;
}

export async function generateMetadata(
	{ params }: PageProps<'/[locale]/[slug]'>,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { slug } = await params;
	const [data, { openGraph }] = await Promise.all([getPage(slug), parent]);
	return defineMetadata({ data, path: `/${slug}`, parentOpenGraph: openGraph });
}

export default async function PageSlugRoute({ params }: PageProps<'/[locale]/[slug]'>) {
	const { slug } = await params;
	const data = await getPage(slug);
	if (!data) notFound();

	return (
		<PageGeneral data={data}>
			{slug === 'cookies-policy' && <CookieSettingsButton locale={data.language} />}
		</PageGeneral>
	);
}
