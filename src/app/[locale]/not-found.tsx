import Link from 'next/link';

import { buttonVariants } from '@/components/ui/Button';
import { localizedPath } from '@/i18n/locales';
import { MESSAGES } from '@/i18n/messages';
import { getLocale } from '@/i18n/server';

export default async function NotFound() {
	const locale = await getLocale();
	const copy = MESSAGES[locale].notFound;
	return (
		<div className="empty-state flex flex-col items-start gap-3">
			<h1 className="item-title text-foreground">{copy.title}</h1>
			<p>{copy.body}</p>
			<Link href={localizedPath(locale, '/')} className={buttonVariants({ className: 'mt-2' })}>
				{copy.home}
			</Link>
		</div>
	);
}
