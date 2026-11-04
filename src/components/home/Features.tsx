import type { ReactNode } from 'react';

import { KeyRound, RefreshCw, Reply } from '@/components/ui/SvgIcons';
import { type Locale, LOCALES, locales } from '@/i18n/locales';
import { formatCount, MESSAGES } from '@/i18n/messages';
import { cn } from '@/lib/utils';

import type { HomeContent } from './content';
import { POLL, pollIn } from './poll';
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

/** The mock beside each feature, paired with pHome.features.items by index. */
function specimens(locale: Locale): ReactNode[] {
	const poll = pollIn(locale);
	const { features: copy, notice } = MESSAGES[locale].home;
	const [before, mention, after] = copy.comment;
	return [
		<div key="vote" className="flex w-full flex-col gap-2">
			<OptionRow text={poll.options[0].text} />
			<OptionRow text={poll.options[1].text} selected />
			<span className="flex items-center gap-2 text-[12px] text-muted-foreground">
				<RefreshCw className="size-3.5 shrink-0 text-input" />
				{copy.replaces(poll.options[0].text)}
			</span>
		</div>,
		<div key="discuss" className="flex w-full gap-2.5">
			<Avatar name="boba" className="size-7" />
			<div className="flex min-w-0 flex-col gap-1 text-[13px] leading-snug">
				<p>
					<span className="font-medium text-foreground">{copy.commentAuthor}</span>{' '}
					<span className="text-muted-foreground">{copy.commentAge}</span>
				</p>
				<p className="text-foreground">
					{before}
					<span className="font-medium">{mention}</span>
					{after}
				</p>
				<p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
					<Reply className="size-3.5" />
					{copy.replies}
				</p>
			</div>
		</div>,
		<div key="follow" className="flex w-full flex-col gap-3">
			<div className="flex items-center gap-2.5">
				<Avatar name="corgi" />
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-[14px] font-medium text-foreground">{copy.followName}</span>
					<span className="truncate text-[12px] text-muted-foreground tabular-nums">{copy.followMeta}</span>
				</div>
				<Pill pressed>{copy.follow}</Pill>
			</div>
			<div className="flex flex-wrap gap-1.5">
				<Pill pressed>{copy.topics[0]}</Pill>
				<Pill>{copy.topics[1]}</Pill>
			</div>
		</div>,
		<ResultsNotice
			key="notify"
			label={notice.title}
			title={poll.title}
			meta={notice.meta(poll.winner, formatCount(locale, POLL.turnout))}
			className="w-full"
		/>,
		<div key="passkey" className="flex w-full flex-col items-center gap-2.5">
			<span className="flex h-10 w-full items-center justify-center gap-2 rounded-(--radius) border border-border-strong bg-card text-[14px] font-medium text-foreground">
				<KeyRound className="size-4" />
				{copy.passkey}
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
		</div>,
		// The poll in this page's language first, then in the other
		<div key="languages" className="flex w-full flex-col gap-2.5">
			<span className="inline-flex self-start rounded-full bg-field p-0.5 text-[12px] font-medium">
				{locales.map((other) => (
					<span
						key={other}
						lang={LOCALES[other].htmlLang}
						className={
							other === locale ? 'rounded-full bg-card px-3 py-1 text-foreground shadow-sm' : 'px-3 py-1 text-muted-foreground'
						}
					>
						{LOCALES[other].label}
					</span>
				))}
			</span>
			{[locale, ...locales.filter((other) => other !== locale)].map((other) => (
				<span
					key={other}
					lang={LOCALES[other].htmlLang}
					className={cn(
						'text-[15px] leading-snug font-medium',
						other === locale ? 'text-foreground' : 'text-muted-foreground'
					)}
				>
					{pollIn(other).title}
				</span>
			))}
		</div>,
	];
}

export function Features({ content, locale }: { content: HomeContent['features']; locale: Locale }) {
	const mocks = specimens(locale);
	return (
		<section aria-labelledby="features-title" className="flex flex-col gap-10">
			<SectionHeading id="features-title" eyebrow={content.eyebrow} title={content.heading} intro={content.intro} />
			<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{content.items.map((feature, index) => (
					<li
						key={index}
						className="home-reveal flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 pb-5"
					>
						<div aria-hidden className="flex min-h-36 items-center rounded-xl bg-surface-soft p-4">
							{mocks[index]}
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
