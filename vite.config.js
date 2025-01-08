import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "src/wiki/*", dest: "wiki" }, // Copy markdown files to the output
      ],
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 75 },
      webp: { quality: 80 },
      avif: { quality: 70 },
      svg: {
          plugins: [
              { name: 'removeViewBox', active: false },
              { name: 'sortAttrs' },
          ],
      },
      includePublic: true,
      logStats:true
    }),
  ],
  assetsInclude: ['**/*.md']
});
