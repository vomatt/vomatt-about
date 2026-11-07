'use client';

import type { CSSProperties } from 'react';

import { Bookmark, Check, Lock, MessageSquare, Share } from '@/components/ui/SvgIcons';
import { TidePanel } from '@/components/ui/TidePanel';
import type { Locale } from '@/i18n/locales';
import { formatCount, MESSAGES } from '@/i18n/messages';
import { cn } from '@/lib/utils';

import { useCountUp } from './motion';
import { POLL, pollIn } from './poll';
import { Avatar, BallotMark, chipClassName, ElectedStamp, ResultsNotice, SealMark, YourVotePill } from './ProductUI';

/** 0 the creator's empty form, 1 asked, 2 voted and sealed, 3 closed and revealed. */
export type PollStep = 0 | 1 | 2 | 3;

// The bars' fill in home.css: 800ms, 120ms in, 80ms apart; the percentages count alongside
const BAR_DURATION = 800;
const BAR_STAGGER = 80;
const BAR_DELAY = 120;

function Percent({ value, show, index }: { value: number; show: boolean; index: number }) {
	const shown = useCountUp(show ? value : 0, BAR_DURATION, BAR_DELAY + index * BAR_STAGGER);
	return <>{shown}%</>;
}

type PollMockProps = {
	locale: Locale;
	step: PollStep;
	/** The turnout to show (and count to from the last one). */
	turnout: number;
	/** The results notification under the card once the poll closes. */
	notify?: boolean;
};

/**
 * A poll card as vomatt-web draws it, in any step from the empty form to the revealed result.
 * Every step's elements are always in the markup, stacked in shared cells, so moving between
 * steps never changes the card's height; home.css shows and moves them by `data-step`.
 */
export function PollMock({ locale, step, turnout, notify = false }: PollMockProps) {
	const shownTurnout = useCountUp(turnout, 1600, 250);
	const poll = pollIn(locale);
	const { pollCard: copy, notice } = MESSAGES[locale].home;
	const turnoutCount = formatCount(locale, POLL.turnout);

	return (
		<div data-step={step} className="home-mock flex flex-col gap-3">
			<div className="rounded-2xl border border-border bg-card text-left">
				<div className="flex flex-col gap-4 p-5 md:gap-5 md:px-7 md:pt-6">
					<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
						<div className="flex min-w-0 items-center gap-2.5 text-[14px] text-muted-foreground">
							<Avatar name="bao" className="size-7" />
							<span className="truncate font-medium text-foreground">{poll.author}</span>
							<span className="shrink-0">{copy.age}</span>
						</div>
						<div className="flex shrink-0 items-center">
							{/* Takes no room until the vote is in, so the status chip keeps its place on a wrapped line */}
							<span className="home-slot home-slot-voted">
								<span>
									<span className={cn('home-voted mr-2', chipClassName, 'bg-highlight text-highlight-foreground')}>
										<Check size={10} strokeWidth={3} />
										{copy.voted}
									</span>
								</span>
							</span>
							{/* One chip whose words follow the step: open until Friday, then ended */}
							<span
								className={cn(
									'home-chip',
									chipClassName,
									step === 3 ? 'bg-status-ended' : 'bg-status-open-ends'
								)}
							>
								{step === 3 && <span className="size-1.5 rounded-full bg-current" />}
								{step === 3 ? copy.ended : copy.ends}
							</span>
						</div>
					</div>

					<div className="home-stack">
						<p className="home-placeholder poll-title text-muted-foreground">{copy.questionPlaceholder}</p>
						<p className="home-question poll-title text-foreground md:text-[25px]">{poll.title}</p>
					</div>

					<ul className="space-y-2.5">
						{poll.options.map((option, index) => (
							<li
								key={option.text}
								style={{ '--i': index, '--share': option.percent / 100 } as CSSProperties}
								className="relative flex min-h-14 items-center overflow-hidden rounded-xl px-5 py-2.5 text-[16px] font-medium"
							>
								<span className="home-row-frame" />
								<span className="home-bar" />
								{option.mine && <span className="home-chosen" />}
								{/* The ballot mark's room; on the result only the winner keeps some, for its stamp */}
								<span className={cn('home-lead relative', option.winner && 'home-lead-winner')}>
									<span className="home-stack place-items-center">
										<span className="home-mark">
											<BallotMark />
										</span>
										{option.mine && (
											<span className="home-mark home-check">
												<BallotMark selected />
											</span>
										)}
										{option.winner && <ElectedStamp className="home-stamp" />}
									</span>
								</span>
								<span className="home-stack relative min-w-0 flex-1">
									<span className="home-placeholder text-muted-foreground">{copy.optionPlaceholder(index + 1)}</span>
									<span className="home-option-text">{option.text}</span>
								</span>
								{option.mine && (
									<span className="home-slot home-slot-mine relative">
										<span>
											<YourVotePill label={copy.yourVote} className="home-your-vote ml-3 inline-block" />
										</span>
									</span>
								)}
								<span
									className={cn(
										'home-percent relative ml-3 shrink-0 text-right text-[14px] tabular-nums',
										!option.winner && 'text-muted-foreground'
									)}
								>
									<Percent value={option.percent} show={step === 3} index={index} />
								</span>
							</li>
						))}
					</ul>

					<div className="home-stack items-start border-t border-border pt-4 md:pt-5">
						<div className="home-vote-row flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
							<p className="flex min-w-0 items-center gap-2.5 text-[14px] leading-5 text-tide-foreground">
								<Lock className="size-[18px] shrink-0 text-tide" />
								{copy.revealHint}
							</p>
							{/* Disabled until an option is chosen, as in the app */}
							<span className="ml-auto inline-flex h-11 min-w-[132px] items-center justify-center rounded-(--radius) bg-secondary px-4 text-[15px] font-medium text-muted-foreground">
								{copy.vote}
							</span>
						</div>
						<TidePanel className="home-seal-row">
							<div className="flex items-center gap-4 py-3.5 pr-3.5 pl-4">
								<SealMark size="md" />
								<div className="flex min-w-0 flex-col gap-0.5">
									<p className="text-[14px] leading-5 font-medium text-foreground">{copy.sealedTitle}</p>
									<p className="text-[13px] leading-snug">{copy.sealedBody}</p>
								</div>
							</div>
						</TidePanel>
						<p className="home-caption text-[14px] leading-5 text-muted-foreground">
							{copy.won(poll.winner, turnoutCount)}
						</p>
					</div>
				</div>

				<div className="home-footer-text flex flex-wrap items-center gap-x-4 border-t border-border px-5 py-1 text-[14px] text-muted-foreground md:px-7">
					<span className="tabular-nums">{copy.votedCount(formatCount(locale, shownTurnout))}</span>
					<span className="flex min-h-11 items-center gap-2">
						<MessageSquare className="size-[18px]" />
						{step >= 2 ? copy.comments : copy.discuss}
					</span>
					<span className="ml-auto flex items-center gap-5">
						<Bookmark className="size-[18px]" />
						<Share className="size-[18px]" />
					</span>
				</div>
			</div>

			{notify && (
				<ResultsNotice
					label={notice.title}
					title={poll.title}
					meta={notice.meta(poll.winner, turnoutCount)}
					className="home-notice"
				/>
			)}
		</div>
	);
}
