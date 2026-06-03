import { fileURLToPath } from "node:url";
import { viteHtmlLoader } from "@hilosiva/vite-plugin-html-loader";
import { viteImageOptimizer } from "@hilosiva/vite-plugin-image-optimizer";
import { defineConfig } from "vite";
import vaultcss from "vite-plugin-vaultcss";

const dir = {
  src: "src",
  publicDir: "public",
  outDir: "dist",
};

export default defineConfig({
  root: dir.src,
  publicDir: `../${dir.publicDir}`,
  plugins: [
    vaultcss({
      fluid: {
        minViewPort: 375,
        maxViewPort: 1440, // 対応する画面サイズの最大値
        baseFontSize: 16, // ベースフォントサイズ
        unit: "vi", // 使用する単位
        minCompSize: 440, // カンプサイズの最小値
        maxCompSize: 1440, // カンプサイズの最大値
        mode: "snap", // モード
      },
    }), 
    
    viteHtmlLoader(),
    viteImageOptimizer({
      generate: {
        preserveExt: true,
      },
    }),
  ],
  build: {
    outDir: `../${dir.outDir}`,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/scripts/[name]-[hash].js",
        chunkFileNames: "assets/scripts/[name]-[hash].js",
        assetFileNames: ({ names }) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(names[0] ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.css$/.test(names[0] ?? "")) {
            return "assets/styles/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    assetsInlineLimit: 0,
    write: true,
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    open: true,
  },

  css: {
    devSourcemap: true,
  },
});
