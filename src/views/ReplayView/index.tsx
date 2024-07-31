import { message } from "antd";
import type { MessageType } from "antd/es/message/interface";
import JSZip from "jszip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import renderEmitter from "@/renderer/utils/renderEmitter";
import { formatHMIData } from "@/utils/format";

import MainView from "../MainView";
import Uploader from "./components/Uploader";

const ReplayView = () => {
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [filesLength, setFilesLength] = useState(0);
  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    worker.current = new Worker(
      new URL("./workers/local.worker.ts", import.meta.url),
      {
        type: "module"
      }
    );

    const onData = (data: { timestamp: number; text: string }) => {
      if (data.text.startsWith("{") && data.text.endsWith("}")) {
        const res = formatHMIData(data.text);
        if (!res) return;
        renderEmitter.emit(res.topic, res);
      } else {
        const jsonData = window.atob(data.text);
        try {
          let data;
          if (jsonData[0] === "{") {
            data = jsonData;
          } else {
            const uint8buffer = new Uint8Array(jsonData.length);
            for (let i = 0; i < jsonData.length; i++) {
              uint8buffer[i] = jsonData.charCodeAt(i);
            }
            data = uint8buffer.buffer;
          }
          data = formatHMIData(data);
          if (!data) return;
          renderEmitter.emit(data.topic, data);
        } catch (error) {
          // console.log(error);
        }
      }
    };

    worker.current.onmessage = (ev) => {
      const { type, data } = ev.data;
      switch (type) {
        case "duration":
          console.log(data);
          break;
        case "data":
          onData(data);
      }
    };
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
