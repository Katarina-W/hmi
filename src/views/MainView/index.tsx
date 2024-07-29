import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

import Monitor from "@/components/Monitor";
import Renderer from "@/renderer";
import { CANVAS_ID } from "@/renderer/constants";
import RenderScene from "@/renderer/utils/RenderScene";

import styles from "./index.module.less";

interface SSEProps {
  path: string;
  bucketName: string;
}

interface SIMProps {
  id: string;
}

interface ZIPProps {
  zipPath: string;
}

type MainViewProps = SSEProps | SIMProps | ZIPProps;

// 函数重载定义
function MainView(props: SSEProps): JSX.Element;
function MainView(props: SIMProps): JSX.Element;
function MainView(props: ZIPProps): JSX.Element;
function MainView(): JSX.Element;
function MainView(props?: MainViewProps): JSX.Element {
  const renderer = useRef<RenderScene | null>();

  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<Memory>();

  useEffect(() => {
    if (props) {
      if ("path" in props && "bucketName" in props) {
        console.log("SSEProps:", props);
      } else if ("id" in props) {
        console.log("SIMProps:", props);
      } else if ("zipPath" in props) {
        console.log("ZIPProps:", props);
      }
    } else {
      console.log("No props or unknown props");
    }
    renderer.current = new Renderer();
    renderer.current.initialize(CANVAS_ID);
    renderer.current.stats.on("fps", (fps) => {
      setFps(fps);
    });
    renderer.current.stats.on("memory", (memory) => {
      setMemory(memory);
    });
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);

  return (
    <section className={classNames(styles["page-wrapper"])}>
      <div
        id={CANVAS_ID}
        className={classNames(styles["canvas-wrapper"])}
      ></div>
      <div className={classNames(styles["monitor-wrapper"])}>
        <Monitor
          fps={fps}
          memory={memory}
          geometries={renderer.current?.renderer.info.memory.geometries}
          textures={renderer.current?.renderer.info.memory.textures}
        />
      </div>
    </section>
  );
}

export default MainView;
