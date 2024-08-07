import { HZ } from "@/constants";
import type { TopicEvent } from "@/renderer/typings";

import {
  ATTRIBUTE_MAP,
  ProtobufElementSchema
} from "./protobuffer/protobuf_parser";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export function formatTime(ms: number): string {
  if (typeof ms !== "number" || Number.isNaN(ms) || ms <= 0) {
    return "00:00";
  }
  const hour = Math.floor(ms / HOUR);
  ms = ms % HOUR;
  const minute = Math.floor(ms / MINUTE);
  ms = ms % MINUTE;
  const second = Math.floor(ms / SECOND);
  if (hour) {
    return `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
  }
  return `${padZero(minute)}:${padZero(second)}`;
}

export function formatTimestamp(ms: number) {
  if (typeof ms !== "number" || Number.isNaN(ms) || ms <= 0) {
    return "00:00";
  }
  const date = new Date(ms);

  const pad = (num: number, size = 2) => {
    let s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
  };

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function padZero(num: number, len = 2): string {
  let str = String(num);
  const threshold = Math.pow(10, len - 1);
  if (num < threshold) {
    while (String(threshold).length > str.length) {
      str = `0${num}`;
    }
  }
  return str;
}

export function formatBytes(bytes: number, fractionDigits = 2) {
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < Math.pow(1024, 2)) {
    return (bytes / Math.pow(1024, 1)).toFixed(fractionDigits) + " KB";
  } else if (bytes < Math.pow(1024, 3)) {
    return (bytes / Math.pow(1024, 2)).toFixed(fractionDigits) + " MB";
  } else if (bytes < Math.pow(1024, 4)) {
    return (bytes / Math.pow(1024, 3)).toFixed(fractionDigits) + " GB";
  } else if (bytes < Math.pow(1024, 5)) {
    return (bytes / Math.pow(1024, 4)).toFixed(fractionDigits) + " TB";
  } else if (bytes < Math.pow(1024, 6)) {
    return (bytes / Math.pow(1024, 5)).toFixed(fractionDigits) + " PB";
  } else {
    return (bytes / Math.pow(1024, 6)).toFixed(fractionDigits) + " EB";
  }
}

/**
 * 转换时间戳为毫秒时间戳
 * @param timestamp 整数时间戳
 * @returns 毫秒时间戳
 */
export function transform_MS(timestamp: number) {
  const timeLength = timestamp.toFixed().length;
  const lengthDiff = timeLength - 13;
  return timestamp / Math.pow(10, lengthDiff);
}

function parseJson(msg: string) {
  if (msg.startsWith("{") && msg.endsWith("}")) {
    return JSON.parse(msg);
  }
  return msg;
}

function parseProtobuf(data: string) {
  const uint8buffer = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    uint8buffer[i] = data.charCodeAt(i);
  }
  const uint8Array = new Uint8Array(uint8buffer.buffer);
  const res = ProtobufElementSchema.decode(uint8Array) as any;
  return processElements(res.elements[0]);
}

function processElements(element: any) {
  const type = element.type as keyof typeof ATTRIBUTE_MAP;
  return {
    topic: element.topic,
    data: {
      data: element[ATTRIBUTE_MAP[type]].data,
      defaultEnable: element.defaultEnable,
      group: "others",
      style: {},
      timestamp_nsec: element.timestampNsec,
      topic: element.topic,
      type: type
    }
  };
}

export function formatHMIData(
  msg: string
): Parameters<TopicEvent[keyof TopicEvent]>[number] | undefined {
  try {
    let obj = parseJson(msg);
    if (typeof obj === "string") {
      obj = parseJson(atob(obj));
    }
    if (typeof obj === "object") {
      if (obj.value?.value0) {
        return {
          topic: obj.topic,
          data: obj.value.value0
        };
      }
      if (obj.elements) {
        return processElements(obj.elements[0]);
      }
      return {
        topic: obj.topic,
        data: obj
      };
    }
    return parseProtobuf(obj);
  } catch (error) {
    console.error("Error formatting HMI data:", error);
  }
}

export function getKeyByTime(timestamp: number) {
  return Math.floor(transform_MS(timestamp) / (1000 / HZ));
}
