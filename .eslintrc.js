module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-inner-declaration': 'off',
    'no-inferrable-types': 'off',
    'no-inner-declarations':'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-inner-declarations':'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars':"off",
    '@typescript-eslint/no-empty-function':"off",
  }
}
