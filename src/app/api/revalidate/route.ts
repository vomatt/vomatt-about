import { timingSafeEqual } from 'node:crypto';

import { revalidateTag } from 'next/cache';

import { UNTRACKED_TAG } from '@/sanity/lib/live';

// Sanity sync tags are short (`s1:RtF5FQ`) and a publish changes a handful; anything far past that is a bad payload
const MAX_SYNC_TAGS = 1000;
const MAX_SYNC_TAG_LENGTH = 100;

/**
 * Called by vomatt-admin's Sanity Function (`functions/invalidate-tags`) with
 * `{ syncTags }` once published content is queryable. Expires only the content
 * cached under the changed sync tags, plus content whose sync tags couldn't be
 * tracked (see `sanityFetch`). Route Handlers can't use `updateTag`; `{ expire: 0 }` drops
 * the entries so the next visitor gets fresh content, not one stale render.
 */
export async function POST(request: Request) {
	const secret = process.env.SANITY_REVALIDATE_SECRET;
	const expected = Buffer.from(`Bearer ${secret}`);
	const received = Buffer.from(request.headers.get('authorization') ?? '');
	if (!secret || received.length !== expected.length || !timingSafeEqual(received, expected)) {
		return Response.json({ revalidated: false }, { status: 401 });
	}

	const body = await request.json().catch(() => null);
	const syncTags: unknown = body?.syncTags;
	if (
		!Array.isArray(syncTags) ||
		syncTags.length > MAX_SYNC_TAGS ||
		!syncTags.every((tag) => typeof tag === 'string' && tag.length <= MAX_SYNC_TAG_LENGTH)
	) {
		return Response.json({ revalidated: false }, { status: 400 });
	}

	revalidateTag(UNTRACKED_TAG, { expire: 0 });
	for (const tag of syncTags) revalidateTag(`sanity:${tag}`, { expire: 0 });
	return Response.json({ revalidated: true });
}
