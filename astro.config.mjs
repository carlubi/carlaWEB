import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import adventLocalEditor from './scripts/adviento-local-editor.mjs';

export default defineConfig({
  integrations: [tailwind()],
  vite: { plugins: [adventLocalEditor()] },
  site: 'https://carla-lopez.com',
  output: 'static'
});
