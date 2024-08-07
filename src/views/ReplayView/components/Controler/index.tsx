import classNames from "classnames";

import { formatTime, formatTimestamp } from "@/utils/format";

import styles from "./index.module.less";

const Controler = (props: {
  duration: { startTime: number; endTime: number };
  currentTime: number;
}) => {
  return (
    <div className={classNames(styles["controler"])}>
      <span>
        开始时间:{formatTimestamp(props.duration.startTime)}(
        {props.duration.startTime})
      </span>
      <span>
        结束时间:{formatTimestamp(props.duration.endTime)}(
        {props.duration.endTime})
      </span>
      <span>
        总时长:{formatTime(props.duration.endTime - props.duration.startTime)}
      </span>
      <span>
        当前回放时间: {formatTimestamp(props.currentTime)}({props.currentTime})
      </span>
    </div>
  );
};

export default Controler;
