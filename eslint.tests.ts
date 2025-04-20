import { fixupConfigRules } from '@eslint/compat';
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
)), {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 'latest',
        sourceType: 'module',

        parserOptions: {
            requireConfigFile: false,
        },
    },

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
        'class-methods-use-this': ['warn'],
        'no-continue': ['warn'],
        'no-console': ['error'],
        'no-plusplus': 'off',
        'no-await-in-loop': 'off',
        'no-use-before-define': 'off',

        'import/no-cycle': ['warn'],
        'import/prefer-default-export': ['warn'],
        'import/extensions': ['error', 'ignorePackages'],
        "import/no-extraneous-dependencies": [
            "error",
            {
                "devDependencies": true
            }
        ],
    },
}];