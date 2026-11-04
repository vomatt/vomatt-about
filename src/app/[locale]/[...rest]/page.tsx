import { notFound } from 'next/navigation';

// Any deeper path is a 404, shown in the locale's own layout rather than Next's bare default
export default function UnknownPage() {
	notFound();
}
