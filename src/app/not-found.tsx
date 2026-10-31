import Link from 'next/link';

import { buttonVariants } from '@/components/ui/Button';

export default function NotFound() {
	return (
		<div className="empty-state flex flex-col items-start gap-3">
			<h1 className="item-title text-foreground">Page not found</h1>
			<p>We couldn’t find what you were looking for.</p>
			<Link href="/" className={buttonVariants({ className: 'mt-2' })}>
				Go home
			</Link>
		</div>
	);
}
