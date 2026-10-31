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
