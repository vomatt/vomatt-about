'use client';

import { type MouseEvent, type ReactNode, useRef } from 'react';

import { ChevronDown } from '@/components/ui/SvgIcons';

const CLOSED_OPACITY = 0.4;

/**
 * One question on native <details>, its answer sliding open and shut. The height is animated in
 * script because only Chromium can transition to `height: auto`; without script it opens instantly.
 */
export function AccordionItem({ title, children }: { title?: string; children: ReactNode }) {
	const detailsRef = useRef<HTMLDetailsElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<Animation | null>(null);

	function toggle(event: MouseEvent) {
		const details = detailsRef.current;
		const panel = panelRef.current;
		if (!details || !panel || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		event.preventDefault();

		// A click mid-slide reverses it from the height and opacity it has reached
		const opening = !details.open || details.hasAttribute('data-closing');
		const style = getComputedStyle(panel);
		const from = details.open ? panel.getBoundingClientRect().height : 0;
		const fromOpacity = details.open ? Number(style.opacity) : CLOSED_OPACITY;
		const easing = style.getPropertyValue('--ease-settle').trim() || 'ease-out';
		animationRef.current?.cancel();
		details.open = true;
		details.toggleAttribute('data-closing', !opening);
		const to = opening ? panel.scrollHeight : 0;

		// Clipped only while it slides, so a focused link's outline shows once it's open
		const animation = panel.animate(
			{
				height: [`${from}px`, `${to}px`],
				opacity: [fromOpacity, opening ? 1 : CLOSED_OPACITY],
				overflow: ['hidden', 'hidden'],
			},
			{ duration: 280, easing }
		);
		animation.onfinish = () => {
			if (!opening) details.open = false;
			details.removeAttribute('data-closing');
			animationRef.current = null;
		};
		animationRef.current = animation;
	}

	return (
		<details ref={detailsRef} className="group">
			<summary
				onClick={toggle}
				className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-[18px] py-3.5 item-title leading-[1.4] text-foreground outline-none transition-colors hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
			>
				{title}
				<ChevronDown
					aria-hidden
					className="size-4 shrink-0 text-muted-foreground group-[[open]:not([data-closing])]:rotate-180 motion-safe:transition-transform motion-safe:duration-[280ms] motion-safe:ease-(--ease-settle)"
				/>
			</summary>
			<div ref={panelRef}>
				<div className="px-[18px] pb-4 text-[15px] leading-[1.6] text-muted-foreground [&>*+*]:mt-3">
					{children}
				</div>
			</div>
		</details>
	);
}
