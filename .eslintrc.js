module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    // ecmaVersion: 2020,
    sourceType: 'module',
    // tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    createDefaultProgram: true
    // extraFileExtensions: ['.svelte']
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
  },
  settings: {
    'svelte3/typescript': require('typescript'),
    // ignore style tags in Svelte because of Tailwind CSS
    // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
    'svelte3/ignore-styles': () => true
  },
  plugins: ['svelte3', '@typescript-eslint'],
  ignorePatterns: ['node_modules', '.*.js', 'public/build', 'setupTypescript.js', 'rollup.config.js', 'node-scripts/*.js']
}
