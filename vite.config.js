// 20230317 개발서버 배포
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.jsx",
    }
  )],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  extensions: ['.js', '.jsx'],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://hitobito-net.com/api",
        // target: "http://localhost:8081/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
        watch: true,
        ws: true,
      },
      "/apple": {
        target: "https://appleid.apple.com",
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
  },
});
