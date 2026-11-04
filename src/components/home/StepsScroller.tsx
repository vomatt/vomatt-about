'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { observe } from 'react-intersection-observer';

import type { Locale } from '@/i18n/locales';

import { prefersReducedMotion } from './motion';
import { POLL } from './poll';
import { PollMock, type PollStep } from './PollMock';

export type Step = { title: string; body: string };

/**
 * Calls `onChange` with how many of `elements` have reached the line `rootMargin` draws across
 * the viewport, as they scroll past it. One scrolled above the viewport stays reached.
 */
function watchReached(elements: (HTMLElement | null)[], rootMargin: string, onChange: (count: number) => void) {
	const reached = elements.map(() => false);
	const stops = elements.map((element, index) =>
		element
			? observe(
					element,
					(inView, entry) => {
						reached[index] = inView || entry.boundingClientRect.top < 0;
						onChange(reached.lastIndexOf(true) + 1);
					},
					{ rootMargin }
				)
			: () => {}
	);
	return () => stops.forEach((stop) => stop());
}

const turnoutAt = (step: PollStep) => (step >= 2 ? POLL.turnout : 0);

/**
 * The three steps, each with the poll card at that step. On wide screens one card (the stage) sticks
 * beside the steps instead and moves to the last step whose top has scrolled above 60% of the screen.
 * The server renders every card in its own step's final state, so the steps read fully without script.
 */
export function StepsScroller({ header, steps, locale }: { header: ReactNode; steps: Step[]; locale: Locale }) {
	const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
	// null until the observers first report: until then each card shows its step's final state
	const [activeStep, setActiveStep] = useState<number | null>(null);
	const [cardsReached, setCardsReached] = useState<number | null>(null);

	useEffect(() => {
		// With reduced motion nothing waits for the scroll: every card keeps its final state
		if (prefersReducedMotion()) return;
		const stopSteps = watchReached(stepRefs.current, '0px 0px -40% 0px', setActiveStep);
		const stopCards = watchReached(cardRefs.current, '0px 0px -25% 0px', setCardsReached);
		return () => {
			stopSteps();
			stopCards();
		};
	}, []);

	const stageStep = (activeStep ?? 1) as PollStep;

	return (
		<div className="home-scroller">
			{/* The heading shares the steps' column, so the stage is in view beside it before step 1 starts */}
			<div className="home-steps">
				{header}
				<ol className="home-step-list">
					{steps.map((step, index) => {
						const number = (index + 1) as PollStep;
						// A card waits in the step before its own until it scrolls into view, then moves on
						const cardStep = (cardsReached === null || cardsReached >= number ? number : number - 1) as PollStep;
						return (
							<li
								key={index}
								ref={(element) => {
									stepRefs.current[index] = element;
								}}
								data-reached={(activeStep ?? 0) >= number || undefined}
								className="home-step"
							>
								<div className="flex max-w-[30rem] flex-col gap-3">
									{/* The list already numbers the steps for screen readers */}
									<span
										aria-hidden
										className="home-step-number grid size-8 place-items-center rounded-full border border-border-strong bg-card text-[13px] font-medium text-foreground tabular-nums"
									>
										{number}
									</span>
									<h3 className="poll-title text-foreground md:text-[25px]">{step.title}</h3>
									<p className="text-[17px] leading-[1.6] text-muted-foreground">{step.body}</p>
								</div>
								<div
									ref={(element) => {
										cardRefs.current[index] = element;
									}}
									aria-hidden
									className="home-inline-card"
								>
									<PollMock locale={locale} step={cardStep} turnout={turnoutAt(cardStep)} notify={number === 3} />
								</div>
							</li>
						);
					})}
				</ol>
			</div>
			<div aria-hidden className="home-stage">
				<div className="home-stage-sticky">
					<PollMock locale={locale} step={stageStep} turnout={turnoutAt(stageStep)} notify />
				</div>
			</div>
		</div>
	);
}
