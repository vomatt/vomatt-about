/**
 * @jest-environment node
 */
import { sendContact } from '@/app/[locale]/contact/actions';
import { HONEYPOT_FIELD } from '@/lib/contact';

jest.mock('next/headers', () => ({
	headers: async () => new Headers({ 'x-forwarded-for': '198.51.100.9, 10.0.0.1', 'user-agent': 'TestBrowser/1.0' }),
}));

const API = 'https://api.example.test';
const SECRET = 'client-ip-secret-0123456789abcdef';
const fetchMock = jest.fn();

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [name, value] of Object.entries(fields)) data.set(name, value);
	return data;
};
const valid = { name: ' Jun Tan ', email: ' jun@example.com ', message: 'When does the market poll close?', locale: 'zh' };
const send = (fields: Record<string, string>) => sendContact({ status: 'editing' }, form(fields));
const answer = (status: number) => fetchMock.mockResolvedValue(new Response(null, { status }));

beforeEach(() => {
	process.env.API_URL = API;
	process.env.CLIENT_IP_SECRET = SECRET;
	fetchMock.mockReset();
	global.fetch = fetchMock;
	jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('sendContact', () => {
	it('tells a bot that filled the hidden field it sent, without calling the API', async () => {
		expect(await send({ ...valid, [HONEYPOT_FIELD]: 'https://spam.example' })).toEqual({ status: 'sent' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('asks for every field left blank, without calling the API', async () => {
		const state = await send({ name: '  ', email: '', message: '\n', locale: 'en' });
		expect(state).toMatchObject({ status: 'editing', errors: { name: 'required', email: 'required', message: 'required' } });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('holds each field to the API’s limits', async () => {
		const state = await send({
			name: 'n'.repeat(101),
			email: `${'e'.repeat(250)}@x.io`,
			message: 'm'.repeat(5001),
			locale: 'en',
		});
		expect(state).toMatchObject({ errors: { name: 'tooLong', email: 'tooLong', message: 'tooLong' } });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a field at exactly its limit', async () => {
		answer(201);
		expect(await send({ ...valid, name: 'n'.repeat(100), message: 'm'.repeat(5000) })).toEqual({ status: 'sent' });
	});

	it('counts a submitted line break as one character, as the textarea did', async () => {
		answer(201);
		const lines = `${'m'.repeat(99)}\r\n`.repeat(50);
		expect(await send({ ...valid, message: lines })).toEqual({ status: 'sent' });
		expect(JSON.parse(fetchMock.mock.calls[0][1].body).message).toBe(lines.replace(/\r\n/g, '\n').trim());
	});

	it('fails without calling the API when API_URL is not set', async () => {
		delete process.env.API_URL;
		expect(await send(valid)).toMatchObject({ status: 'editing', failure: 'generic' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('turns down an address that is not an email, keeping what was typed', async () => {
		const state = await send({ ...valid, email: 'jun at example' });
		expect(state).toEqual({
			status: 'editing',
			values: { name: 'Jun Tan', email: 'jun at example', message: valid.message },
			errors: { email: 'invalid' },
		});
	});

	it('posts the trimmed message with the visitor’s IP and the shared secret', async () => {
		answer(201);
		expect(await send(valid)).toEqual({ status: 'sent' });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(`${API}/api/contact`);
		expect(init.method).toBe('POST');
		expect(init.headers).toEqual({
			'Content-Type': 'application/json',
			'User-Agent': 'TestBrowser/1.0',
			'X-Client-IP': '198.51.100.9',
			'X-Client-IP-Secret': SECRET,
		});
		expect(JSON.parse(init.body)).toEqual({
			name: 'Jun Tan',
			email: 'jun@example.com',
			message: valid.message,
			locale: 'zh',
		});
	});

	it('sends a locale the site does not serve as English', async () => {
		answer(201);
		await send({ ...valid, locale: 'fr' });
		expect(JSON.parse(fetchMock.mock.calls[0][1].body).locale).toBe('en');
	});

	it.each([
		[400, 'invalid'],
		[429, 'rateLimited'],
		[500, 'generic'],
		[503, 'generic'],
	])('answers a %i with the %s failure, keeping what was typed', async (status, failure) => {
		answer(status);
		expect(await send(valid)).toEqual({
			status: 'editing',
			values: { name: 'Jun Tan', email: 'jun@example.com', message: valid.message },
			failure,
		});
	});

	it('answers a network failure with the generic failure instead of throwing', async () => {
		fetchMock.mockRejectedValue(new TypeError('fetch failed'));
		expect(await send(valid)).toMatchObject({ status: 'editing', failure: 'generic' });
	});
});
