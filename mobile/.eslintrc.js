module.exports = {
  root: true,
  extends: [
    'universe/native',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  rules: {
    // Reduce noise/errors in CI while keeping code readable
    'react-native/sort-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/split-platform-components': 'off',
    'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } }],
  },
};

