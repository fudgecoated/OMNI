import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxy = {
  target: "http://127.0.0.1:3002",
  changeOrigin: true,
  timeout: 180_000,
  proxyTimeout: 180_000,
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": apiProxy,
      "/health": apiProxy,
    },
  },
  preview: {
    proxy: {
      "/api": apiProxy,
      "/health": apiProxy,
    },
  },
});
