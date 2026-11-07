'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { HeadTrackingCode, Integrations } from '@/components/HeadTrackingCode';
import { buttonVariants } from '@/components/ui/Button';
import { type Locale, localizedPath } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';

export const CONSENT_COOKIE = 'cookie-consent';
type Consent = 'granted' | 'denied';

/** The consent cookie, set on vomatt.com so about.vomatt.com and the app share one answer. */
export function consentCookie(value: Consent | '', hostname: string) {
	const shared = hostname === 'vomatt.com' || hostname.endsWith('.vomatt.com');
	const maxAge = value ? 365 * 24 * 60 * 60 : 0;
	return `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax${shared ? '; domain=vomatt.com' : ''}`;
}

function readConsent(): Consent | null {
	const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
	return (match?.[1] as Consent) ?? null;
}

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

const hasAnalytics = (integrations?: Integrations | null) =>
	!!(integrations?.gaIDs?.some(Boolean) || integrations?.gtmIDs?.some(Boolean));

/** Asks before loading analytics; renders nothing when no analytics ID is set in Sanity. */
export function CookieConsent({ locale, integrations }: { locale: Locale; integrations?: Integrations | null }) {
	// undefined on the server, so the banner doesn't flash for returning visitors
	const consent = useSyncExternalStore(subscribe, readConsent, () => undefined);

	if (!hasAnalytics(integrations)) return null;

	const choose = (value: Consent) => {
		document.cookie = consentCookie(value, window.location.hostname);
		listeners.forEach((listener) => listener());
	};

	if (consent === 'granted') return <HeadTrackingCode {...integrations} />;
	if (consent !== null) return null;

	const copy = MESSAGES[locale].cookies;
	return (
		<section
			aria-label={copy.label}
			className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-border bg-card p-4 shadow-lg md:inset-x-auto md:right-4 md:bottom-4 md:max-w-sm"
		>
			<p className="text-sm">
				{copy.body}{' '}
				<Link href={localizedPath(locale, '/cookies-policy')} className="underline underline-offset-2">
					{copy.policy}
				</Link>
			</p>
			<div className="mt-3 flex gap-2">
				<button type="button" className={buttonVariants({ size: 'sm' })} onClick={() => choose('granted')}>
					{copy.accept}
				</button>
				<button
					type="button"
					className={buttonVariants({ size: 'sm', variant: 'outline' })}
					onClick={() => choose('denied')}
				>
					{copy.decline}
				</button>
			</div>
		</section>
	);
}

/** Clears the saved choice so the banner asks again; reloads if analytics already ran. Disabled, with a note, while analytics is off. */
export function CookieSettingsButton({ locale, integrations }: { locale: Locale; integrations?: Integrations | null }) {
	const reopen = () => {
		const wasGranted = readConsent() === 'granted';
		document.cookie = consentCookie('', window.location.hostname);
		if (wasGranted) window.location.reload();
		else listeners.forEach((listener) => listener());
	};

	const copy = MESSAGES[locale].cookies;
	const off = !hasAnalytics(integrations);
	return (
		<div className="mt-8">
			<button
				type="button"
				className={buttonVariants({ variant: 'outline' })}
				onClick={reopen}
				disabled={off}
				aria-describedby={off ? 'cookie-settings-off' : undefined}
			>
				{copy.settings}
			</button>
			{off && (
				<p id="cookie-settings-off" className="mt-2 text-sm text-muted-foreground">
					{copy.settingsOff}
				</p>
			)}
		</div>
	);
}
