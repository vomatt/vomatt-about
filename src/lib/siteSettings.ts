import { sanityFetch } from '@/sanity/lib/live';
import { siteSharingQuery } from '@/sanity/lib/queries';

// The site still renders when Sanity is down, without its title and analytics
export const getSiteSettings = () =>
	sanityFetch({ query: siteSharingQuery })
		.then(({ data }) => data)
		.catch((error) => {
			console.error('Failed to load site settings from Sanity', error);
			return null;
		});
