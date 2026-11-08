/** @type {import('tailwindcss').Config} */
const sharedConfig = require('@officex/theme/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    ...sharedConfig.content,
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
}
