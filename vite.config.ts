import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import fs from "fs";
import { defineConfig } from "vite";

// 获取当前分支 commitId
let commitId = "";
if (fs.existsSync(".git")) {
  try {
    commitId = execSync("git rev-parse --short HEAD").toString().trim();
  } catch (error) {
    commitId = "";
  }
}

const buildTime = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai" // 使用中国时区
}).format(new Date());

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]"
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  define: {
    __COMMITID__: JSON.stringify(commitId),
    __BUILDTIME__: JSON.stringify(buildTime)
  },
  server: {
    hmr: true
  }
});
