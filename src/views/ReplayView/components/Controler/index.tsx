import { PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import { Slider } from "antd";
import classNames from "classnames";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatTime } from "@/utils/format";

import styles from "./index.module.less";

const Controler = (props: {
  state: "play" | "pause";
  startTime: number;
  endTime: number;
  currentTime: number;
  onStateChange: (state: "play" | "pause") => void;
  onSeek: (timestamp: number) => void;
}) => {
  const seeking = useRef(false);
  const [progress, setProgress] = useState(0);

  const currentDuration = useMemo(() => {
    return formatTime(props.currentTime - props.startTime);
  }, [props.currentTime, props.startTime]);

  const totalDuration = useMemo(() => {
    return formatTime(props.endTime - props.startTime);
  }, [props.endTime, props.startTime]);

  useEffect(() => {
    if (seeking.current) return;
    setProgress(props.currentTime - props.startTime);
  }, [seeking.current, currentDuration]);

  useEffect(() => {
    if (props.currentTime === props.endTime) {
      setProgress(props.currentTime - props.startTime);
    }
  }, [props.currentTime, props.endTime]);

  const sliderChange = useCallback((value: number) => {
    if (!seeking.current) seeking.current = true;
    setProgress(value);
  }, []);

  const sliderChangeComplete = useCallback(
    (value: number) => {
      seeking.current = false;
      props.onSeek(value + props.startTime);
    },
    [props.startTime]
  );

  return (
    <div className={classNames(styles["controler"])}>
      <div
        className={classNames(styles["action-btn"])}
        onClick={() =>
          props.onStateChange(props.state === "play" ? "pause" : "play")
        }
      >
        {props.state === "play" ? <PauseCircleFilled /> : <PlayCircleFilled />}
      </div>
      <Slider
        value={progress}
        tooltip={{
          formatter(value) {
            if (!value) return;
            return formatTime(value);
          }
        }}
        max={props.endTime - props.startTime}
        className={classNames(styles["slider"])}
        onChange={sliderChange}
        onChangeComplete={sliderChangeComplete}
      ></Slider>
      <span>
        {currentDuration} / {totalDuration}
      </span>
    </div>
  );
};

export default memo(Controler);
