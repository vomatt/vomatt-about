'use client';

import type { RefCallback } from 'react';

const toggleWithVisibility: RefCallback<HTMLStyleElement> = (style) => {
	if (!style) return;
	style.media = 'all';
	return () => {
		style.media = 'not all';
	};
};

// Widens max-w-frame (the main column) to the page width while the homepage is on screen.
// With Cache Components a page left by client navigation stays mounted inside a hidden <Activity>,
// so the rule switches off when the homepage is hidden instead of following its presence in the DOM.
// A <style> created in the browser starts off, because a hidden first mount never attaches the ref;
// the server's HTML starts on so the homepage paints wide before hydration, and hydration keeps it.
export function WideFrame() {
	return (
		<style
			ref={toggleWithVisibility}
			media={typeof window === 'undefined' ? undefined : 'not all'}
			suppressHydrationWarning
		>
			{':root { --frame-width: var(--frame-width-wide); }'}
		</style>
	);
}
