import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import fg from "fast-glob";
import fs from "fs";
import path from "path";
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

/** 计算目录hash */
const hashDirectory = (...args: Parameters<(typeof fg)["globSync"]>) => {
  const files = fg.globSync(...args).sort();
  const hash = crypto.createHash("sha256");

  const cwd = path.resolve(args[1]?.cwd || "");
  for (const file of files) {
    const filePath = path.join(cwd, file);
    const fileBuffer = fs.readFileSync(filePath);
    hash.update(fileBuffer);
  }

  return hash.digest("hex");
};

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
    __BUILDTIME__: JSON.stringify(buildTime),
    __MODEL_DIRECTORY_HASH__: JSON.stringify(
      hashDirectory(["**/*.gltf", "**/*.mtl", "**/*.obj?(s)"], {
        cwd: "src/assets/model"
      })
    )
  },
  server: {
    hmr: true
  }
});
