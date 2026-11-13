import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zhumyn.com',
  trailingSlash: 'always',
  integrations: [
    // Связи между языками (hreflang) прописаны в <head> каждой страницы, поэтому в sitemap i18n не нужен
    sitemap({ filter: (page) => !page.includes('/design-system') }),
  ],
});
