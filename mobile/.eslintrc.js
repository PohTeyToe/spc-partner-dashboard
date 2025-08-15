module.exports = {
  root: true,
  extends: ['universe/native', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react-native/all', 'prettier'],
  plugins: ['react', 'react-hooks', 'react-native'],
  env: {
    'react-native/react-native': true
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};

