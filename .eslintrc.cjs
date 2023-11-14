module.exports = {
    root: true,
    extends: [
        `eslint:recommended`,
        `plugin:@typescript-eslint/recommended`,
    ],
    parser: `@typescript-eslint/parser`,
    plugins: [`@typescript-eslint`],
    parserOptions: {
        sourceType: `module`,
        ecmaVersion: 2020,
        extraFileExtensions: [`.svelte`]
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    overrides: [
        {
            files: [`*.svelte`],
            parser: `svelte-eslint-parser`,
            parserOptions: {
                parser: `@typescript-eslint/parser`,
            },
        },
    ],
    rules: {
        "arrow-parens": [`error`, `as-needed`, { requireForBlockBody: false }],
        "no-constant-condition": [`error`, { "checkLoops": false }],
        // disallow semi-colon
        "semi": [`error`, `never`],
        "quotes": [`error`, `backtick`],
        "array-element-newline": [`error`, `consistent`],
        "no-self-assign": `off`,
        "indent": [`error`, 4, { "SwitchCase": 1 }],
        "@typescript-eslint/no-unused-vars": [`warn`, { "argsIgnorePattern": `^_` }],
        "@typescript-eslint/consistent-type-imports": [`error`, { prefer: `type-imports` }],
    }
}