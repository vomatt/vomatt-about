import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildRgbaCssString(color: any) {
	if (!color) {
		return false;
	}

	const r = color?.rgb?.r ?? 255;
	const g = color?.rgb?.g ?? 255;
	const b = color?.rgb?.b ?? 255;
	const a = color?.rgb?.a ?? 1;

	return `rgba(${r}, ${g}, ${b}, ${a})`;
}
