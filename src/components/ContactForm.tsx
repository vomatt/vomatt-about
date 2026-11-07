'use client';

import { type ReactNode, useActionState, useEffect, useRef } from 'react';

import { sendContact } from '@/app/[locale]/contact/actions';
import { buttonVariants } from '@/components/ui/Button';
import type { Locale } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';
import {
	CONTACT_LIMITS,
	type ContactField,
	type ContactState,
	HONEYPOT_FIELD,
} from '@/lib/contact';
import { cn } from '@/lib/utils';

// vomatt-web's Input and Textarea: white card, input border, 10px radius, 16px on phones so iOS doesn't zoom
const fieldClassName =
	'w-full rounded-(--radius) border border-input bg-card px-3.5 text-[16px] outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:outline-ring aria-invalid:border-destructive md:text-[15px]';

const initialState: ContactState = { status: 'editing' };

export function ContactForm({ locale }: { locale: Locale }) {
	const copy = MESSAGES[locale].contact;
	const [state, formAction, pending] = useActionState(
		sendContact,
		initialState
	);
	const sentHeading = useRef<HTMLHeadingElement>(null);
	const sent = state.status === 'sent';

	// The form the visitor was in is gone, so focus moves to the thank-you that replaced it
	useEffect(() => {
		if (sent) sentHeading.current?.focus();
	}, [sent]);

	if (sent) {
		return (
			<div
				role="status"
				className="rounded-2xl border border-border bg-card p-6"
			>
				<h2
					ref={sentHeading}
					tabIndex={-1}
					className="item-title text-foreground outline-none"
				>
					{copy.sent.title}
				</h2>
				<p className="mt-2 text-[15px] text-muted-foreground">
					{copy.sent.body}
				</p>
			</div>
		);
	}

	const { values, errors = {}, failure } = state;
	// The form resets after each send, so a failed one is filled back in from what was sent
	const fieldProps = (field: ContactField) => ({
		id: `contact-${field}`,
		name: field,
		required: true,
		maxLength: CONTACT_LIMITS[field],
		placeholder: copy.placeholders[field],
		defaultValue: values?.[field],
		'aria-invalid': errors[field] ? true : undefined,
		'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
	});
	const field = (name: ContactField, control: ReactNode) => {
		const error = errors[name];
		return (
			<div className="flex flex-col gap-2">
				<label
					htmlFor={`contact-${name}`}
					className="text-[14px] font-medium text-foreground"
				>
					{copy.labels[name]}
				</label>
				{control}
				{error && (
					<p
						id={`contact-${name}-error`}
						className="text-[14px] text-destructive"
					>
						{error === 'required'
							? copy.required[name]
							: error === 'tooLong'
								? copy.tooLong(CONTACT_LIMITS[name])
								: copy.invalidEmail}
					</p>
				)}
			</div>
		);
	};

	return (
		<form action={formAction} className="flex flex-col gap-6">
			<input type="hidden" name="locale" value={locale} />
			{/* Off screen and out of the tab order: only a bot fills it in */}
			<div
				aria-hidden
				className="absolute -left-[9999px] h-px w-px overflow-hidden"
			>
				<label htmlFor={`contact-${HONEYPOT_FIELD}`}>{copy.honeypot}</label>
				<input
					id={`contact-${HONEYPOT_FIELD}`}
					name={HONEYPOT_FIELD}
					type="text"
					tabIndex={-1}
					autoComplete="off"
					data-1p-ignore
					data-lpignore="true"
					data-bwignore
					data-form-type="other"
				/>
			</div>

			{field(
				'name',
				<input
					{...fieldProps('name')}
					type="text"
					autoComplete="name"
					className={cn(fieldClassName, 'h-12')}
				/>
			)}
			{field(
				'email',
				<input
					{...fieldProps('email')}
					type="email"
					autoComplete="email"
					className={cn(fieldClassName, 'h-12')}
				/>
			)}
			{field(
				'message',
				<textarea
					{...fieldProps('message')}
					rows={6}
					className={cn(fieldClassName, 'py-2.5')}
				/>
			)}

			{failure && (
				<p role="alert" className="text-[14px] text-destructive">
					{copy.failed[failure]}
				</p>
			)}
			<button
				type="submit"
				disabled={pending}
				className={buttonVariants({ className: 'self-start' })}
			>
				{pending ? copy.sending : copy.submit}
			</button>
		</form>
	);
}
