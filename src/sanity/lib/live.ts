import type { QueryParams } from '@sanity/client';
import { cacheLife, cacheTag } from 'next/cache';

import { revalidatesOnPublish } from '@/sanity/env';

/** Tags content whose sync tags can't be tracked; /api/revalidate expires it on every publish. */
export const UNTRACKED_TAG = 'sanity:untracked';

// cacheTag drops tags past this many per call
const MAX_TAGS = 128;

/**
 * Published content only, cached until a publish changes it.
 * Sanity returns a query's sync tags with its result, and `use cache` can tag
 * after the fetch, so one request both gets the content and tags it
 * `sanity:<syncTag>`. On publish, /api/revalidate expires only the changed
 * sync tags, so pages whose content didn't change stay cached.
 * Outside production nothing expires the cache (the Sanity Function only calls
 * production), so it refreshes every 60s.
 */
export async function sanityFetch({
	query,
	params = {},
}: {
	query: string;
	params?: QueryParams;
}) {
	'use cache';
	// Hourly even when publishes expire it: a render in flight during a publish
	// can re-cache the old content after its tags expired
	if (revalidatesOnPublish()) cacheLife('hours');
	else cacheLife({ revalidate: 60 });

	// Imported lazily so a missing Sanity env var fails this call, not every importer
	const { client } = await import('@/sanity/lib/client');
	const { result, syncTags = [] } = await client.fetch(query, params, {
		filterResponse: false,
	});

	cacheTag(
		...(syncTags.length > 0 && syncTags.length <= MAX_TAGS
			? syncTags.map((tag: string) => `sanity:${tag}`)
			: [UNTRACKED_TAG])
	);
	return { data: result };
}
