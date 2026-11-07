import '@/styles/global.css';

import type { SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { CookieConsent } from '@/components/CookieConsent';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { LOCALES, locales } from '@/i18n/locales';
import { getLocale } from '@/i18n/server';
import { getSiteSettings } from '@/lib/siteSettings';
import { getOtherLanguagePaths } from '@/lib/writtenPages';
import { buildShareImageUrl, imageBuilder } from '@/sanity/lib/image';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const data = await getSiteSettings();
	const { siteTitle = '', favicon, faviconLight, shareGraphic, shareVideo } =
		data || {};

	const faviconUrl = (icon: SanityImageSource) =>
		imageBuilder.image(icon).width(256).height(256).url();
	// A favicon set in Sanity wins; without one, the icon files in app/ apply
	const siteFaviconUrl = favicon ? faviconUrl(favicon) : null;
	const siteFaviconLightUrl = faviconLight
		? faviconUrl(faviconLight)
		: siteFaviconUrl;
	const shareGraphicUrl = shareGraphic?.asset
		? buildShareImageUrl(shareGraphic.asset)
		: null;

	return {
		metadataBase: new URL(process.env.SITE_URL || ''),
		title: {
			template: `%s | ${siteTitle}`,
			default: siteTitle,
		},
		creator: siteTitle,
		publisher: siteTitle,
		applicationName: siteTitle,
		openGraph: {
			title: siteTitle,
			images: shareGraphicUrl
				? [{ url: shareGraphicUrl, width: 1200, height: 630 }]
				: [],
			videos: shareVideo
				? [{ url: shareVideo, width: 1200, height: 630, type: 'video/mp4' }]
				: [],
			siteName: siteTitle,
			locale: LOCALES[locale].ogLocale,
			type: 'website',
		},
		icons: siteFaviconUrl
			? {
					icon: [
						{ url: siteFaviconUrl, media: '(prefers-color-scheme: light)' },
						{
							url: siteFaviconLightUrl ?? siteFaviconUrl,
							media: '(prefers-color-scheme: dark)',
						},
					],
				}
			: undefined,
	};
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
	const locale = await getLocale();
	const [settings, written] = await Promise.all([getSiteSettings(), getOtherLanguagePaths(locale)]);

	return (
		<html
			lang={LOCALES[locale].htmlLang}
			data-scroll-behavior="smooth"
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<body className="flex min-h-svh flex-col font-sans text-foreground">
				<SiteHeader locale={locale} />
				<main id="main" className="w-full flex-1 px-contain pt-8 pb-16">
					<div className="mx-auto w-full max-w-frame">{children}</div>
				</main>
				<SiteFooter locale={locale} written={written} />
				<CookieConsent locale={locale} integrations={settings?.integrations} />
			</body>
		</html>
	);
}
