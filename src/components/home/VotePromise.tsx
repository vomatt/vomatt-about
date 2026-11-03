import Link from 'next/link';

import { Bell, Check, Eye, Lock } from '@/components/ui/SvgIcons';
import { TideRule, TideRules } from '@/components/ui/TidePanel';

import { SectionHeading } from './shared';

const RULES = [
	{
		icon: Lock,
		title: 'Sealed while it’s open.',
		body: 'Everyone sees how many people voted, nobody sees how they voted. The counts open when the poll closes.',
	},
	{
		icon: Check,
		title: 'One person, one vote.',
		body: 'Every vote counts the same, whoever casts it. You can change or withdraw yours until the poll closes.',
	},
	{
		icon: Eye,
		title: 'You know who can see your choice.',
		body: 'Each poll says, before you vote, whether anyone will see what you chose once it ends.',
	},
	{
		icon: Bell,
		title: 'The result comes back to you.',
		body: 'When the poll closes, the result is there for everyone, and everyone who voted is told it’s in.',
	},
];

/** What vomatt promises about a vote, on Tide, with the Privacy Policy one step away. */
export function VotePromise() {
	return (
		<section aria-labelledby="promise-title" className="flex flex-col gap-10">
			<SectionHeading
				id="promise-title"
				eyebrow="Our promise"
				title="What happens to your vote"
				intro="The same rules on every poll, shown on the poll before you vote."
			/>
			<div className="home-reveal flex flex-col gap-5">
				<TideRules className="grid gap-x-10 gap-y-5 space-y-0 p-5 text-[15px] md:grid-cols-2 md:p-7">
					{RULES.map((rule) => (
						<TideRule key={rule.title} icon={rule.icon}>
							<span className="block font-medium">{rule.title}</span>
							{rule.body}
						</TideRule>
					))}
				</TideRules>
				<p className="text-[15px] leading-[1.6] text-muted-foreground">
					How we handle your account and data is in the{' '}
					<Link href="/privacy-policy" className="text-foreground underline underline-offset-2 hover:text-muted-foreground">
						Privacy Policy
					</Link>
					. The full rules are on{' '}
					<Link href="/about" className="text-foreground underline underline-offset-2 hover:text-muted-foreground">
						About vomatt
					</Link>
					.
				</p>
			</div>
		</section>
	);
}
