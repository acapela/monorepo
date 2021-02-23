const openSansSystemStack = [
  "Open Sans",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
];

module.exports = {
  purge: ["./src/**/*.tsx", "./pages/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: openSansSystemStack,
      display: openSansSystemStack,
      body: openSansSystemStack,
    },
  },
  variants: {
    animation: ["responsive", "motion-safe", "motion-reduce"],
    extend: {
      translate: ["active"],
      ringWidth: ["focus-visible"],
    },
  },
  plugins: [],
};
