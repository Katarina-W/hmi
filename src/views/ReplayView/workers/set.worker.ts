import { HMI_CACHE_DB_NAME, HMI_CACHE_STORE_NAME } from "@/constants";
import createCache from "@/utils/cache";
import { parseFileInChunks } from "@/utils/file";
import { getKeyByTime } from "@/utils/format";

interface FileType {
  type: "file";
  fileList: File[];
}

type MessageType = FileType;

const hmiCache = createCache({
  dbName: HMI_CACHE_DB_NAME,
  storeName: HMI_CACHE_STORE_NAME,
  version: false
});

onmessage = async (ev: MessageEvent<MessageType>) => {
  const { fileList } = ev.data;
  await hmiCache.clear();
  const map = new Map<number, string[]>();
  const SAVE_SIZE = 100;
  await parseFileInChunks({
    fileList,
    chunkSize: 2 * 1024 * 1024,
    rowSeparator: "\n",
    onRow: async (row) => {
      const colonIndex = row.indexOf(":");
      const timestamp = +row.slice(0, colonIndex);
      const key = getKeyByTime(timestamp);
      const val = map.get(key);
      if (val) {
        val.push(row);
      } else {
        map.set(key, [row]);
        if (map.size >= SAVE_SIZE) {
          await hmiCache.setMany([...map.entries()]);
          map.clear();
        }
      }
    }
  });

  if (map.size) {
    await hmiCache.setMany([...map.entries()]);
    map.clear();
  }
  postMessage({ type: "end" });
};
