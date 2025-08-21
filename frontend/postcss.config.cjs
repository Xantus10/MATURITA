module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-mantine': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-media-queries': true
      }
    },
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};