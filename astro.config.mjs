import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bhagavad.net',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [
    preact(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      filter: (page) => !page.includes('/og/') && !page.includes('/_'),
      serialize(item) {
        // Boost canonical landing pages, demote deep verse pages slightly
        if (item.url === 'https://bhagavad.net/') item.priority = 1.0;
        else if (item.url === 'https://bhagavad.net/book/') item.priority = 0.9;
        else if (/\/chapter\/\d+\/$/.test(item.url)) item.priority = 0.8;
        else if (/\/verse\/\d+\/\d+\/$/.test(item.url)) item.priority = 0.6;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
