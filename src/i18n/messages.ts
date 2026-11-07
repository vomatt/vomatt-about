import type { ContactField } from '@/lib/contact';

import { type Locale,LOCALES } from './locales';

/** vomatt-web's META_GAP: parts of a meta line are separated by an em space, not a glyph. */
export const META_GAP = '\u2003';

/**
 * Interface strings: the site chrome and the homepage's mock polls. Page content lives in Sanity.
 * Wording follows vomatt-web's en/zh dictionaries where the same string appears in the app.
 */
export type Messages = {
	header: { openApp: string };
	footer: { navLabel: string; about: string; contact: string; terms: string; privacy: string };
	languageSwitcher: { label: string };
	notFound: { title: string; body: string; home: string };
	page: { lastUpdated: string };
	contact: {
		title: string;
		intro: string;
		labels: Record<ContactField, string>;
		placeholders: Record<ContactField, string>;
		required: Record<ContactField, string>;
		tooLong: (max: number) => string;
		invalidEmail: string;
		/** The hidden anti-spam field's label; only bots see it. */
		honeypot: string;
		submit: string;
		sending: string;
		sent: { title: string; body: string };
		/** Why a send failed: vomatt-api turned the details down, the visitor sent too many, or anything else. */
		failed: { invalid: string; rateLimited: string; generic: string };
	};
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
		footer: { navLabel: 'Site', about: 'About', contact: 'Contact', terms: 'Terms', privacy: 'Privacy' },
		languageSwitcher: { label: 'Language' },
		notFound: {
			title: 'Page not found',
			body: 'We couldn’t find what you were looking for.',
			home: 'Go home',
		},
		page: { lastUpdated: 'Last updated' },
		contact: {
			title: 'Contact us',
			intro: 'Questions about vomatt, a poll or your account? Send us a message and we’ll reply by email.',
			labels: { name: 'Name', email: 'Email', message: 'Message' },
			placeholders: { name: 'Your name', email: 'you@example.com', message: 'How can we help?' },
			required: { name: 'Enter your name.', email: 'Enter your email address.', message: 'Write your message.' },
			tooLong: (max) => `Use ${formatCount('en', max)} characters or fewer.`,
			invalidEmail: 'Enter an email address like you@example.com.',
			honeypot: 'Leave this field empty',
			submit: 'Send message',
			sending: 'Sending…',
			sent: { title: 'Message sent. Thank you.', body: 'We read every message and will reply by email.' },
			failed: {
				invalid: 'Some of these details weren’t accepted. Check them and try again.',
				rateLimited: 'You’ve sent too many messages for now. Try again later.',
				generic: 'Your message couldn’t be sent. Try again in a moment.',
			},
		},
		cookies: {
			label: 'Cookie consent',
			body: 'We’d like to use analytics cookies to understand how vomatt is used. Sign-in and language cookies are always on.',
			policy: 'Privacy Policy',
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
		footer: { navLabel: '網站', about: '關於', contact: '聯絡我們', terms: '服務條款', privacy: '隱私權政策' },
		languageSwitcher: { label: '語言' },
		notFound: { title: '找不到頁面', body: '我們找不到你要找的內容。', home: '回到首頁' },
		page: { lastUpdated: '最後更新' },
		contact: {
			title: '聯絡我們',
			intro: '對 vomatt、某則投票或你的帳號有疑問嗎？傳訊息給我們，我們會以電子郵件回覆。',
			labels: { name: '名字', email: '電子郵件', message: '訊息' },
			placeholders: { name: '你的名字', email: 'you@example.com', message: '有什麼我們可以幫忙的？' },
			required: { name: '請輸入你的名字。', email: '請輸入你的電子郵件地址。', message: '請輸入訊息內容。' },
			tooLong: (max) => `請在 ${formatCount('zh', max)} 個字元以內。`,
			invalidEmail: '請輸入有效的電子郵件地址，例如 you@example.com。',
			honeypot: '此欄位請留空',
			submit: '送出訊息',
			sending: '傳送中…',
			sent: { title: '訊息已送出，謝謝你。', body: '我們會閱讀每一則訊息，並以電子郵件回覆你。' },
			failed: {
				invalid: '部分資料未被接受，請檢查後再試一次。',
				rateLimited: '你目前傳送的訊息太多了，請稍後再試。',
				generic: '訊息無法送出，請稍後再試。',
			},
		},
		cookies: {
			label: 'Cookie 同意',
			body: '我們想使用分析 Cookie 來了解 vomatt 的使用情形。登入與語言 Cookie 會一直啟用。',
			policy: '隱私權政策',
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
