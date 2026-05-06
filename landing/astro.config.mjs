// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // Output estático por defecto — compatible con SSG
  // Cuando se migre a Strapi Cloud cambiar PUBLIC_STRAPI_URL en el .env
  output: 'static',
});
