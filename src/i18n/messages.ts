import { type Locale,LOCALES } from './locales';

/** vomatt-web's META_GAP: parts of a meta line are separated by an em space, not a glyph. */
export const META_GAP = '\u2003';

/**
 * Interface strings: the site chrome and the homepage's mock polls. Page content lives in Sanity.
 * Wording follows vomatt-web's en/zh dictionaries where the same string appears in the app.
 */
export type Messages = {
	header: { openApp: string };
	footer: { navLabel: string; about: string; terms: string; privacy: string; cookies: string };
	languageSwitcher: { label: string };
	notFound: { title: string; body: string; home: string };
	page: { lastUpdated: string };
	cookies: {
		label: string;
		body: string;
		policy: string;
		accept: string;
		decline: string;
		settings: string;
		settingsOff: string;
	};
	home: {
		/** The one poll the homepage follows; options pair with POLL_RESULTS by index. */
		poll: { title: string; author: string; options: [string, string, string] };
		pollCard: {
			age: string;
			voted: string;
			ends: string;
			ended: string;
			questionPlaceholder: string;
			optionPlaceholder: (number: number) => string;
			revealHint: string;
			vote: string;
			sealedTitle: string;
			sealedBody: string;
			won: (option: string, count: string) => string;
			votedCount: (count: string) => string;
			comments: string;
			discuss: string;
			yourVote: string;
		};
		notice: { title: string; meta: (option: string, count: string) => string };
		heroLabel: (title: string, count: string) => string;
		whySealed: { live: string; sealedUntil: string };
		features: {
			replaces: (option: string) => string;
			commentAuthor: string;
			commentAge: string;
			/** The comment, split around the @mention it bolds. */
			comment: [string, string, string];
			replies: string;
			followName: string;
			followMeta: string;
			follow: string;
			topics: [string, string];
			passkey: string;
		};
		/** The example poll under each use case; pairs with pHome.useCases.items by index. */
		useCases: [UseCaseMock, UseCaseMock, UseCaseMock, UseCaseMock];
	};
};

type UseCaseMock = { author: string; ends: string; meta: string };

export const MESSAGES: Record<Locale, Messages> = {
	en: {
		header: { openApp: 'Open vomatt' },
		footer: { navLabel: 'Legal', about: 'About', terms: 'Terms', privacy: 'Privacy', cookies: 'Cookies' },
		languageSwitcher: { label: 'Language' },
		notFound: {
			title: 'Page not found',
			body: 'We couldn’t find what you were looking for.',
			home: 'Go home',
		},
		page: { lastUpdated: 'Last updated' },
		cookies: {
			label: 'Cookie consent',
			body: 'We’d like to use analytics cookies to understand how vomatt is used. Sign-in and language cookies are always on.',
			policy: 'Cookies Policy',
			accept: 'Accept analytics',
			decline: 'Decline',
			settings: 'Cookie settings',
			settingsOff: 'Analytics is off, so no analytics cookies are set and there’s nothing to change.',
		},
		home: {
			poll: {
				title: 'Which night should the market move to?',
				author: '@riverside_market',
				options: ['Thursday', 'Friday', 'Sunday'],
			},
			pollCard: {
				age: '2d',
				voted: 'Voted',
				ends: 'Ends Fri 20:00',
				ended: 'Ended Fri',
				questionPlaceholder: 'Your question',
				optionPlaceholder: (number) => `Option ${number}`,
				revealHint: 'Results are revealed when the poll ends',
				vote: 'Vote',
				sealedTitle: 'Sealed. Thank you.',
				sealedBody: 'Results are sealed until Fri 20:00.',
				won: (option, count) => `“${option}” won. ${count} people decided this.`,
				votedCount: (count) => `${count} voted`,
				comments: '36 comments',
				discuss: 'Discuss',
				yourVote: 'your vote',
			},
			notice: { title: 'Results are in', meta: (option, count) => `${option} won${META_GAP}${count} voted${META_GAP}now` },
			heroLabel: (title, count) =>
				`An open poll on vomatt: “${title}” ${count} people have voted, and the results stay sealed until it ends on Friday.`,
			whySealed: { live: 'Updates with every vote', sealedUntil: 'Sealed until Fri 20:00' },
			features: {
				replaces: (option) => `Replaces your vote for ${option}`,
				commentAuthor: '@mina',
				commentAge: '2h',
				comment: ['Friday, so the stalls can stay open late. ', '@jtan', ' would that work for you?'],
				replies: `Reply${META_GAP}3 replies`,
				followName: 'Jun Tan',
				followMeta: `@jtan${META_GAP}128 followers`,
				follow: 'Follow',
				topics: ['Neighbourhood', 'Markets'],
				passkey: 'Continue with a passkey',
			},
			useCases: [
				{ author: '@studio_ops', ends: 'Ends Thu 18:00', meta: `18 voted${META_GAP}invite only` },
				{ author: '@northside_books', ends: 'Ends Sun 21:00', meta: `42 voted${META_GAP}unlisted` },
				{ author: '@elm_street', ends: 'Ends Mon 09:00', meta: '326 voted' },
				{ author: '@jtan', ends: 'Ends in 6h', meta: `7 voted${META_GAP}unlisted` },
			],
		},
	},
	zh: {
		header: { openApp: '開啟 vomatt' },
		footer: { navLabel: '法律資訊', about: '關於', terms: '服務條款', privacy: '隱私權政策', cookies: 'Cookie 政策' },
		languageSwitcher: { label: '語言' },
		notFound: { title: '找不到頁面', body: '我們找不到你要找的內容。', home: '回到首頁' },
		page: { lastUpdated: '最後更新' },
		cookies: {
			label: 'Cookie 同意',
			body: '我們想使用分析 Cookie 來了解 vomatt 的使用情形。登入與語言 Cookie 會一直啟用。',
			policy: 'Cookie 政策',
			accept: '接受分析',
			decline: '拒絕',
			settings: 'Cookie 設定',
			settingsOff: '分析功能目前已關閉，因此不會設定分析 Cookie，也沒有需要變更的選項。',
		},
		home: {
			poll: {
				title: '市集要改到哪一晚？',
				author: '@riverside_market',
				options: ['星期四', '星期五', '星期日'],
			},
			pollCard: {
				age: '2 天',
				voted: '已投票',
				ends: '週五 20:00 截止',
				ended: '週五結束',
				questionPlaceholder: '你的問題',
				optionPlaceholder: (number) => `選項 ${number}`,
				revealHint: '投票結束後才會公開結果',
				vote: '投票',
				sealedTitle: '已密封，謝謝你。',
				sealedBody: '結果將於週五 20:00 公開。',
				won: (option, count) => `「${option}」勝出，共 ${count} 人參與決定。`,
				votedCount: (count) => `${count} 人已投票`,
				comments: '36 則留言',
				discuss: '討論',
				yourVote: '你的選擇',
			},
			notice: { title: '結果出爐', meta: (option, count) => `${option}勝出${META_GAP}${count} 人已投票${META_GAP}剛剛` },
			heroLabel: (title, count) =>
				`vomatt 上一則進行中的投票：「${title}」已有 ${count} 人投票，結果在週五投票結束前保持密封。`,
			whySealed: { live: '每一票都即時更新', sealedUntil: '密封至週五 20:00' },
			features: {
				replaces: (option) => `將取代你投給「${option}」的票`,
				commentAuthor: '@mina',
				commentAge: '2 小時',
				comment: ['選星期五，攤位就能開晚一點。', '@jtan', ' 你那天可以嗎？'],
				replies: `回覆${META_GAP}3 則回覆`,
				followName: 'Jun Tan',
				followMeta: `@jtan${META_GAP}128 位追蹤者`,
				follow: '追蹤',
				topics: ['社區', '市集'],
				passkey: '使用通行密鑰繼續',
			},
			useCases: [
				{ author: '@studio_ops', ends: '週四 18:00 截止', meta: `18 人已投票${META_GAP}僅限受邀者` },
				{ author: '@northside_books', ends: '週日 21:00 截止', meta: `42 人已投票${META_GAP}不公開列出` },
				{ author: '@elm_street', ends: '週一 09:00 截止', meta: '326 人已投票' },
				{ author: '@jtan', ends: '6 小時後截止', meta: `7 人已投票${META_GAP}不公開列出` },
			],
		},
	},
};

/** A count as the locale writes it: 1,284. */
export const formatCount = (locale: Locale, count: number) => count.toLocaleString(LOCALES[locale].intl);
