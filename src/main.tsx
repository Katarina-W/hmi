import "@/styles/index.less";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 版本信息
console.log(`%cBuild Time:  ${__BUILDTIME__}`, "color: #3488ff");
console.log(`%cLast Commit: ${__COMMITID__}`, "color: #3488ff");
