module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    // "plugin:prettier/recommended",
    'plugin:import/recommended',
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist'],
  ignorePatterns: ['.eslintrc.js', 'components/ui/*.tsx'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // "perfectionist/sort-imports": [
    //   "error",
    //   {
    //     "type": "alphabetical",
    //     "order": "asc",
    //     "pathGroups": [
    //       {
    //         "pattern": "@/**",
    //         "group": "internal",
    //         "position": "before"
    //       }
    //     ]
    //   },
    // ]
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/order': [
      'error',
      {
        groups: [
          // Imports of builtins are first
          'builtin',

          'external',
          'internal',

          // Then sibling and parent imports. They can be mingled together
          ['sibling', 'parent'],
          // Then index file imports
          'index',
          // Then any arcane TypeScript imports
          'object',
          // Then the omitted imports: internal, external, type, unknown
        ],
        'newlines-between': 'always',
      },
    ],
  },
};
