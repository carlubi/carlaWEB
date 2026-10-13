/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: { burgundy: '#691B32', cherryActive: '#521326', ink: '#3B252D', muted: '#6B5960', blush: '#E9D4D9', cream: '#F6E2B3', warm: '#F3C969', paper: '#F8F5ED', sand: '#D9B66B', softRose: '#864359' },
      fontFamily: { sans: ['Inter Tight', 'Arial', 'system-ui', 'sans-serif'], brand: ['Inter Tight', 'Arial', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 2px 6px rgba(59, 37, 45, .04), 0 4px 8px rgba(59, 37, 45, .08)' }
    }
  },
  plugins: []
};
