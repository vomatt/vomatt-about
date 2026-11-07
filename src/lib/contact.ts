/** The contact form's fields and their limits, the same as vomatt-api's POST /api/contact. */
export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactValues = Record<ContactField, string>;
/** `invalid` is only ever an email's. */
export type ContactErrors = Partial<
	Record<ContactField, 'required' | 'tooLong' | 'invalid'>
>;

/** The form while it's being filled in, with what was sent back if a send failed, or the thank-you once it's sent. */
export type ContactState =
	| {
			status: 'editing';
			values?: ContactValues;
			errors?: ContactErrors;
			failure?: 'invalid' | 'rateLimited' | 'generic';
	  }
	| { status: 'sent' };

/**
 * A hidden field people never see; a bot that fills it is told it sent, and nothing is sent. Its name means nothing
 * to browser autofill or password managers, which would otherwise fill it and silently drop a real message.
 */
export const HONEYPOT_FIELD = 'hp_check';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The form's values, trimmed, and what's wrong with them. */
export function validateContact(formData: FormData): {
	values: ContactValues;
	errors: ContactErrors;
} {
	const fields = Object.keys(CONTACT_LIMITS) as ContactField[];
	const values = Object.fromEntries(
		// A submitted textarea's line breaks are \r\n; count them as one character, as the field's maxLength did
		fields.map((field) => [
			field,
			String(formData.get(field) ?? '')
				.replace(/\r\n/g, '\n')
				.trim(),
		])
	) as ContactValues;

	const errors: ContactErrors = {};
	for (const field of fields) {
		if (!values[field]) errors[field] = 'required';
		else if (values[field].length > CONTACT_LIMITS[field])
			errors[field] = 'tooLong';
	}
	if (!errors.email && !EMAIL.test(values.email)) errors.email = 'invalid';
	return { values, errors };
}
