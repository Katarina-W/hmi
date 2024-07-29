import { Spin } from "antd";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const MainView = React.lazy(() => import("./views/MainView"));
const ReplayView = React.lazy(() => import("./views/ReplayView"));

const App = () => {
  return (
    <BrowserRouter>
      <React.Suspense
        fallback={<Spin size="large" tip="loading..." fullscreen></Spin>}
      >
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/replay" element={<ReplayView />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
