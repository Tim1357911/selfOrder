/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF8A65", // Pastel Orange/Coral
        secondary: "#FFD180", // Lighter Orange accent
        "background-light": "#FAFAFA",
        "background-dark": "#121212",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E1E1E",
        "text-main": "#2D3436",
        "text-muted": "#636E72",
        coffee: {
          light: '#d4a574',
          DEFAULT: '#FF8A65',
          dark: '#3c2415',
        }
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "1rem",
        'xl': "1.25rem",
        '2xl': "1.5rem",
        '3xl': "2rem"
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(255, 138, 101, 0.4)'
      }
    },
  },
  plugins: [],
}
