import type { NextConfig } from 'next';

import { movedPageRedirects } from './src/lib/movedPages';

const nextConfig: NextConfig = {
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
	// No per-instance copy of `use cache` entries: /api/revalidate expires tags only on the
	// instance it runs on, so a warm instance would re-render a page with pre-publish content
	cacheMaxMemorySize: 0,
	partialPrefetching: true,
	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css',
			},
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
				pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/**`,
			},
		],
	},
	poweredByHeader: false,
	// Old links to a page that moved into another still land there
	async redirects() {
		return movedPageRedirects();
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains',
					},
				],
			},
		];
	},
};

export default nextConfig;
