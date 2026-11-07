import { fireEvent, render, screen } from '@testing-library/react';

import { sendContact } from '@/app/[locale]/contact/actions';
import { ContactForm } from '@/components/ContactForm';
import { HONEYPOT_FIELD } from '@/lib/contact';

jest.mock('@/app/[locale]/contact/actions', () => ({ sendContact: jest.fn() }));
const sendMock = sendContact as jest.Mock;

const submit = () => fireEvent.submit(screen.getByRole('button').closest('form')!);

beforeEach(() => sendMock.mockReset());

describe('ContactForm', () => {
	it('asks for a name, an email and a message within the API’s limits', () => {
		render(<ContactForm locale="en" />);
		const name = screen.getByRole('textbox', { name: 'Name' });
		const email = screen.getByRole('textbox', { name: 'Email' });
		const message = screen.getByRole('textbox', { name: 'Message' });
		for (const field of [name, email, message]) expect(field).toBeRequired();
		expect(name).toHaveAttribute('maxLength', '100');
		expect(email).toHaveAttribute('type', 'email');
		expect(email).toHaveAttribute('maxLength', '254');
		expect(message).toHaveAttribute('maxLength', '5000');
		expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
	});

	it('is written in Chinese on /zh/contact', () => {
		render(<ContactForm locale="zh" />);
		expect(screen.getByRole('textbox', { name: '名字' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: '電子郵件' })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: '訊息' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '送出訊息' })).toBeInTheDocument();
	});

	it('keeps the hidden field away from people', () => {
		const { container } = render(<ContactForm locale="en" />);
		expect(screen.queryByRole('textbox', { name: 'Leave this field empty' })).not.toBeInTheDocument();
		const trap = container.querySelector(`input[name="${HONEYPOT_FIELD}"]`);
		expect(trap).toHaveAttribute('tabIndex', '-1');
		expect(trap).toHaveAttribute('data-1p-ignore');
		expect(trap).toHaveAttribute('data-lpignore', 'true');
	});

	it('sends the page’s language with the message', async () => {
		sendMock.mockResolvedValue({ status: 'sent' });
		render(<ContactForm locale="zh" />);
		submit();
		await screen.findByRole('status');
		expect((sendMock.mock.calls[0][1] as FormData).get('locale')).toBe('zh');
	});

	it('replaces the form with a thank-you once sent', async () => {
		sendMock.mockResolvedValue({ status: 'sent' });
		render(<ContactForm locale="en" />);
		submit();
		expect(await screen.findByRole('heading', { name: 'Message sent. Thank you.' })).toHaveFocus();
		expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
	});

	it('shows each field’s error and keeps what was typed', async () => {
		sendMock.mockResolvedValue({
			status: 'editing',
			values: { name: '', email: 'jun at example', message: 'Hi' },
			errors: { name: 'required', email: 'invalid' },
		});
		render(<ContactForm locale="en" />);
		submit();
		const name = screen.getByRole('textbox', { name: 'Name' });
		expect(await screen.findByText('Enter your name.')).toBeInTheDocument();
		expect(name).toHaveAttribute('aria-invalid', 'true');
		expect(name).toHaveAccessibleDescription('Enter your name.');
		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
			'Enter an email address like you@example.com.'
		);
		expect(screen.getByRole('textbox', { name: 'Message' })).not.toHaveAttribute('aria-invalid');
		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('jun at example');
	});

	it.each([
		['rateLimited', 'en', 'You’ve sent too many messages for now. Try again later.'],
		['generic', 'en', 'Your message couldn’t be sent. Try again in a moment.'],
		['rateLimited', 'zh', '你目前傳送的訊息太多了，請稍後再試。'],
	] as const)('says why a %s send failed, in %s', async (failure, locale, text) => {
		sendMock.mockResolvedValue({ status: 'editing', values: { name: 'Jun', email: 'j@x.io', message: 'Hi' }, failure });
		render(<ContactForm locale={locale} />);
		submit();
		expect(await screen.findByRole('alert')).toHaveTextContent(text);
	});
});
