import { fixupConfigRules } from '@eslint/compat';
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
    ignores: ['**/node_modules', '**/dist', '**/storybook-static'],
}, ...fixupConfigRules(compat.extends(
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
)), {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

    plugins: {
        'react-refresh': reactRefresh,
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

        'react-refresh/only-export-components': ['warn', {
            allowConstantExport: true,
        }],

        'no-use-before-define': 'off',
        'react/prop-types': 'off',
    },
}];