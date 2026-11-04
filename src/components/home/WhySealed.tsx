import type { CSSProperties } from 'react';

import { Eye, Lock } from '@/components/ui/SvgIcons';
import type { Locale } from '@/i18n/locales';
import { formatCount, MESSAGES } from '@/i18n/messages';
import { cn } from '@/lib/utils';

import type { HomeContent } from './content';
import { POLL, pollIn } from './poll';
import { BallotMark } from './ProductUI';
import { SectionHeading } from './shared';

// The same poll with the count on show, option by option: the early leader pulls later votes toward it as the card scrolls by
const HERD = [
	{ from: 36, to: 64 },
	{ from: 34, to: 25 },
	{ from: 30, to: 11 },
];

function Panel({
	content: { label, title, body },
	pollTitle,
	icon,
	className,
	children,
}: {
	content: HomeContent['whySealed']['sealed'];
	pollTitle: string;
	icon: React.ReactNode;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn('home-reveal flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-7', className)}>
			<p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
				{icon}
				{label}
			</p>
			<div aria-hidden className="flex flex-col gap-3">
				<p className="item-title leading-[1.35] text-foreground">{pollTitle}</p>
				{children}
			</div>
			<div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-5">
				<h3 className="item-title leading-[1.4] text-foreground">{title}</h3>
				<p className="text-[15px] leading-[1.6] text-muted-foreground">{body}</p>
			</div>
		</div>
	);
}

export function WhySealed({ content, locale }: { content: HomeContent['whySealed']; locale: Locale }) {
	const poll = pollIn(locale);
	const copy = MESSAGES[locale].home;
	const voted = copy.pollCard.votedCount(formatCount(locale, POLL.turnout));
	return (
		<section aria-labelledby="why-sealed-title" className="flex flex-col gap-10">
			<SectionHeading
				id="why-sealed-title"
				eyebrow={content.eyebrow}
				title={content.heading}
				intro={content.intro}
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<Panel
					content={content.openCount}
					pollTitle={poll.title}
					icon={<Eye aria-hidden className="size-4" />}
					className="home-herd"
				>
					<ul className="space-y-2">
						{HERD.map((row, index) => (
							<li
								key={index}
								style={{ '--from': row.from, '--to': row.to } as CSSProperties}
								className="home-herd-row relative flex min-h-11 items-center justify-between gap-3 overflow-hidden rounded-xl border border-border px-4 text-[15px] font-medium text-foreground"
							>
								<span className="home-herd-bar" />
								<span className="relative">{poll.options[index].text}</span>
								<span className="home-herd-share relative text-[14px] text-muted-foreground tabular-nums" />
							</li>
						))}
					</ul>
					<p className="flex items-center justify-between gap-3 text-[14px] text-muted-foreground">
						<span className="flex min-w-0 items-center gap-2">
							<Eye className="size-4 shrink-0" />
							{copy.whySealed.live}
						</span>
						<span className="shrink-0 tabular-nums">{voted}</span>
					</p>
				</Panel>

				<Panel
					content={content.sealed}
					pollTitle={poll.title}
					icon={<Lock aria-hidden className="size-4 text-tide" />}
				>
					<ul className="space-y-2">
						{poll.options.map((option) => (
							<li
								key={option.text}
								className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-4 text-[15px] font-medium text-foreground"
							>
								<BallotMark className="size-[18px]" />
								{option.text}
							</li>
						))}
					</ul>
					<p className="flex items-center justify-between gap-3 text-[14px] text-muted-foreground">
						<span className="flex min-w-0 items-center gap-2 text-tide-foreground">
							<Lock className="size-4 shrink-0 text-tide" />
							{copy.whySealed.sealedUntil}
						</span>
						<span className="shrink-0 tabular-nums">{voted}</span>
					</p>
				</Panel>
			</div>
		</section>
	);
}
