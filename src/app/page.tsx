import '@/components/home/home.css';

import type { Metadata, ResolvingMetadata } from 'next';

import { Features } from '@/components/home/Features';
import { FinalCta } from '@/components/home/FinalCta';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { UseCases } from '@/components/home/UseCases';
import { VotePromise } from '@/components/home/VotePromise';
import { WhySealed } from '@/components/home/WhySealed';

const DESCRIPTION =
	'Start a poll and let everyone vote. Ballots stay sealed while it’s open, so nobody votes with the crowd, and everyone sees the result when it closes.';

// The share image, site name and locale come from the root layout (Sanity's settings); only the words change
export async function generateMetadata(_props: PageProps<'/'>, parent: ResolvingMetadata): Promise<Metadata> {
	const { openGraph } = await parent;
	const title = `${openGraph?.siteName || 'vomatt'}: public polls with sealed ballots`;

	return {
		title: { absolute: title },
		description: DESCRIPTION,
		alternates: { canonical: '/' },
		openGraph: {
			title,
			description: DESCRIPTION,
			url: '/',
			siteName: openGraph?.siteName,
			images: openGraph?.images,
			videos: openGraph?.videos,
			locale: 'en_US',
			type: 'website',
		},
	};
}

export default function HomePage() {
	return (
		// Wide frame: the header, footer and main column take the page width (max-w-page) here
		<div data-wide-frame className="flex flex-col gap-24 md:gap-32">
			<Hero />
			<HowItWorks />
			<WhySealed />
			<Features />
			<UseCases />
			<VotePromise />
			<FinalCta />
		</div>
	);
}
