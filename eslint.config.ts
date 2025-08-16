import { fixupConfigRules } from '@eslint/compat';

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ['**/node_modules', '**/dist', '**/storybook-static', '**/test-results'],
}, ...fixupConfigRules(compat.extends(
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:storybook/recommended',
)), {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },

        'import/resolver': {
            typescript: true,
            node: true,
        },
    },

    rules: {
        indent: ['error', 4],
        'no-continue': ['warn'],
        'no-console': ['error'],
        'class-methods-use-this': ['warn'],
        'import/no-cycle': ['warn'],
        'import/prefer-default-export': ['warn'],
        'import/extensions': ['error', 'ignorePackages'],
        'no-plusplus': 'off',
        'no-await-in-loop': 'off',
        'no-use-before-define': 'off',
    },
}, {
    files: [
        'packages/react/**/*.{js,jsx,ts,tsx}',
        'storybook/**/*.{js,jsx,ts,tsx}',
    ],

    plugins: {
        react,
        'react-refresh': reactRefresh,
        'react-hooks': reactHooks,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
        },

        ecmaVersion: 'latest',
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },

            requireConfigFile: false,
        },
    },

    settings: {
        react: {
            version: '18.2',
        },
    },

    rules: {
        'react-refresh/only-export-components': ['warn', {
            allowConstantExport: true,
        }],
        'react/prop-types': 'off',
    },
}, {
    files: [
        'tests/**/*.{js,jsx,ts,tsx}',
        'packages/react-test/**/*.{js,jsx,ts,tsx}',
        'scripts/**/*.{js,jsx,ts,tsx}',
    ],

    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
}];
