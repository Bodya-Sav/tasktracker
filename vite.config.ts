import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [preact()],
    base: isProd ? '/tasktracker/' : '/tasktracker/',
    server: {
      host: "0.0.0.0",
      port: 5175,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@lib": path.resolve(__dirname, "src/lib"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@api": path.resolve(__dirname, "src/api"),
        "@app": path.resolve(__dirname, "src/app"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
