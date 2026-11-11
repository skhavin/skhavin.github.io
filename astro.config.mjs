// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://skhavin.github.io',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
