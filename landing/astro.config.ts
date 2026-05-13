// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: "static",
  preview: {
    allowedHosts: ["hormone-exchange-modelling-satin.trycloudflare.com"],
  },
  vite: {
    server: {
      allowedHosts: ["infections-angle-refer-trustees.trycloudflare.com"],
      proxy: {
        "/uploads": {
          target: "http://localhost:1337",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ["html2canvas", "jspdf"],
    },
  },
});
