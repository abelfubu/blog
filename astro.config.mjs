import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://abelfubu.dev',
  integrations: [
    expressiveCode({
      themes: ['poimandres'],
      plugins: [pluginLineNumbers()],
    }),
    mdx(),
    sitemap(),
    tailwind(),
  ],
});
