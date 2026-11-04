'use client';

import { useEffect, useState } from 'react';

import { prefersReducedMotion } from './motion';
import { POLL } from './poll';
import { PollMock } from './PollMock';

// When a few more people vote while the page is open (ms after load); the last brings it to POLL.turnout
const LATER_VOTES_AT = [4200, 7000, 10600, 13400, 17800, 21000];

/**
 * The hero's poll: a vote goes in a moment after the page loads, the ballot seals, and the turnout keeps
 * moving while the counts stay out of sight. The server renders it before the vote.
 */
export function HeroPoll() {
	const [voted, setVoted] = useState(false);
	const [laterVotes, setLaterVotes] = useState(0);

	useEffect(() => {
		const reduced = prefersReducedMotion();
		const timers = [window.setTimeout(() => setVoted(true), reduced ? 0 : 1100)];
		if (!reduced) {
			LATER_VOTES_AT.forEach((at, index) => timers.push(window.setTimeout(() => setLaterVotes(index + 1), at)));
		}
		return () => timers.forEach((timer) => window.clearTimeout(timer));
	}, []);

	const before = POLL.turnout - 1 - LATER_VOTES_AT.length;
	return <PollMock step={voted ? 2 : 1} turnout={before + (voted ? 1 : 0) + laterVotes} />;
}
