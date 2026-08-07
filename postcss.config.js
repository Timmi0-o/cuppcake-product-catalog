const path = require('path');

module.exports = {
  plugins: [
    [
      path.resolve(__dirname, 'postcss-plugins/css-alias.js'),
      {
        aliases: {
          '@/tailwind': path.resolve(
            __dirname,
            'src/styles/tailwind-reference.css',
          ),
          '@/tailwindcss': path.resolve(
            __dirname,
            'src/styles/tailwind-reference.css',
          ),
          '@/': path.resolve(__dirname, 'src') + '/',
        },
      },
    ],
    '@tailwindcss/postcss',
    'postcss-nesting',
  ],
};
