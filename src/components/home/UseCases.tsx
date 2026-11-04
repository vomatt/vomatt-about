import type { Locale } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';
import { cn } from '@/lib/utils';

import type { HomeContent } from './content';
import { Avatar, chipClassName } from './ProductUI';
import { SectionHeading } from './shared';

// Who asks each example poll, paired with pHome.useCases.items by index
const AVATARS = ['deer', 'bear', 'egg', 'corgi'];

export function UseCases({ content, locale }: { content: HomeContent['useCases']; locale: Locale }) {
	const mocks = MESSAGES[locale].home.useCases;
	return (
		<section aria-labelledby="use-cases-title" className="flex flex-col gap-10">
			<SectionHeading
				id="use-cases-title"
				eyebrow={content.eyebrow}
				title={content.heading}
				intro={content.intro}
			/>
			{/* Each item spans two rows of the grid, so the cards line up across a row whatever the text above them */}
			<ul className="grid gap-x-4 gap-y-10 md:grid-cols-2 md:gap-y-12">
				{content.items.map((useCase, index) => (
					<li key={index} className="home-reveal row-span-2 grid grid-rows-subgrid gap-4">
						<div className="flex flex-col gap-1.5">
							<h3 className="item-title leading-[1.4] text-foreground">{useCase.who}</h3>
							<p className="text-[15px] leading-[1.6] text-muted-foreground">{useCase.body}</p>
						</div>
						{/* An example poll: its question, who asked and how it's shared */}
						<div className="flex flex-col rounded-2xl border border-border bg-card">
							<div className="flex flex-1 flex-col gap-3 p-5">
								<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
									<span className="flex min-w-0 items-center gap-2.5 text-[14px] font-medium text-foreground">
										<Avatar name={AVATARS[index]} className="size-7" />
										<span className="truncate">{mocks[index].author}</span>
									</span>
									<span className={cn(chipClassName, 'bg-status-open-ends text-[10px]')}>{mocks[index].ends}</span>
								</div>
								<p className="poll-title text-foreground">{useCase.question}</p>
							</div>
							<p className="flex min-h-11 items-center border-t border-border px-5 text-[14px] text-muted-foreground tabular-nums">
								{mocks[index].meta}
							</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
