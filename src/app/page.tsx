import { sanityFetch } from '@/sanity/lib/live';
import { pageHomeQuery } from '@/sanity/lib/queries';

// Page modules render once the page builder moves over; until then the title proves the read side
export default async function Home() {
	const { data } = await sanityFetch({ query: pageHomeQuery });

	return (
		<main className="mx-auto max-w-3xl px-4 py-24">
			<h1 className="display-heading text-[48px]">{data?.title}</h1>
		</main>
	);
}
