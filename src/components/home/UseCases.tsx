import { cn } from '@/lib/utils';

import { Avatar, chipClassName } from './ProductUI';
import { SectionHeading } from './shared';

const USE_CASES = [
	{
		who: 'Teams',
		body: 'Ask the whole team, not only the people who speak first in the meeting.',
		avatar: 'deer',
		author: '@studio_ops',
		ends: 'Ends Thu 18:00',
		question: 'Should we move stand-up to 10:00?',
		meta: '18 voted · invite only',
	},
	{
		who: 'Clubs',
		body: 'Share one link with members. Nobody can see which choice is ahead.',
		avatar: 'bear',
		author: '@northside_books',
		ends: 'Ends Sun 21:00',
		question: 'Which book do we read in March?',
		meta: '42 voted · unlisted',
	},
	{
		who: 'Neighbourhoods',
		body: 'Hear from the whole street before the council meeting, not just the regulars.',
		avatar: 'egg',
		author: '@elm_street',
		ends: 'Ends Mon 09:00',
		question: 'Should Elm Street close to cars on Sunday mornings?',
		meta: '326 voted',
	},
	{
		who: 'Friends',
		body: 'Settle where to eat without the loudest friend deciding for everyone.',
		avatar: 'corgi',
		author: '@jtan',
		ends: 'Ends in 6h',
		question: 'Where are we eating on Saturday?',
		meta: '7 voted · unlisted',
	},
];

export function UseCases() {
	return (
		<section aria-labelledby="use-cases-title" className="flex flex-col gap-10">
			<SectionHeading
				id="use-cases-title"
				eyebrow="Who it’s for"
				title="For any group with a question"
				intro="Ask in public, share a link, or invite only the people who should answer."
			/>
			{/* Each item spans two rows of the grid, so the cards line up across a row whatever the text above them */}
			<ul className="grid gap-x-4 gap-y-10 md:grid-cols-2 md:gap-y-12">
				{USE_CASES.map((useCase) => (
					<li key={useCase.who} className="home-reveal row-span-2 grid grid-rows-subgrid gap-4">
						<div className="flex flex-col gap-1.5">
							<h3 className="item-title leading-[1.4] text-foreground">{useCase.who}</h3>
							<p className="text-[15px] leading-[1.6] text-muted-foreground">{useCase.body}</p>
						</div>
						{/* An example poll: its question, who asked and how it's shared */}
						<div className="flex flex-col rounded-2xl border border-border bg-card">
							<div className="flex flex-1 flex-col gap-3 p-5">
								<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
									<span className="flex min-w-0 items-center gap-2.5 text-[14px] font-medium text-foreground">
										<Avatar name={useCase.avatar} className="size-7" />
										<span className="truncate">{useCase.author}</span>
									</span>
									<span className={cn(chipClassName, 'bg-status-open-ends text-[10px]')}>{useCase.ends}</span>
								</div>
								<p className="poll-title text-foreground">{useCase.question}</p>
							</div>
							<p className="flex min-h-11 items-center border-t border-border px-5 text-[14px] text-muted-foreground tabular-nums">
								{useCase.meta}
							</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
