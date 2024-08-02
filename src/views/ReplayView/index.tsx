import { message } from "antd";
import type { MessageType } from "antd/es/message/interface";
import JSZip from "jszip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainView from "../MainView";
import Uploader from "./components/Uploader";
import { LocalReplay } from "./utils/local";

const ReplayView = () => {
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [filesLength, setFilesLength] = useState(0);
  const worker = useRef<LocalReplay | null>(null);

  useEffect(() => {
    worker.current = new LocalReplay(
      new URL("./utils/local/worker.ts", import.meta.url),
      {
        type: "module"
      }
    );

    return () => {
      worker.current?.terminate();
    };
  }, []);

  const renderView = useMemo(
    () => !!searchParams.size || !!filesLength,
    [searchParams, filesLength]
  );

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
        return files;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    [messageApi]
  );

  useEffect(() => {
    // SSE 平台
    const path = searchParams.get("path");
    const bucketName = searchParams.get("bucketName");
    // SIM 平台
    const id = searchParams.get("id");
    // 场景管理 平台
    const zipPath = searchParams.get("zipPath");

    let msgInstance: MessageType | null = null;
    const MESSAGE_KEY = "hmi_fetch_message";

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
        `https://10.151.5.77:30889${zipPath}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20240730%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240730T075949Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d58a386cb1ec4ab617ed30c0bef852eeed0a0dabb2840cc67660ebaab2f8f3c9`
      )
        .then((res) => {
          console.log(res);
          msgInstance?.();
        })
        .catch(() => {
          messageApi.open({
            key: MESSAGE_KEY,
            type: "error",
            content: "hmi文件加载失败"
          });
        });
    }

    return () => {
      msgInstance?.();
    };
  }, [fetchZIP, messageApi]);

  const onLoaded = useCallback(() => {
    console.log("loaded");
    worker.current?.postMessage({
      type: "play"
    });
  }, []);

  const onFilesChange = useCallback((files: File[]) => {
    console.log(files);
    setFilesLength(files.length);
    worker.current?.postMessage({
      type: "files",
      data: files
    });
  }, []);

  return (
    <>
      {contextHolder}
      {renderView ? (
        <MainView onLoaded={onLoaded} />
      ) : (
        <Uploader onChange={onFilesChange} />
      )}
    </>
  );
};

export default ReplayView;
