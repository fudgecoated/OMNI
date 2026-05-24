import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        timeout: 180_000,
        proxyTimeout: 180_000,
      },
      "/health": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
});
