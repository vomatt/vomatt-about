import CustomPortableText from '@/components/CustomPortableText';
import { Bell, Check, Eye, Lock } from '@/components/ui/SvgIcons';
import { TideRule, TideRules } from '@/components/ui/TidePanel';

import type { HomeContent } from './content';
import { SectionHeading } from './shared';

// Each rule's icon, paired with pHome.promise.rules by index
const RULE_ICONS = [Lock, Check, Eye, Bell];

/** What vomatt promises about a vote, on Tide, with the Privacy Policy one step away. */
export function VotePromise({ content }: { content: HomeContent['promise'] }) {
	return (
		<section aria-labelledby="promise-title" className="flex flex-col gap-10">
			<SectionHeading
				id="promise-title"
				eyebrow={content.eyebrow}
				title={content.heading}
				intro={content.intro}
			/>
			<div className="home-reveal flex flex-col gap-5">
				<TideRules className="grid gap-x-10 gap-y-5 space-y-0 p-5 text-[15px] md:grid-cols-2 md:p-7">
					{content.rules.slice(0, RULE_ICONS.length).map((rule, index) => (
						<TideRule key={index} icon={RULE_ICONS[index]}>
							<span className="block font-medium">{rule.title}</span>
							{rule.body}
						</TideRule>
					))}
				</TideRules>
				<div className="text-[15px] leading-[1.6] text-muted-foreground [&_.text-link]:text-foreground [&_.text-link]:hover:text-muted-foreground">
					<CustomPortableText blocks={content.footnote} />
				</div>
			</div>
		</section>
	);
}
