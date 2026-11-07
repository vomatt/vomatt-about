import Link from 'next/link';

import { BrandLink } from '@/components/BrandLink';
import { LanguageSwitcher, type WrittenPaths } from '@/components/LanguageSwitcher';
import { buttonVariants } from '@/components/ui/Button';
import { type Locale, localizedPath } from '@/i18n/locales';
import { MESSAGES,type Messages } from '@/i18n/messages';

// Sanity's header and footer menus are empty, so the links live here until they're filled in
const FOOTER_LINKS: { path: string; label: keyof Messages['footer'] }[] = [
	{ path: '/about', label: 'about' },
	{ path: '/contact', label: 'contact' },
	{ path: '/terms-of-service', label: 'terms' },
	{ path: '/privacy-policy', label: 'privacy' },
	{ path: '/cookies-policy', label: 'cookies' },
];

export function SiteHeader({ locale }: { locale: Locale }) {
	return (
		<header className="border-b border-border">
			<div className="mx-auto flex h-14 max-w-main items-center justify-between px-contain wide-frame:max-w-page">
				<BrandLink href={localizedPath(locale, '/')} className="w-20" />
				<a href={process.env.NEXT_PUBLIC_APP_URL} className={buttonVariants({ size: 'sm' })}>
					{MESSAGES[locale].header.openApp}
				</a>
			</div>
		</header>
	);
}

export function SiteFooter({ locale, written }: { locale: Locale; written: WrittenPaths }) {
	const { footer, languageSwitcher } = MESSAGES[locale];
	return (
		<footer className="border-t border-border">
			<div className="mx-auto flex max-w-main flex-wrap items-center justify-between gap-x-5 px-contain py-5 text-[14px] text-muted-foreground wide-frame:max-w-page">
				<nav aria-label={footer.navLabel} className="flex flex-wrap gap-x-5">
					{FOOTER_LINKS.map(({ path, label }) => (
						<Link
							key={path}
							href={localizedPath(locale, path)}
							className="inline-flex min-h-11 items-center hover:text-foreground"
						>
							{footer[label]}
						</Link>
					))}
				</nav>
				<LanguageSwitcher locale={locale} label={languageSwitcher.label} written={written} />
			</div>
		</footer>
	);
}
