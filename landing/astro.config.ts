// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: "static",
  server: {
    allowedHosts: true,
  },
  vite: {
    server: {
      allowedHosts: true,
      proxy: {
        "/uploads": {
          target: "http://localhost:1338",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ["html2canvas", "jspdf"],
    },
  },
});
