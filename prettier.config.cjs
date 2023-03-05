/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  tabWidth: 2,
  printWidth: 250,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}
