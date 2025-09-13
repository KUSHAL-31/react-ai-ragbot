import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }),
    cssInjectedByJsPlugin(), // This will inject the CSS into JS bundle
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ReactRagbot",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    cssCodeSplit: false, // Keep all CSS in one file
  },
});