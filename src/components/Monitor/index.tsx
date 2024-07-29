import { Divider, Tooltip } from "antd";
import classNames from "classnames";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

import { HZ } from "@/renderer/constants";
import { ALL_TOPICS } from "@/renderer/constants/topic";
import renderEmitter from "@/renderer/utils/renderEmitter";
import { formatBytes } from "@/utils/format";

import styles from "./index.module.less";

echarts.use([GridComponent, LineChart, CanvasRenderer]);

const MonitorChart = (props: { fps: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts>();
  const chartData = useRef<number[]>([]);

  const colorlist = useRef(["#52c41a", "#fa8c16", "#f5222d"]);
  const [chartStatus, setStatus] = useState(0);

  const initChart = () => {
    chart.current = echarts.init(ref.current);
    chart.current.setOption({
      grid: {
        left: 0,
        top: 5,
        right: 0,
        bottom: 0
      },
      xAxis: {
        show: false,
        type: "category",
        boundaryGap: false
      },
      yAxis: {
        show: false,
        type: "value",
        splitLine: {
          show: false
        },
        boundaryGap: false
      },
      series: [
        {
          data: chartData.current,
          type: "line",
          smooth: false,
          silent: true,
          showSymbol: false,
          animation: false,
          areaStyle: {}
        }
      ]
    });
  };

  const updateChart = (fps: number) => {
    if (fps < 0) return;
    if (chartData.current.length >= 20) chartData.current.shift();
    chartData.current.push(fps);

    let status = 0;
    if (fps < HZ * 0.6) status = 2;
    else if (fps < HZ * 0.8) status = 1;
    if (status !== chartStatus) {
      setStatus(status);
    }
    chart.current?.setOption({
      series: [
        {
          data: chartData.current,
          areaStyle: {
            color: colorlist.current[status]
          },
          itemStyle: {
            color: colorlist.current[status]
          }
        }
      ]
    });
  };

  useEffect(() => {
    initChart();
    return () => {
      chart.current?.dispose();
    };
  }, []);

  if (chart.current) updateChart(props.fps);

  return (
    <section className={classNames(styles["monitor-chart"])}>
      <div
        className={classNames(styles["chart-title"])}
        style={{ color: colorlist.current[chartStatus] }}
      >
        <span>渲染</span>
        <span>{props.fps}fps</span>
      </div>
      <div ref={ref} className={classNames(styles["chart-wrapper"])}></div>
    </section>
  );
};

const MonitorPanel = (props: {
  memory?: Memory;
  geometries?: number;
  textures?: number;
}) => {
  const [ips, setIps] = useState<string[]>([]);
  useEffect(() => {
    renderEmitter.on(ALL_TOPICS.CONN_LIST, (data) => {
      setIps((data as any).conn_list || []);
    });

    return () => {
      renderEmitter.off(ALL_TOPICS.CONN_LIST);
    };
  }, []);
  return (
    <section className={classNames(styles["monitor-panel"])}>
      {props.memory && (
        <div className={classNames(styles["panel-row"])}>
          <span>js内存: {formatBytes(props.memory.usedJSHeapSize)}</span>
          <span>
            内存占比:{" "}
            {(
              (props.memory.usedJSHeapSize / props.memory.jsHeapSizeLimit) *
              100
            ).toFixed(2)}
            %
          </span>
        </div>
      )}
      <div className={classNames(styles["panel-row"])}>
        <span>
          WebGL: {props.geometries ?? 0}/{props.textures ?? 0}
        </span>
        <span className={classNames({ [styles["multi-ips"]]: ips.length > 1 })}>
          <Tooltip
            title={ips.map((ip) => (
              <div>{ip}</div>
            ))}
          >
            实时在线: {ips.length}
          </Tooltip>
        </span>
      </div>
    </section>
  );
};

export default (props: {
  fps: number;
  memory?: Memory;
  geometries?: number;
  textures?: number;
}) => {
  return (
    <section className={classNames(styles["monitor-wrapper"])}>
      <MonitorChart fps={props.fps} />
      <Divider type="vertical" style={{ height: "100%" }} />
      <MonitorPanel
        memory={props.memory}
        geometries={props.geometries}
        textures={props.textures}
      />
    </section>
  );
};
