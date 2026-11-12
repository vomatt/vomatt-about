import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariantClasses = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-(--radius) border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity,translate] outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary-hover disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100',
				// The create action only; its colours per theme are the --create tokens
				create:
					'bg-create text-create-foreground hover:bg-create-hover [&_svg]:text-create-icon disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100 disabled:[&_svg]:text-muted-foreground',
				outline:
					'border-border-strong bg-card hover:bg-surface-soft hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
			},
			size: {
				default:
					'h-11 gap-2 px-4 text-[15px]',
				// Phones keep the 44px target; from md it takes its own height
				sm: "h-11 gap-1.5 px-3 text-[14px] md:h-9 [&_svg:not([class*='size-'])]:size-3.5",
				lg: 'h-12 gap-2 px-5 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

/**
 * The variant classes merged, so a variant's border or background wins over the base's
 * (`border-border` over `border-transparent`) on a `Link` styled as a button too.
 */
const buttonVariants = (props?: Parameters<typeof buttonVariantClasses>[0]) => cn(buttonVariantClasses(props));

export { buttonVariants };
