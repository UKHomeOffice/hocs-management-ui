module.exports = {
    env: {
        es6: true,
        node: true
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // TODO: This needs reviewing HOCS-2431
        '@typescript-eslint/no-explicit-any': 'off', // TODO: This need reviewing HOCS-2432
        '@typescript-eslint/no-var-requires': 'off', // TODO: This need reviewing HOCS-2433
        '@typescript-eslint/no-empty-function': 'off', // TODO: This needs reviewing HOCS-2434
        '@typescript-eslint/no-unused-vars': 'off', // TODO: This needs reviewing HOCS-2435
        '@typescript-eslint/no-non-null-assertion': 'off', // TODO: This needs reviewing HOCS-2436
        '@typescript-eslint/ban-ts-comment': 'off', // TODO: This needs reviewing HOCS-2437
        'react/prop-types': 'off', // TODO: This needs reviewing HOCS-2438
        'react/no-children-prop': 'off', // TODO: This needs reviewing HOCS-2439
        'indent': [
            'error',
            4
            , { 'SwitchCase': 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        // TODO: this needs looking at HOCS-2435
        'no-unused-vars': 'off',
        /*'no-unused-vars': [
            'error',
            { 'argsIgnorePattern': '^_$'  }
        ],*/
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'object-curly-spacing': [
            'error', 'always'
        ],
        'no-trailing-spaces': [
            'error'
        ]
    },
    overrides: [
        {
            'files': ['*.ts', '*.tsx'],
            'rules': {
                '@typescript-eslint/semi': ['error'],
                'semi': 'off'
            }
        }
    ]
};
