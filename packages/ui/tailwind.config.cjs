/** @type {import('tailwindcss').Config} */

const config = require("../tailwind-config/tailwind.config.cjs");

module.exports = {
  ...config,
  continue: ["./src/**/*.{tsx}"],
};
