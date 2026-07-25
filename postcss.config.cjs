module.exports = {
  plugins: {
    tailwindcss: {},
    // `remove: false` keeps hand-written prefixes that autoprefixer would
    // otherwise strip as redundant under its default browserslist — Safari
    // only dropped the `-webkit-` prefix on `backdrop-filter` in 18, so
    // removing it silently kills the popover blur on Safari 16/17.
    autoprefixer: { remove: false },
  },
};
