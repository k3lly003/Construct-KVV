import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#0B46DD",
        secondaryBlue: "#307FE2",
        greenMain: "#71C154",
        greenHover: "#3B8422",
        warningRed: "#C92B08",
        black: "#000000",
        primaryGrey: "#F0F8FF",
        textBlack: "#151D48",
        secondaryGrey: "#737791",
        Herobackground: 'rgba(208, 202, 151, 1)',
      },
    },
  },
  plugins: [],
};
export default config;