import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zhumyn.com',
  trailingSlash: 'always',
  // Пока на главной нет сайта-визитки, ведём в портфолио. Когда появится src/pages/index.astro, уберите эту строку.
  redirects: { '/': '/product/' },
  integrations: [
    // Связи между языками (hreflang) прописаны в <head> каждой страницы, поэтому в sitemap i18n не нужен
    sitemap({ filter: (page) => !page.includes('/design-system') }),
  ],
});
