import { Check } from '@/components/ui/SvgIcons';
import { META_GAP } from '@/i18n/messages';
import { cn } from '@/lib/utils';

// The app's own pieces (vomatt-web's BallotMotion, Seal, Results, StatusChip), drawn as still markup
// for the homepage's mock polls. Decorative: callers hide them from assistive tech or label the whole mock.
// The result deliberately marks the winner more strongly than the app does (bar, weight, 22px stamp); see home.css.

/** vomatt-web's chipClassName: a small pill; pair it with a `bg-*` tint. */
export const chipClassName =
	'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] leading-4 font-medium text-foreground';

/** One of the app's avatar drawings (public/avatars), 32px unless a size goes beside it. */
export function Avatar({ name, className }: { name: string; className?: string }) {
	return (
		// eslint-disable-next-line @next/next/no-img-element -- tiny static SVGs gain nothing from next/image
		<img
			src={`/avatars/${name}.svg`}
			alt=""
			width={32}
			height={32}
			loading="lazy"
			className={cn('avatar-frame bg-muted', className)}
		/>
	);
}

/** The ballot's 22px radio mark: an `input` ring at rest; chosen, ink around a Volt check. */
export function BallotMark({ selected = false, className }: { selected?: boolean; className?: string }) {
	return (
		<span
			className={cn(
				'grid size-[22px] shrink-0 place-items-center rounded-full',
				selected ? 'bg-highlight-foreground' : 'border-2 border-input bg-card',
				className
			)}
		>
			{selected && <Check size={12} strokeWidth={3.5} className="text-highlight" />}
		</span>
	);
}

const SEAL_SIZES = {
	sm: { ring: 'size-8', dashed: null, disc: 'size-[13px]', check: 'size-2' },
	md: { ring: 'size-10', dashed: 'inset-[2.5px] border', disc: 'size-[18px]', check: 'size-2.5' },
	lg: { ring: 'size-[72px]', dashed: 'inset-[5px] border-[1.5px]', disc: 'size-[34px]', check: 'size-4' },
};

/** A Tide ring (vomatt's promise) around a Volt check (the voter's own vote). */
export function SealMark({ size = 'sm', className }: { size?: keyof typeof SEAL_SIZES; className?: string }) {
	const { ring, dashed, disc, check } = SEAL_SIZES[size];
	return (
		<span className={cn('relative grid shrink-0 place-items-center rounded-full border-2 border-tide', ring, className)}>
			{dashed && <span className={cn('absolute rounded-full border-dashed border-tide', dashed)} />}
			<span className={cn('grid place-items-center rounded-full bg-highlight text-highlight-foreground', disc)}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={3.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					className={check}
				>
					<path d="M5 13l4 4L19 7" />
				</svg>
			</span>
		</span>
	);
}

/** The red ballot stamp (a ring with a 卜 mark) on a winning result. */
export function ElectedStamp({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 130 130" className={cn('size-[22px] shrink-0 text-elected', className)}>
			<circle cx="65" cy="65" r="60.3" fill="none" stroke="currentColor" strokeWidth="9.3" />
			<path d="M65 2v126M63.5 63.5 19 108" fill="none" stroke="currentColor" strokeWidth="10" />
		</svg>
	);
}

/** "your vote" on the viewer's result row. Lower-case on purpose. */
export function YourVotePill({ label, className }: { label: string; className?: string }) {
	return (
		<span
			className={cn(
				'shrink-0 whitespace-nowrap rounded-full border border-highlight-foreground bg-highlight px-2 py-0.5 text-[11px] leading-4 font-semibold text-highlight-foreground',
				className
			)}
		>
			{label}
		</span>
	);
}

/** The notification a voter gets when a poll closes: a Tide row, as in the app's unread list. */
export function ResultsNotice({
	label,
	title,
	meta,
	className,
}: {
	label: string;
	title: string;
	meta: string;
	className?: string;
}) {
	return (
		<div className={cn('flex items-center gap-3.5 rounded-xl border border-tide-line bg-tide-tint px-4 py-3.5', className)}>
			<SealMark />
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<p className="text-[15px] leading-snug text-foreground">
					<span className="font-semibold">{label}</span>
					{META_GAP}
					{title}
				</p>
				<p className="text-[12px] text-tide-foreground tabular-nums">{meta}</p>
			</div>
		</div>
	);
}
