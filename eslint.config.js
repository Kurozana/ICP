const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/**', '.cache/**', 'coverage/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: { ...globals.node },
        },
        rules: {
            // Style / cleanup: reported as warnings, they don't fail `npm run lint`
            'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
            'no-empty': 'warn',
            'no-useless-escape': 'warn',
            'no-prototype-builtins': 'warn',
            // Everything else in js.configs.recommended (undefined variables, unreachable code, ...) stays an error
        },
    },
    {
        // Code passed to page.evaluate / waitForFunction runs in the browser and uses document, window, ...
        files: ['Pages/**/*.js', 'RequestTypes/**/*.js'],
        languageOptions: {
            globals: { ...globals.node, ...globals.browser },
        },
    },
];
