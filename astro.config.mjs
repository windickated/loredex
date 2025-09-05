// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  vite: {
    build: {
      // Raise limit to avoid noisy warnings from large data-driven chunks
      chunkSizeWarningLimit: 800,
    },
  },
});
