module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'no-var': 'error',
    'react/jsx-filename-extension': [0, { extensions: ['.js', '.jsx'] }],
    'import/extensions': 'off',
    'no-use-before-define': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-trailing-spaces': 'off',
    'no-console': 'off',
    'react/prop-types': 'off',
    'consistent-return': 'off',
    eqeqeq: 'off',
  },
};
