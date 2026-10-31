import '@/styles/global.css';

import type { SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { CookieConsent } from '@/components/CookieConsent';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { buildShareImageUrl, imageBuilder } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { siteSharingQuery } from '@/sanity/lib/queries';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
});

// The site still renders when Sanity is down, without its title and analytics
const getSiteSettings = () =>
	sanityFetch({ query: siteSharingQuery })
		.then(({ data }) => data)
		.catch((error) => {
			console.error('Failed to load site settings from Sanity', error);
			return null;
		});

export async function generateMetadata(): Promise<Metadata> {
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
			locale: 'en_US',
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

export default async function RootLayout({ children }: LayoutProps<'/'>) {
	const settings = await getSiteSettings();

	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<body className="flex min-h-svh flex-col font-sans text-foreground">
				<SiteHeader />
				<main id="main" className="w-full flex-1 px-contain pt-8 pb-16">
					<div className="mx-auto w-full max-w-main">{children}</div>
				</main>
				<SiteFooter />
				<CookieConsent integrations={settings?.integrations} />
			</body>
		</html>
	);
}
