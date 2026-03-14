import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://bhagavad.net',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
