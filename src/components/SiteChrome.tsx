import Link from 'next/link';

import { BrandLink } from '@/components/BrandLink';
import { buttonVariants } from '@/components/ui/Button';

// Sanity's header and footer menus are empty, so the links live here until they're filled in
const FOOTER_LINKS = [
	{ href: '/about', label: 'About' },
	{ href: '/terms-of-service', label: 'Terms' },
	{ href: '/privacy-policy', label: 'Privacy' },
	{ href: '/cookies-policy', label: 'Cookies' },
];

export function SiteHeader() {
	return (
		<header className="border-b border-border">
			<div className="mx-auto flex h-14 max-w-main items-center justify-between px-contain">
				<BrandLink className="w-20" />
				<a href={process.env.NEXT_PUBLIC_APP_URL} className={buttonVariants({ size: 'sm' })}>
					Open vomatt
				</a>
			</div>
		</header>
	);
}

export function SiteFooter() {
	return (
		<footer className="border-t border-border">
			<nav
				aria-label="Legal"
				className="mx-auto flex max-w-main flex-wrap gap-x-5 gap-y-2 px-contain py-8 text-[14px] text-muted-foreground"
			>
				{FOOTER_LINKS.map(({ href, label }) => (
					<Link key={href} href={href} className="hover:text-foreground">
						{label}
					</Link>
				))}
			</nav>
		</footer>
	);
}
