module.exports = {
  root: true,
  parserOptions: {
    project: `./tsconfig.eslint.json`,
    tsconfigRootDir: __dirname,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: { '@typescript-eslint/interface-name-prefix': 0 },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
};
