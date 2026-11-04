import { SectionHeading } from './shared';
import { type Step, StepsScroller } from './StepsScroller';

const STEPS: Step[] = [
	{
		title: 'Ask a question',
		body: 'Write the question, add the options and pick when it closes. Make it public, share a link, or invite only the people who should answer.',
	},
	{
		title: 'Everyone votes, sealed',
		body: 'Each person picks one option. While the poll is open, everyone sees how many people have voted, never which way. Changed your mind? Pick another option until it closes.',
	},
	{
		title: 'The result, for everyone',
		body: 'When the poll closes, the seal comes off. Everyone sees the result at the same moment, and everyone who voted gets a notification.',
	},
];

export function HowItWorks() {
	return (
		<section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-8">
			<StepsScroller
				header={
					<SectionHeading
						id="how-it-works-title"
						eyebrow="How it works"
						title="One poll, from question to result"
						intro="Here’s one poll from the first word to the result. Nobody sees the count until it closes."
					/>
				}
				steps={STEPS}
			/>
		</section>
	);
}
