module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss')(require('@project/tailwind')),
        require('autoprefixer'),
      ],
    },
  },
}