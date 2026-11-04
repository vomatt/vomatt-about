import type { CSSProperties } from 'react';

import { Eye, Lock } from '@/components/ui/SvgIcons';
import { cn } from '@/lib/utils';

import { formatCount, POLL } from './poll';
import { BallotMark } from './ProductUI';
import { SectionHeading } from './shared';

// The same poll with the count on show: the early leader pulls later votes toward it as the card scrolls by
const HERD = [
	{ text: 'Thursday', from: 36, to: 64 },
	{ text: 'Friday', from: 34, to: 25 },
	{ text: 'Sunday', from: 30, to: 11 },
];

function Panel({
	label,
	icon,
	title,
	body,
	className,
	children,
}: {
	label: string;
	icon: React.ReactNode;
	title: string;
	body: string;
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
				<p className="item-title leading-[1.35] text-foreground">{POLL.title}</p>
				{children}
			</div>
			<div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-5">
				<h3 className="item-title leading-[1.4] text-foreground">{title}</h3>
				<p className="text-[15px] leading-[1.6] text-muted-foreground">{body}</p>
			</div>
		</div>
	);
}

export function WhySealed() {
	return (
		<section aria-labelledby="why-sealed-title" className="flex flex-col gap-10">
			<SectionHeading
				id="why-sealed-title"
				eyebrow="Why sealed"
				title="A running count changes the answer"
				intro="When people can see who’s ahead, later voters drift toward the leader. Sealing the ballots keeps every vote the voter’s own."
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<Panel
					label="Polls with a running count"
					icon={<Eye aria-hidden className="size-4" />}
					title="The count shows, so people follow it"
					body="Early votes set the direction. Everyone after them sees who’s winning and joins in, so the result mostly says who voted first."
					className="home-herd"
				>
					<ul className="space-y-2">
						{HERD.map((row) => (
							<li
								key={row.text}
								style={{ '--from': row.from, '--to': row.to } as CSSProperties}
								className="home-herd-row relative flex min-h-11 items-center justify-between gap-3 overflow-hidden rounded-xl border border-border px-4 text-[15px] font-medium text-foreground"
							>
								<span className="home-herd-bar" />
								<span className="relative">{row.text}</span>
								<span className="home-herd-share relative text-[14px] text-muted-foreground tabular-nums" />
							</li>
						))}
					</ul>
					<p className="flex items-center justify-between gap-3 text-[14px] text-muted-foreground">
						<span className="flex min-w-0 items-center gap-2">
							<Eye className="size-4 shrink-0" />
							Updates with every vote
						</span>
						<span className="shrink-0 tabular-nums">{formatCount(POLL.turnout)} voted</span>
					</p>
				</Panel>

				<Panel
					label="Polls on vomatt"
					icon={<Lock aria-hidden className="size-4 text-tide" />}
					title="The count is sealed, so people decide"
					body="Everyone sees how many people have voted, and nobody sees the count until it closes. Each vote says what that voter thinks."
				>
					<ul className="space-y-2">
						{POLL.options.map((option) => (
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
							Sealed until Fri 20:00
						</span>
						<span className="shrink-0 tabular-nums">{formatCount(POLL.turnout)} voted</span>
					</p>
				</Panel>
			</div>
		</section>
	);
}
