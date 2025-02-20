module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0,
    'import/prefer-default-export': 'warn',
    quotes: 'warn',
    'no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': 0,
    'no-empty-pattern': 'warn',
    'max-len': ['warn', { code: 120 }],
  },
};
