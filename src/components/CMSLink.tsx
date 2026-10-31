import clsx from 'clsx';
import NextLink from 'next/link';
import React from 'react';

type CMSLinkType = {
	link?: {
		_type: string;
		linkType?: string;
		href?: string;
		isNewTab: boolean;
	};
	title?: string;
	ariaLabel?: string;
	children?: React.ReactNode;
	className?: string;
	isNewTab?: boolean;
	isButton?: boolean;
	tabIndex?: number;
	onClick?: () => void;
};

const CMSLink: React.FC<CMSLinkType> = ({
	link,
	title,
	children,
	className,
	ariaLabel,
	isNewTab,
	isButton,
	...props
}) => {
	if (!link?.href) {
		return null;
	}

	// A relative external link is a vomatt-web route (/explore, /login); internal links are pages on this site
	const route =
		link.linkType === 'external' && link.href.startsWith('/')
			? `${process.env.NEXT_PUBLIC_APP_URL}${link.href}`
			: link.href;
	const isOpenNewTab = isNewTab ?? link.isNewTab;

	return (
		<NextLink
			href={route}
			target={route?.match('^mailto:') || isOpenNewTab ? '_blank' : ''}
			rel={isOpenNewTab ? 'noopener noreferrer' : ''}
			aria-label={ariaLabel || `${title || `Go to ${route}`}`}
			className={clsx(className, {
				btn: isButton,
			})}
			{...props}
		>
			{title || children}
		</NextLink>
	);
};

export default CMSLink;
