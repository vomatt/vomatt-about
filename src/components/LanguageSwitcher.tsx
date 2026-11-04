'use client';

import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { type Locale, LOCALES, locales, localizedPath, splitLocale } from '@/i18n/locales';

// Carries the query string and #anchor over; the server render can't know them
function keepSearchAndHash(event: MouseEvent<HTMLAnchorElement>) {
	const { search, hash } = window.location;
	event.currentTarget.href = `${event.currentTarget.pathname}${search}${hash}`;
}

/**
 * Links to this page in each other language. Plain anchors: another locale is another root
 * layout, so the switch is a full page load either way.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
	// The visitor's URL, or the /en path the proxy rewrote it to; either way the path after the locale
	const { path } = splitLocale(usePathname());

	return (
		<nav aria-label={label} className="flex gap-x-5">
			{locales
				.filter((other) => other !== locale)
				.map((other) => (
					<a
						key={other}
						href={localizedPath(other, path)}
						lang={LOCALES[other].htmlLang}
						hrefLang={LOCALES[other].htmlLang}
						onClick={keepSearchAndHash}
						className="inline-flex min-h-11 items-center hover:text-foreground"
					>
						{LOCALES[other].label}
					</a>
				))}
		</nav>
	);
}
