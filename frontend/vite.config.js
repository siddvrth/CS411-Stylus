import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, path.resolve(__dirname, ".."), "");
  const geminiKey =
    rootEnv.google_studio_api_key || rootEnv.VITE_GOOGLE_STUDIO_API_KEY || "";

  return {
    define: {
      __STYLUS_GEMINI_KEY__: JSON.stringify(geminiKey),
    },
    envDir: path.resolve(__dirname, ".."),
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
    },
  };
});
