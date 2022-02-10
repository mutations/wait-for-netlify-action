module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    'no-alert': 'error',
    'no-console': 'off', // Actions use console.log
    'no-debugger': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 1,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            message: 'Use individual lodash packages',
            name: 'lodash',
          },
          {
            message: 'Use date-fns',
            name: 'moment',
          },
        ],
      },
    ],
    'no-trailing-spaces': 'error',
    'no-warning-comments': 'warn',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
    ],
    'prefer-template': 'error',
    semi: ['error', 'never'],
  },
}
