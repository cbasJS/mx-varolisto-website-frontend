import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#000666',
        'primary-fixed': '#e0e0ff',
        'primary-fixed-dim': '#bdc2ff',
        'primary-container': '#1a237e',
        'on-primary': '#ffffff',
        secondary: '#2ECC71',
        'secondary-mobile': '#006e1c',
        'secondary-fixed': '#94f990',
        'secondary-container': '#91f78e',
        'on-secondary': '#ffffff',
        'on-secondary-fixed': '#002204',
        'on-secondary-container': '#00731e',
        error: '#ba1a1a',
        surface: '#fcfcfd',
        'surface-bright': '#f9f9f9',
        'surface-variant': '#e2e2e2',
        'surface-container': '#f3f4f6',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest': '#e2e2e2',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#454652',
        background: '#f9f9f9',
        outline: '#767683',
        'outline-variant': '#c6c5d4',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
        mobile: '0.25rem',
        'mobile-xl': '0.75rem',
      },
      fontFamily: {
        headline: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
