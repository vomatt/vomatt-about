import { markLoaderSvg } from '@/lib/brand/mark';
import { cn } from '@/lib/utils';

// One mark per page (only /about), so a fixed id prefix is enough and the SVG is built once
const MARK_SVG = markLoaderSvg('brand-mark-');

/** The glossy ballot-box mark; a ballot drops into its slot once on load. Decorative. */
export function BrandMark({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn('animate-ballot-drop-once block size-20 [&>svg]:size-full', className)}
			dangerouslySetInnerHTML={{ __html: MARK_SVG }}
		/>
	);
}
