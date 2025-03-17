
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        background: path.resolve(__dirname, "public/background.js"),
        contentScript: path.resolve(__dirname, "public/contentScript.js"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "main" ? "assets/[name]-[hash].js" : "[name].js";
        },
      },
    },
  },
}));
