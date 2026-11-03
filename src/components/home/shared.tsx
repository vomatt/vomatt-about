import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/modules/shared';
import { cn } from '@/lib/utils';

/** A vomatt-web route (/login, /explore) on the app's origin. */
export const appHref = (path: string) => `${process.env.NEXT_PUBLIC_APP_URL}${path}`;

/** A homepage section's eyebrow, h2 and intro. */
export function SectionHeading({
	id,
	eyebrow,
	title,
	intro,
	className,
}: {
	id: string;
	eyebrow: string;
	title: string;
	intro?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('home-reveal flex max-w-[40rem] flex-col gap-3', className)}>
			<Eyebrow>{eyebrow}</Eyebrow>
			<h2 id={id} className="display-heading text-[28px] leading-[1.15] text-foreground md:text-[36px]">
				{title}
			</h2>
			{intro && <p className="text-[17px] leading-[1.6] text-muted-foreground">{intro}</p>}
		</div>
	);
}
