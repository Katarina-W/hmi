import { HMI_CACHE_DB_NAME, HMI_CACHE_STORE_NAME, HZ } from "@/constants";
import {
  readBothRowByChunk,
  readFirstRowByChunk,
  readLastRowByChunk
} from "@/utils/file";
import { formatHMIData, getKeyByTime, transform_MS } from "@/utils/format";
import { createStore } from "@/utils/indexedDB";

interface FileType {
  type: "file";
  fileList: File[];
}

interface PlayType {
  type: "play";
  timestamp: number;
}

interface PauseType {
  type: "pause";
}

type MessageType = FileType | PlayType | PauseType;

const store = createStore({
  dbName: HMI_CACHE_DB_NAME,
  storeName: HMI_CACHE_STORE_NAME
});

const MIN_BUFFER_SIZE = 100;
const bufferMap = new Map<number, string[] | undefined>();
let getKeys: number[] = [];
let isGetting = false;
let isWaiting = false;
let playTimer: number;

let startTime = 0,
  endTime = 0,
  currentTime = 0;

let currentKey = 0,
  bufferLastKey = 0,
  maxKey = 0;

const getDuration = async (fileList: File[]) => {
  if (!fileList.length) return;
  let [firstRow, lastRow] = ["", ""];
  if (fileList.length > 1) {
    [firstRow, lastRow] = await Promise.all([
      readFirstRowByChunk(fileList[0]),
      readLastRowByChunk(fileList[fileList.length - 1])
    ]);
  } else {
    const res = await readBothRowByChunk(fileList[0]);
    [firstRow, lastRow] = [res.firstRow, res.lastRow];
  }
  const startColonIndex = firstRow.indexOf(":");
  const endColonIndex = lastRow.indexOf(":");
  if (startColonIndex === -1 || endColonIndex === -1) return;

  startTime = transform_MS(+firstRow.slice(0, startColonIndex));
  endTime = transform_MS(+lastRow.slice(0, endColonIndex));
  maxKey = getKeyByTime(endTime);
  postMessage({
    type: "duration",
    data: {
      startTime,
      endTime
    }
  });
};

const getCache = async () => {
  if (isGetting) return;
  isGetting = true;
  const diff = Math.min(MIN_BUFFER_SIZE - bufferMap.size, maxKey - currentKey);
  getKeys = Array.from({ length: diff }, (_, i) => bufferLastKey + i + 1);
  try {
    const values = await store.get<string[]>(getKeys);
    values.forEach((value, i) => {
      bufferMap.set(getKeys[i], value);
    });
  } catch (error) {
    console.error("Failed to get cache:", error);
  }
  getKeys = [];
  isGetting = false;
  bufferLastKey = [...bufferMap.keys()].reduce(
    (max, key) => Math.max(max, key),
    0
  );
  if (isWaiting) play();
};

const play = () => {
  isWaiting = false;
  playTimer = self.setInterval(() => {
    if (currentKey > maxKey) {
      pause();
      return;
    }
    if (!bufferMap.size) {
      self.clearInterval(playTimer);
      isWaiting = true;
      if (!isGetting) getCache();
      return;
    }
    if (bufferMap.size < MIN_BUFFER_SIZE / 2) {
      getCache();
    }
    if (!bufferMap.has(currentKey) && getKeys.indexOf(currentKey) !== -1) {
      self.clearInterval(playTimer);
      isWaiting = true;
      return;
    }
    const rows = bufferMap.get(currentKey);
    bufferMap.delete(currentKey);
    currentKey++;
    if (rows) {
      rows.forEach((row) => {
        const colonIndex = row.indexOf(":");
        if (colonIndex === -1) return;
        currentTime = transform_MS(+row.slice(0, colonIndex));
        const res = formatHMIData(row.slice(colonIndex + 1));
        if (res) {
          self.postMessage({
            type: "data",
            data: {
              currentTime,
              data: res
            }
          });
        }
      });
    }
  }, 1000 / HZ);
};

const start = (timestamp: number) => {
  currentTime = timestamp;
  currentKey = getKeyByTime(currentTime);
  bufferLastKey = currentKey - 1;
  play();
};

const pause = () => {
  clearInterval(playTimer);
};

onmessage = (ev: MessageEvent<MessageType>) => {
  const { type } = ev.data;
  switch (type) {
    case "file":
      getDuration(ev.data.fileList);
      break;
    case "play":
      start(ev.data.timestamp);
      break;
    case "pause":
      pause();
      break;
  }
};
