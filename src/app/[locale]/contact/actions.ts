'use server';

import { headers } from 'next/headers';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/locales';
import { clientHeaders } from '@/lib/api/client-ip';
import {
	type ContactState,
	HONEYPOT_FIELD,
	validateContact,
} from '@/lib/contact';

/** Sends the contact form to vomatt-api. Every outcome comes back as state; nothing throws to the browser. */
export async function sendContact(
	_previous: ContactState,
	formData: FormData
): Promise<ContactState> {
	if (formData.get(HONEYPOT_FIELD)) return { status: 'sent' };

	const { values, errors } = validateContact(formData);
	if (Object.keys(errors).length > 0)
		return { status: 'editing', values, errors };

	const locale = String(formData.get('locale'));
	if (!process.env.API_URL) {
		console.error('Contact message failed: API_URL is not set');
		return { status: 'editing', values, failure: 'generic' };
	}
	try {
		const response = await fetch(`${process.env.API_URL}/api/contact`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...clientHeaders(await headers()),
			},
			body: JSON.stringify({
				...values,
				locale: isLocale(locale) ? locale : DEFAULT_LOCALE,
			}),
			cache: 'no-store',
			signal: AbortSignal.timeout(10_000),
		});
		if (response.ok) return { status: 'sent' };
		if (response.status === 400)
			return { status: 'editing', values, failure: 'invalid' };
		if (response.status === 429)
			return { status: 'editing', values, failure: 'rateLimited' };
		console.error(
			`Contact message failed: vomatt-api answered ${response.status}`
		);
	} catch (error) {
		console.error('Contact message failed', error);
	}
	return { status: 'editing', values, failure: 'generic' };
}
