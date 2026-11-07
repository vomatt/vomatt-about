import { render, screen } from '@testing-library/react';
import type { ResolvingMetadata } from 'next';

import ContactPage, { generateMetadata } from '@/app/[locale]/contact/page';
import { getLocale } from '@/i18n/server';

jest.mock('@/i18n/server', () => ({ getLocale: jest.fn() }));
jest.mock('@/app/[locale]/contact/actions', () => ({ sendContact: jest.fn() }));
const localeMock = getLocale as jest.Mock;

const site = 'https://about.vomatt.com';
const props = {} as PageProps<'/[locale]/contact'>;
const parent = Promise.resolve({ openGraph: null }) as unknown as ResolvingMetadata;

describe('the contact page', () => {
	const original = process.env.SITE_URL;
	beforeAll(() => {
		process.env.SITE_URL = site;
	});
	afterAll(() => {
		process.env.SITE_URL = original;
	});

	it.each([
		['en', 'Contact us'],
		['zh', '聯絡我們'],
	])('has its title and form in %s', async (locale, title) => {
		localeMock.mockResolvedValue(locale);
		render(await ContactPage());
		expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
	});

	it('points at itself and lists both languages', async () => {
		localeMock.mockResolvedValue('zh');
		const { alternates, title } = await generateMetadata(props, parent);
		expect(title).toBe('聯絡我們');
		expect(alternates).toEqual({
			canonical: `${site}/zh/contact`,
			languages: { en: `${site}/contact`, 'zh-TW': `${site}/zh/contact`, 'x-default': `${site}/contact` },
		});
	});
});
