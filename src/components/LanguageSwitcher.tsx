'use client';

import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { type Locale, LOCALES, locales, localizedPath, splitLocale } from '@/i18n/locales';

// Carries the query string and #anchor over; the server render can't know them
function keepSearchAndHash(event: MouseEvent<HTMLAnchorElement>) {
	const { search, hash } = window.location;
	event.currentTarget.href = `${event.currentTarget.pathname}${search}${hash}`;
}

/** The paths ('/', '/about') of the pages written in each language, decoded as Sanity stores slugs. */
export type WrittenPaths = Partial<Record<Locale, string[]>>;

/**
 * Links to this page in each other language it's written in. Plain anchors: another locale is
 * another root layout, so the switch is a full page load either way.
 */
export function LanguageSwitcher({ locale, label, written }: { locale: Locale; label: string; written: WrittenPaths }) {
	// The visitor's URL, or the /en path the proxy rewrote it to; either way the path after the locale
	// Decoded, since a non-ASCII slug comes percent-encoded in the URL
	const { path } = splitLocale(decodeURI(usePathname()));
	const others = locales.filter((other) => other !== locale && written[other]?.includes(path));
	if (others.length === 0) return null;

	return (
		<nav aria-label={label} className="flex gap-x-5">
			{others.map((other) => (
				<a
					key={other}
					href={localizedPath(other, path)}
					lang={LOCALES[other].htmlLang}
					hrefLang={LOCALES[other].htmlLang}
					onClick={keepSearchAndHash}
					className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
				>
					{LOCALES[other].label}
				</a>
			))}
		</nav>
	);
}
