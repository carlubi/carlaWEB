/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: { burgundy: '#691B32', ink: '#3B252D', muted: '#6B5960', blush: '#E9D4D9', cream: '#F6E2B3', warm: '#F3C969', paper: '#F8F5ED', sand: '#D9B66B', softRose: '#864359' },
      fontFamily: { sans: ['"Canva Sans"', 'Arial', 'system-ui', 'sans-serif'], brand: ['Nunito', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 18px 45px rgba(105, 27, 50, .10)' }
    }
  },
  plugins: []
};
