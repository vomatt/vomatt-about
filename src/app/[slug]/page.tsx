import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CookieSettingsButton } from '@/components/CookieConsent';
import PageGeneral from '@/components/PageGeneral';
import defineMetadata from '@/lib/defineMetadata';
import { sanityFetch } from '@/sanity/lib/live';
import { pageGeneralQuery, pageGeneralSlugsQuery } from '@/sanity/lib/queries';

// Every published page is prerendered; an unknown slug may block so it can answer with a real 404
export const instant = false;

export async function generateStaticParams() {
	const { data } = await sanityFetch({ query: pageGeneralSlugsQuery });
	return ((data ?? []) as { slug: string }[]).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
	const { data } = await sanityFetch({ query: pageGeneralQuery, params: await params });
	return defineMetadata({ data });
}

export default async function PageSlugRoute({ params }: PageProps<'/[slug]'>) {
	const { slug } = await params;
	const { data } = await sanityFetch({ query: pageGeneralQuery, params: { slug } });
	if (!data) notFound();

	return <PageGeneral data={data}>{slug === 'cookies-policy' && <CookieSettingsButton />}</PageGeneral>;
}
