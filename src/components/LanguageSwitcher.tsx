'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type Locale, LOCALES, locales, localizedPath, splitLocale } from '@/i18n/locales';

/** Links to this page in each other language. */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
	// The visitor's URL, or the /en path the proxy rewrote it to; either way the path after the locale
	const { path } = splitLocale(usePathname());

	return (
		<nav aria-label={label} className="flex gap-x-5">
			{locales
				.filter((other) => other !== locale)
				.map((other) => (
					<Link
						key={other}
						href={localizedPath(other, path)}
						lang={LOCALES[other].htmlLang}
						hrefLang={LOCALES[other].htmlLang}
						className="inline-flex min-h-11 items-center hover:text-foreground"
					>
						{LOCALES[other].label}
					</Link>
				))}
		</nav>
	);
}
