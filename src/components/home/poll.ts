/** The one poll the homepage follows from question to result. 591 + 488 + 205 = 1,284 voted. */
export const POLL = {
	title: 'Which night should the market move to?',
	author: '@riverside_market',
	turnout: 1284,
	options: [
		{ text: 'Thursday', percent: 46, winner: true, mine: false },
		{ text: 'Friday', percent: 38, winner: false, mine: true },
		{ text: 'Sunday', percent: 16, winner: false, mine: false },
	],
};

export const formatCount = (count: number) => count.toLocaleString('en-US');
