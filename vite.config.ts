/// <reference types="vitest" />

import analog, { PrerenderContentFile } from '@analogjs/platform';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      prerender: {
        routes: async () => [
          '/blog',
          {
            contentDir: 'src/content',
            transform: (file: PrerenderContentFile) =>
              `/blog/${file.attributes['slug'] || file.name}`,
          },
        ],
        sitemap: {
          host: 'https://abelfubu.dev/',
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
