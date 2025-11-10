import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.config({
		extends: [
			"next/core-web-vitals",
			"next/typescript",
			"plugin:prettier/recommended",
		],
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
];

export default eslintConfig;
