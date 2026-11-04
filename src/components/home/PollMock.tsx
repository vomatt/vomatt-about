'use client';

import type { CSSProperties } from 'react';

import { Bookmark, Check, Lock, MessageSquare, Share } from '@/components/ui/SvgIcons';
import { TidePanel } from '@/components/ui/TidePanel';
import { cn } from '@/lib/utils';

import { useCountUp } from './motion';
import { formatCount, POLL } from './poll';
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
export function PollMock({ step, turnout, notify = false }: PollMockProps) {
	const shownTurnout = useCountUp(turnout, 1600, 250);

	return (
		<div data-step={step} className="home-mock flex flex-col gap-3">
			<div className="rounded-2xl border border-border bg-card text-left">
				<div className="flex flex-col gap-4 p-5 md:gap-5 md:px-7 md:pt-6">
					<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
						<div className="flex min-w-0 items-center gap-2.5 text-[14px] text-muted-foreground">
							<Avatar name="bao" className="size-7" />
							<span className="truncate font-medium text-foreground">{POLL.author}</span>
							<span className="shrink-0">· 2d</span>
						</div>
						<div className="flex shrink-0 items-center">
							{/* Takes no room until the vote is in, so the status chip keeps its place on a wrapped line */}
							<span className="home-slot home-slot-voted">
								<span>
									<span className={cn('home-voted mr-2', chipClassName, 'bg-highlight text-[10px] text-highlight-foreground')}>
										<Check size={12} strokeWidth={3} />
										Voted
									</span>
								</span>
							</span>
							{/* One chip whose words follow the step: open until Friday, then ended */}
							<span
								className={cn(
									'home-chip',
									chipClassName,
									'text-[10px]',
									step === 3 ? 'bg-status-ended' : 'bg-status-open-ends'
								)}
							>
								{step === 3 && <span className="size-1.5 rounded-full bg-current" />}
								{step === 3 ? 'Ended Fri' : 'Ends Fri 20:00'}
							</span>
						</div>
					</div>

					<div className="home-stack">
						<p className="home-placeholder poll-title text-muted-foreground">Your question</p>
						<p className="home-question poll-title text-foreground md:text-[25px]">{POLL.title}</p>
					</div>

					<ul className="space-y-2.5">
						{POLL.options.map((option, index) => (
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
									<span className="home-placeholder text-muted-foreground">Option {index + 1}</span>
									<span className="home-option-text">{option.text}</span>
								</span>
								{option.mine && (
									<span className="home-slot home-slot-mine relative">
										<span>
											<YourVotePill className="home-your-vote ml-3 inline-block" />
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
								Results are revealed when the poll ends
							</p>
							{/* Disabled until an option is chosen, as in the app */}
							<span className="ml-auto inline-flex h-11 min-w-[132px] items-center justify-center rounded-(--radius) bg-secondary px-4 text-[15px] font-medium text-muted-foreground">
								Vote
							</span>
						</div>
						<TidePanel className="home-seal-row">
							<div className="flex items-center gap-4 py-3.5 pr-3.5 pl-4">
								<SealMark size="md" />
								<div className="flex min-w-0 flex-col gap-0.5">
									<p className="text-[14px] leading-5 font-medium text-foreground">Sealed. Thank you.</p>
									<p className="text-[13px] leading-snug">Results are sealed until Fri 20:00.</p>
								</div>
							</div>
						</TidePanel>
						<p className="home-caption text-[14px] leading-5 text-muted-foreground">
							“Thursday” won. {formatCount(POLL.turnout)} people decided this.
						</p>
					</div>
				</div>

				<div className="home-footer-text flex flex-wrap items-center gap-x-4 border-t border-border px-5 py-1 text-[14px] text-muted-foreground md:px-7">
					<span className="tabular-nums">{formatCount(shownTurnout)} voted</span>
					<span className="flex min-h-11 items-center gap-2">
						<MessageSquare className="size-[18px]" />
						{step >= 2 ? '36 comments' : 'Discuss'}
					</span>
					<span className="ml-auto flex items-center gap-5">
						<Bookmark className="size-[18px]" />
						<Share className="size-[18px]" />
					</span>
				</div>
			</div>

			{notify && (
				<ResultsNotice
					title={POLL.title}
					meta={`Thursday won · ${formatCount(POLL.turnout)} voted · now`}
					className="home-notice"
				/>
			)}
		</div>
	);
}
