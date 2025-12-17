import { FlatCompat } from "@eslint/eslintrc";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...nextCoreWebVitals,
	...nextTypescript,
	...compat.config({
		extends: ["plugin:prettier/recommended"],
		plugins: ["simple-import-sort"],

		rules: {
			"simple-import-sort/imports": [
				"error",
				{ groups: [["^\\u0000", "^node:", "^@?\\w", "^", "^\\."]] },
			],
			"simple-import-sort/exports": "error",
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-duplicates": "error",
			"prettier/prettier": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "off",
		},

		parserOptions: {
			sourceType: "module",
			ecmaVersion: "latest",
		},
	}),
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
];

export default eslintConfig;
