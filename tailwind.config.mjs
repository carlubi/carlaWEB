/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: { petroleum: '#1F5C8B', ink: '#1C3A52', muted: '#4B6477', sky: '#C0D9DF', cream: '#F6E2B3', warm: '#F3C969', deepTeal: '#315B70', quietSage: '#E6EBE6', paper: '#F8F5ED', sand: '#D9B66B', softBlue: '#587989' },
      fontFamily: { sans: ['"Canva Sans"', 'Arial', 'system-ui', 'sans-serif'], brand: ['Nunito', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 18px 45px rgba(31, 92, 139, .10)' }
    }
  },
  plugins: []
};
