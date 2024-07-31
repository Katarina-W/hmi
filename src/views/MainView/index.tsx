import { Spin } from "antd";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

import Monitor from "@/components/Monitor";
import { CANVAS_ID } from "@/constants";
import Renderer from "@/renderer";
import RenderScene from "@/renderer/utils/RenderScene";

import styles from "./index.module.less";
function MainView(props: {
  onLoaded?: (renderer: RenderScene) => void;
}): JSX.Element {
  const renderer = useRef<RenderScene | null>();
  const [loading, setLoading] = useState(true);
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<Memory>();

  useEffect(() => {
    const rendererInstance = new Renderer();

    rendererInstance.on("loaded", function () {
      rendererInstance.initialize(CANVAS_ID);
      setLoading(false);
      props.onLoaded?.(rendererInstance);
    });
    rendererInstance.stats.on("fps", (fps) => {
      setFps(fps);
    });
    rendererInstance.stats.on("memory", (memory) => {
      setMemory(memory);
    });
    renderer.current = rendererInstance;
    return () => {
      rendererInstance.dispose();
      renderer.current = null;
    };
  }, []);

  return (
    <>
      <Spin size="large" tip="loading..." fullscreen spinning={loading}></Spin>
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
    </>
  );
}

export default MainView;
