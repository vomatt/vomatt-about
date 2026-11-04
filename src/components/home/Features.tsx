import type { ReactNode } from 'react';

import { KeyRound, RefreshCw, Reply } from '@/components/ui/SvgIcons';
import { cn } from '@/lib/utils';

import { formatCount, POLL } from './poll';
import { Avatar, BallotMark, ResultsNotice } from './ProductUI';
import { SectionHeading } from './shared';

function OptionRow({ text, selected = false }: { text: string; selected?: boolean }) {
	return (
		<span
			className={cn(
				'flex h-10 items-center gap-3 rounded-xl px-3.5 text-[14px] font-medium text-foreground',
				selected ? 'border-[1.5px] border-primary bg-highlight-tint' : 'border border-border bg-card'
			)}
		>
			<BallotMark selected={selected} />
			{text}
		</span>
	);
}

function Pill({ pressed = false, children }: { pressed?: boolean; children: ReactNode }) {
	return (
		<span
			className={cn(
				'inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium',
				pressed ? 'border-primary bg-primary text-primary-foreground' : 'border-border-strong bg-card text-foreground'
			)}
		>
			{children}
		</span>
	);
}

const FEATURES: { title: ReactNode; body: string; specimen: ReactNode }[] = [
	{
		title: 'Change your mind until it closes',
		body: 'Pick another option to update your vote, or withdraw it. Only your last vote counts, and it stays sealed.',
		specimen: (
			<div className="flex w-full flex-col gap-2">
				<OptionRow text="Thursday" />
				<OptionRow text="Friday" selected />
				<span className="flex items-center gap-2 text-[12px] text-muted-foreground">
					<RefreshCw className="size-3.5 shrink-0 text-input" />
					Replaces your vote for Thursday
				</span>
			</div>
		),
	},
	{
		title: 'Talk it through',
		body: 'Explain your choice in the discussion under each poll. Reply to others, and @mention people to bring them in.',
		specimen: (
			<div className="flex w-full gap-2.5">
				<Avatar name="boba" className="size-7" />
				<div className="flex min-w-0 flex-col gap-1 text-[13px] leading-snug">
					<p>
						<span className="font-medium text-foreground">@mina</span>{' '}
						<span className="text-muted-foreground">· 2h</span>
					</p>
					<p className="text-foreground">
						Friday, so the stalls can stay open late. <span className="font-medium">@jtan</span> would that work for
						you?
					</p>
					<p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
						<Reply className="size-3.5" />
						Reply · 3 replies
					</p>
				</div>
			</div>
		),
	},
	{
		title: 'Follow people and topics',
		body: 'Polls from people you follow join your Following feed. Following never shows anyone how you voted.',
		specimen: (
			<div className="flex w-full flex-col gap-3">
				<div className="flex items-center gap-2.5">
					<Avatar name="corgi" />
					<div className="flex min-w-0 flex-1 flex-col">
						<span className="truncate text-[14px] font-medium text-foreground">Jun Tan</span>
						<span className="truncate text-[12px] text-muted-foreground tabular-nums">@jtan · 128 followers</span>
					</div>
					<Pill pressed>Follow</Pill>
				</div>
				<div className="flex flex-wrap gap-1.5">
					<Pill pressed>Neighbourhood</Pill>
					<Pill>Markets</Pill>
				</div>
			</div>
		),
	},
	{
		title: 'Hear when results are in',
		body: 'When a poll you voted on closes, a notification brings you the result.',
		specimen: (
			<ResultsNotice title={POLL.title} meta={`Thursday won · ${formatCount(POLL.turnout)} voted · now`} className="w-full" />
		),
	},
	{
		title: 'No password to remember',
		body: 'Sign in with a passkey on your device, or with a code we send to your email.',
		specimen: (
			<div className="flex w-full flex-col items-center gap-2.5">
				<span className="flex h-10 w-full items-center justify-center gap-2 rounded-(--radius) border border-border-strong bg-card text-[14px] font-medium text-foreground">
					<KeyRound className="size-4" />
					Continue with a passkey
				</span>
				<span className="flex gap-1.5">
					{['4', '8', '1', '2', '0', '7'].map((digit, index) => (
						<span
							key={index}
							className="grid h-9 w-7 place-items-center rounded-lg border border-input bg-card text-[15px] text-foreground tabular-nums"
						>
							{digit}
						</span>
					))}
				</span>
			</div>
		),
	},
	{
		title: (
			<>
				English and <span lang="zh-Hant">繁體中文</span>
			</>
		),
		body: 'Use vomatt in English or Traditional Chinese, and switch whenever you like.',
		specimen: (
			<div className="flex w-full flex-col gap-2.5">
				<span className="inline-flex self-start rounded-full bg-field p-0.5 text-[12px] font-medium">
					<span className="rounded-full bg-card px-3 py-1 text-foreground shadow-sm">English</span>
					<span lang="zh-Hant" className="px-3 py-1 text-muted-foreground">
						繁體中文
					</span>
				</span>
				<span className="text-[15px] leading-snug font-medium text-foreground">{POLL.title}</span>
				<span lang="zh-Hant" className="text-[15px] leading-snug font-medium text-muted-foreground">
					市集要改到哪一晚？
				</span>
			</div>
		),
	},
];

export function Features() {
	return (
		<section aria-labelledby="features-title" className="flex flex-col gap-10">
			<SectionHeading
				id="features-title"
				eyebrow="Around the ballot"
				title="Everything a fair poll needs, nothing it doesn’t"
			/>
			<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map((feature, index) => (
					<li
						key={index}
						className="home-reveal flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 pb-5"
					>
						<div aria-hidden className="flex min-h-36 items-center rounded-xl bg-surface-soft p-4">
							{feature.specimen}
						</div>
						<div className="flex flex-col gap-1.5 px-1">
							<h3 className="item-title leading-[1.4] text-foreground">{feature.title}</h3>
							<p className="text-[14px] leading-[1.55] text-muted-foreground">{feature.body}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
