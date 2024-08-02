/**
 * 本地hmi文件处理
 */
import { HMI_CACHE_DB_NAME, HMI_CACHE_STORE_NAME, HZ } from "@/constants";
import createCache from "@/utils/cache";
import {
  readFileBothRowByFile,
  readFileFirstRowByFile,
  readFileLastRowByFile,
  readRowByFile
} from "@/utils/file";
import { transform_MS } from "@/utils/format";

import type { OnMessageType, PostMessageType } from ".";

const cache = createCache({
  dbName: HMI_CACHE_DB_NAME,
  storeName: HMI_CACHE_STORE_NAME
});

const DUMP_MS = 1000 / HZ;

// const LOCAL_MAX_CACHE_SIZE = HZ * 10;
const LOCAL_MAX_CACHE_SIZE = Infinity;
const localCache = new Map<number, string[]>();

let startTime = 0;
let endTime = 0;
let playTimer: number | undefined;

const getDuration = (startRow: string, endRow: string) => {
  const startColonIndex = startRow.indexOf(":");
  const endColonIndex = endRow.indexOf(":");
  if (startColonIndex === -1 || endColonIndex === -1) return;

  const start = transform_MS(+startRow.slice(0, startColonIndex));
  const end = transform_MS(+endRow.slice(0, endColonIndex));

  return { start, end };
};

const readDuration = async (files: File[]) => {
  if (!files.length) return;
  let [firstRow, lastRow] = ["", ""];
  if (files.length > 1) {
    const firstFile = files.shift()!;
    const lastFile = files.pop()!;
    [firstRow, lastRow] = await Promise.all([
      readFileFirstRowByFile(firstFile),
      readFileLastRowByFile(lastFile)
    ]);
  } else {
    const res = await readFileBothRowByFile(files[0]);
    [firstRow, lastRow] = [res.firstRow, res.lastRow];
  }
  const duration = getDuration(firstRow, lastRow);
  if (!duration) return;
  startTime = duration.start;
  endTime = duration.end;
  postMsg({
    type: "duration",
    data: duration
  });
};

const getKeyByTime = (timestamp: number) => {
  return Math.floor(transform_MS(timestamp) / DUMP_MS);
};

const setLocalCache = (key: number, line: string) => {
  if (localCache.size >= LOCAL_MAX_CACHE_SIZE) return;
  const lines = localCache.get(key);
  if (!lines) {
    localCache.set(key, [line]);
  } else {
    localCache.set(key, [...lines, line]);
  }
};

const setCache = async (files: File[]) => {
  for (const file of files) {
    let currentStartLine = 0;
    const lineCount = 1000;
    let chunk = await readRowByFile(file, currentStartLine, lineCount);
    while (chunk) {
      const lines = chunk.split("\n");
      lines.map(async (line) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex === -1) return;
        const timestamp = +line.slice(0, colonIndex);
        const key = getKeyByTime(timestamp);
        setLocalCache(key, line);
        const value = await cache.get<string[]>(key);
        if (!value) {
          cache.set(key, [line]);
        } else {
          cache.set(key, [...value, line]);
        }
      });
      if (lines.length < lineCount) break;
      currentStartLine += lineCount;
      chunk = await readRowByFile(file, currentStartLine, 1000);
    }
  }
};

const play = (timestamp = startTime) => {
  let key: number;

  clearInterval(playTimer);
  playTimer = self.setInterval(() => {
    if (!localCache.size || !startTime || !endTime) return;
    if (!key) key = getKeyByTime(timestamp || startTime);
    else key++;
    const lines = localCache.get(key);
    if (!lines) return;
    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return;
      const timestamp = transform_MS(+line.slice(0, colonIndex));
      postMsg({
        type: "data",
        data: {
          timestamp,
          text: line.slice(colonIndex + 1)
        }
      });
      if (timestamp >= endTime) {
        clearInterval(playTimer);
        playTimer = undefined;
      }
    });
  }, DUMP_MS);
  console.log("play", timestamp);
  console.log("localCache", localCache);
};

const clearCache = () => {
  localCache.clear();
  return cache.clear();
};

onmessage = (ev: MessageEvent<PostMessageType>) => {
  const { type, data } = ev.data;
  switch (type) {
    case "files":
      clearCache().finally(() => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        setCache(data);
        readDuration(data);
      });
      break;
    case "play":
      play(data);
      break;
    case "pause":
      console.log(data);
      break;
  }
};

const postMsg = (msg: OnMessageType) => {
  postMessage(msg);
};
