import { message } from "antd";
import { MessageType } from "antd/es/message/interface";
import JSZip from "jszip";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import MainView from "../MainView";
import Uploader from "./components/Uploader";
import { Replayer } from "./utils/replayer";

const MESSAGE_KEY = "hmi_fetch_message";

const ReplayView = () => {
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchZIP = useCallback(
    async (url: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const zip = await JSZip.loadAsync(blob);
        const hmiFiles: Promise<string>[] = [];
        zip.forEach((path, file) => {
          if (path.endsWith(".hmi")) {
            hmiFiles.push(file.async("string"));
          }
        });
        const files = await Promise.all(hmiFiles);
        console.log(files);
        messageApi.open({
          key: MESSAGE_KEY,
          type: "success",
          content: "hmi文件加载成功"
        });
      } catch (error) {
        messageApi.open({
          key: MESSAGE_KEY,
          type: "error",
          content: "hmi文件加载失败"
        });
      }
    },
    [messageApi]
  );

  useEffect(() => {
    const replayer = new Replayer();

    // SSE 平台
    const path = searchParams.get("path");
    const bucketName = searchParams.get("bucketName");
    // SIM 平台
    const id = searchParams.get("id");
    // 场景管理 平台
    const zipPath = searchParams.get("zipPath");

    let msgInstance: MessageType | null = null;

    if (path && bucketName) {
      console.log("SSE");
    } else if (id) {
      console.log("SIM");
    } else if (zipPath) {
      msgInstance = messageApi.open({
        key: MESSAGE_KEY,
        duration: 0,
        type: "loading",
        content: "hmi文件加载中..."
      });
      fetchZIP(
        `https://10.151.5.77:30889${zipPath}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20240730%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240730T030724Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=02b0edfa9fdbf157816a9dfeca151f0a704fc6b11e08501a16f80b5a41600ceb`
      );
    }

    return () => {
      msgInstance?.();
      replayer.dispose();
    };
  }, [fetchZIP, messageApi]);

  return (
    <>
      {contextHolder}
      {searchParams.size ? <MainView /> : <Uploader />}
    </>
  );
};

export default ReplayView;
