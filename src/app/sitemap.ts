import type { MetadataRoute } from 'next';

import { sanityFetch } from '@/sanity/lib/live';
import { pageGeneralSlugsQuery } from '@/sanity/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { data } = await sanityFetch({ query: pageGeneralSlugsQuery });
	const paths = ['', ...((data ?? []) as { slug: string }[]).map(({ slug }) => `/${slug}`)];
	return paths.map((path) => ({ url: `${process.env.SITE_URL}${path}` }));
}
