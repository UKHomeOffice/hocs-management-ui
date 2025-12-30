import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {},
        },

        plugins: {
            '@stylistic': stylistic,
        },

        'settings': {
            'react': {
                'version': 'detect',
            },
        },

        extends: compat.extends(
            'plugin:react/recommended',
            'plugin:@typescript-eslint/recommended'
        ),

        rules: {
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'react/prop-types': 'off',
            'react/no-children-prop': 'off',

            'indent': ['error', 4, {
                'SwitchCase': 1,
            }],

            'linebreak-style': ['error', 'unix'],
            'no-unused-vars': 'off',
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
            'no-trailing-spaces': ['error'],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],

        'rules': {
            '@stylistic/semi': ['error'],
            'semi': 'off',
        },
    },
    globalIgnores(['coverage', 'build', 'node_modules', '.idea'])
]);
