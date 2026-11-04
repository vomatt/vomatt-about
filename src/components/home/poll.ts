import type { Locale } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';

/**
 * The one poll the homepage follows from question to result. 591 + 488 + 205 = 1,284 voted.
 * Its words are in the messages (home.poll), option by option in this order.
 */
export const POLL = {
	turnout: 1284,
	results: [
		{ percent: 46, winner: true, mine: false },
		{ percent: 38, winner: false, mine: true },
		{ percent: 16, winner: false, mine: false },
	],
};

/** The poll in `locale`: its title, author, and each option's text beside its result. */
export function pollIn(locale: Locale) {
	const { title, author, options } = MESSAGES[locale].home.poll;
	const winnerIndex = POLL.results.findIndex((result) => result.winner);
	return {
		title,
		author,
		options: POLL.results.map((result, index) => ({ ...result, text: options[index] })),
		winner: options[winnerIndex],
	};
}
