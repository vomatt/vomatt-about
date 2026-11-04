import type { Locale } from '@/i18n/locales';

import type { HomeContent } from './content';
import { SectionHeading } from './shared';
import { StepsScroller } from './StepsScroller';

export function HowItWorks({ content, locale }: { content: HomeContent['howItWorks']; locale: Locale }) {
	return (
		<section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-8">
			<StepsScroller
				header={
					<SectionHeading
						id="how-it-works-title"
						eyebrow={content.eyebrow}
						title={content.heading}
						intro={content.intro}
					/>
				}
				steps={content.steps}
				locale={locale}
			/>
		</section>
	);
}
