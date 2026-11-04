import { buttonVariants } from '@/components/ui/Button';
import { Lock, Plus } from '@/components/ui/SvgIcons';
import { type Locale } from '@/i18n/locales';
import { formatCount, MESSAGES } from '@/i18n/messages';

import type { HomeContent } from './content';
import { HeroPoll } from './HeroPoll';
import { POLL, pollIn } from './poll';
import { appHref } from './shared';

/** The page's h1 beside a poll on vomatt: the question is the hero. */
export function Hero({ content, locale }: { content: HomeContent['hero']; locale: Locale }) {
	return (
		<section
			aria-labelledby="home-title"
			className="grid items-center gap-10 pt-2 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:pt-16"
		>
			<div className="flex flex-col items-start gap-5">
				<p className="inline-flex items-center gap-2 rounded-full border border-tide-line bg-tide-tint px-3 py-1.5 text-[13px] leading-4 font-medium text-tide-foreground">
					<Lock aria-hidden className="size-3.5 shrink-0 text-tide" />
					{content.badge}
				</p>
				<h1 id="home-title" className="display-heading text-[36px] leading-[1.1] text-foreground md:text-[48px]">
					{content.heading}
				</h1>
				<p className="max-w-[34rem] text-[17px] leading-[1.6] text-muted-foreground">
					{content.body}
				</p>
				<div className="flex flex-wrap gap-3 pt-1">
					<a href={appHref('/login')} className={buttonVariants({ variant: 'create', size: 'lg' })}>
						<Plus aria-hidden />
						{content.primaryLabel}
					</a>
					<a href="#how-it-works" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
						{content.secondaryLabel}
					</a>
				</div>
			</div>

			<div
				role="img"
				aria-label={MESSAGES[locale].home.heroLabel(pollIn(locale).title, formatCount(locale, POLL.turnout))}
				className="w-full"
			>
				<HeroPoll locale={locale} />
			</div>
		</section>
	);
}
