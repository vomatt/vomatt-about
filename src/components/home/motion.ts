'use client';

import { useEffect, useRef, useState } from 'react';

export function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * `target`, counted to from the value shown before it changed. The first render (and the server's)
 * shows `target` itself; with reduced motion every change lands at once.
 */
export function useCountUp(target: number, duration: number, delay = 0) {
	const [value, setValue] = useState(target);
	const shown = useRef(target);

	useEffect(() => {
		const from = shown.current;
		if (from === target) return;
		const length = prefersReducedMotion() ? 0 : duration;
		const start = performance.now() + (length ? delay : 0);
		let frame = requestAnimationFrame(function tick(now) {
			const progress = length ? Math.min(1, Math.max(0, (now - start) / length)) : 1;
			// Ease out: quick at first, the last numbers tick over slowly
			const next = Math.round(from + (target - from) * (1 - (1 - progress) ** 3));
			shown.current = next;
			setValue(next);
			if (progress < 1) frame = requestAnimationFrame(tick);
		});
		return () => cancelAnimationFrame(frame);
	}, [target, duration, delay]);

	return value;
}
