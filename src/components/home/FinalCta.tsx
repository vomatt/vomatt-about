import { buttonVariants } from '@/components/ui/Button';
import { Plus } from '@/components/ui/SvgIcons';

import { SealMark } from './ProductUI';
import { appHref } from './shared';

export function FinalCta() {
	return (
		<section
			aria-labelledby="final-cta-title"
			className="home-reveal flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10"
		>
			<div className="flex max-w-[34rem] flex-col gap-3">
				<h2 id="final-cta-title" className="display-heading text-[28px] leading-[1.15] text-foreground md:text-[36px]">
					Got a question for everyone?
				</h2>
				<p className="text-[17px] leading-[1.6] text-muted-foreground">
					A poll takes a minute to write and seals itself the moment it opens. Thank you for asking, and for answering.
				</p>
				<div className="flex flex-wrap gap-3 pt-3">
					<a href={appHref('/login')} className={buttonVariants({ variant: 'create', size: 'lg' })}>
						<Plus aria-hidden />
						Start a poll
					</a>
					<a href={appHref('/explore')} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
						Explore open polls
					</a>
				</div>
			</div>
			<span aria-hidden className="hidden shrink-0 md:block lg:mr-10">
				<SealMark size="lg" className="scale-150" />
			</span>
		</section>
	);
}
