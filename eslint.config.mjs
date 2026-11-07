import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
	...nextVitals,
	...nextTs,
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},

		rules: {
			'simple-import-sort/imports': 'warn',
			'simple-import-sort/exports': 'warn',
			'react-hooks/exhaustive-deps': 'error',
			// vomatt-web's rule, so the homepage's copies of its meta lines keep its separator
			'no-restricted-syntax': [
				'error',
				{
					selector: ':matches(Literal[value=/\\u00b7/], TemplateElement[value.raw=/\\u00b7/], JSXText[value=/\\u00b7/])',
					message: 'Separate meta parts with META_GAP from @/i18n/messages, not a middle dot (see DESIGN.md).',
				},
			],
		},
	},
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
]);
