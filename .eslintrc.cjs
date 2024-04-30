const rulesCommon = {
	// general
	'no-console': 'error',
	'dot-notation': 'off',
	'@typescript-eslint/dot-notation': 'error',
	'@typescript-eslint/consistent-type-assertions': 'off',

	// xo mods
	// https://github.com/xojs/eslint-config-xo-typescript/blob/main/index.js
	'no-labels': 'off',
	'no-unused-labels': 'off',
	'no-extra-label': 'off',
	'no-eq-null': 'off',
	eqeqeq: ['error', 'always', { null: 'ignore' }],
	'@typescript-eslint/class-literal-property-style': ['error', 'fields'],
	'no-await-in-loop': 'off',
	'new-cap': 'off',
	'@typescript-eslint/array-type': [
		'error',
		{
			default: 'array',
		},
	],
	'@typescript-eslint/ban-types': [
		'error',
		{
			extendDefaults: false,
			types: {
				String: {
					message: 'Use `string` instead.',
					fixWith: 'string',
				},
				Number: {
					message: 'Use `number` instead.',
					fixWith: 'number',
				},
				Boolean: {
					message: 'Use `boolean` instead.',
					fixWith: 'boolean',
				},
				Symbol: {
					message: 'Use `symbol` instead.',
					fixWith: 'symbol',
				},
				BigInt: {
					message: 'Use `bigint` instead.',
					fixWith: 'bigint',
				},
				Object: {
					message:
						'The `Object` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead. See https://github.com/typescript-eslint/typescript-eslint/pull/848',
					fixWith: 'Record<string, unknown>',
				},
				object: {
					message:
						'The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848',
					fixWith: 'Record<string, unknown>',
				},
				Function:
					'Use a specific function type instead, like `() => void`.',
				null: {
					message:
						'Use `undefined` instead. See: https://github.com/sindresorhus/meta/issues/7',
					fixWith: 'undefined',
				},
				Buffer: {
					message:
						'Use Uint8Array instead. See: https://sindresorhus.com/blog/goodbye-nodejs-buffer',
					suggest: ['Uint8Array'],
				},
			},
		},
	],
	'@typescript-eslint/naming-convention': [
		'error',
		{
			selector: [
				'variable',
				'classProperty',
				'accessor',
				'objectLiteralProperty',
			],
			format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'],
			leadingUnderscore: 'forbid',
			trailingUnderscore: 'forbid',
			filter: {
				regex: '[- ]',
				match: false,
			},
		},
		{
			selector: [
				'function',
				'parameterProperty',
				'classMethod',
				'objectLiteralMethod',
				'typeMethod',
			],
			format: ['strictCamelCase'],
			leadingUnderscore: 'forbid',
			trailingUnderscore: 'forbid',
			filter: {
				regex: '[- ]',
				match: false,
			},
		},
		{
			selector: 'typeLike',
			format: ['StrictPascalCase'],
		},
		{
			// interface name should not be prefixed with `I`.
			selector: 'interface',
			filter: /^(?!I)[A-Z]/.source,
			format: ['StrictPascalCase'],
		},
		{
			// type parameter name should either be `T` or a descriptive name.
			selector: 'typeParameter',
			filter: /^T$|^[A-Z][a-zA-Z]+$/.source,
			format: ['StrictPascalCase'],
		},
		{
			// type name should not be prefixed with `T`.
			selector: 'typeAlias',
			filter: /^(?!T)[A-Z]/.source,
			format: ['StrictPascalCase'],
		},
		// allow these in non-camel-case when quoted.
		{
			selector: ['classProperty', 'objectLiteralProperty'],
			format: null,
			modifiers: ['requiresQuotes'],
		},
	],
	'capitalized-comments': 'off',
	'@typescript-eslint/no-redeclare': 'off', // not recommended for new projects any more
	'no-bitwise': 'off',
	'@typescript-eslint/no-empty-function': [
		'error',
		{
			allow: [
				'decoratedFunctions',
				'overrideMethods',
				'private-constructors',
				'protected-constructors',
			],
		},
	],
	'no-return-assign': 'off',
};
const rulesTs = { ...rulesCommon };
const rulesJs = {
	...Object.fromEntries(
		Object.entries(rulesCommon).filter(
			([k]) => !k.startsWith('@typescript-eslint/'),
		),
	),
};

module.exports = {
	overrides: [
		{
			files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
			extends: ['xo', 'prettier', 'plugin:prettier/recommended'],
			rules: rulesJs,
		},
		{
			files: ['**/*.ts', '**/*.cts', '**/*.mts'],
			extends: [
				'xo',
				'xo-typescript',
				'prettier',
				'plugin:prettier/recommended',
			],
			rules: rulesTs,
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	env: {
		node: false,
		browser: true,
	},
	plugins: ['@typescript-eslint', 'only-warn'],
	settings: {},
};
