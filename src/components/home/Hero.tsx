import { buttonVariants } from '@/components/ui/Button';
import { Lock, Plus } from '@/components/ui/SvgIcons';

import { HeroPoll } from './HeroPoll';
import { formatCount, POLL } from './poll';
import { appHref } from './shared';

/** The page's h1 beside a poll on vomatt: the question is the hero. */
export function Hero() {
	return (
		<section
			aria-labelledby="home-title"
			className="grid items-center gap-10 pt-2 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:pt-16"
		>
			<div className="flex flex-col items-start gap-5">
				<p className="inline-flex items-center gap-2 rounded-full border border-tide-line bg-tide-tint px-3 py-1.5 text-[13px] leading-4 font-medium text-tide-foreground">
					<Lock aria-hidden className="size-3.5 shrink-0 text-tide" />
					Ballots stay sealed until the poll closes
				</p>
				<h1 id="home-title" className="display-heading text-[36px] leading-[1.1] text-foreground md:text-[48px]">
					Ask everyone. Hear what they really think.
				</h1>
				<p className="max-w-[34rem] text-[17px] leading-[1.6] text-muted-foreground">
					Anyone can start a poll on vomatt, and anyone can vote. While it’s open, everyone sees how many people have
					voted but not how, so nobody votes with the crowd. When it closes, everyone sees the result.
				</p>
				<div className="flex flex-wrap gap-3 pt-1">
					<a href={appHref('/login')} className={buttonVariants({ variant: 'create', size: 'lg' })}>
						<Plus aria-hidden />
						Start a poll
					</a>
					<a href="#how-it-works" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
						How it works
					</a>
				</div>
			</div>

			<div
				role="img"
				aria-label={`An open poll on vomatt: “${POLL.title}” ${formatCount(POLL.turnout)} people have voted, and the results stay sealed until it ends on Friday.`}
				className="w-full"
			>
				<HeroPoll />
			</div>
		</section>
	);
}
