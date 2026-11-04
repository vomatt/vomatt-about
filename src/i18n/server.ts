import { notFound } from 'next/navigation';
import { locale } from 'next/root-params';

import { isLocale, type Locale } from './locales';

/** The URL's locale in a Server Component; an unknown one is a 404. */
export async function getLocale(): Promise<Locale> {
	const value = await locale();
	if (!isLocale(value)) notFound();
	return value;
}
