/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral scale — GitHub Dark / Linear inspired, not Tailwind's default gray
        canvas: {
          DEFAULT: '#0d1117', // page background
          subtle: '#161b22',  // raised surfaces (cards)
          inset: '#010409',   // wells / inputs
        },
        border: {
          DEFAULT: '#30363d',
          muted: '#21262d',
        },
        ink: {
          DEFAULT: '#e6edf3', // primary text
          muted: '#8b949e',   // secondary text
          faint: '#6e7681',   // tertiary / placeholder
        },
        accent: {
          DEFAULT: '#58a6ff', // single accent — links, primary actions, focus rings
          muted: '#1f6feb',
        },
        good: '#3fb950',
        warning: '#d29922',
        critical: '#f85149',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};
