import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import MainView from "../MainView";
import Uploader from "./components/Uploader";

export default () => {
  const [searchParams] = useSearchParams();

  const renderView = useCallback(() => {
    // SSE 平台
    const path = searchParams.get("path");
    const bucketName = searchParams.get("bucketName");
    // SIM 平台
    const id = searchParams.get("id");
    // 场景管理 平台
    const zipPath = searchParams.get("zipPath");
    if (path && bucketName) {
      return <MainView path={path} bucketName={bucketName} />;
    } else if (id) {
      return <MainView id={id} />;
    } else if (zipPath) {
      return <MainView zipPath={zipPath} />;
    } else {
      return <Uploader />;
    }
  }, [searchParams]);

  return renderView();
};
