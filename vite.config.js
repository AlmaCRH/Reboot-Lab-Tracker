//const path = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  root: "./src/renderer",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "./index.html", // Path to the index.html file relative to root
    },
  },
});
