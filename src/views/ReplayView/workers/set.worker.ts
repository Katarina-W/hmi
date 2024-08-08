import { HMI_CACHE_DB_NAME, HMI_CACHE_STORE_NAME } from "@/constants";
import { parseFileInChunks } from "@/utils/file";
import { getKeyByTime } from "@/utils/format";
import { createStore } from "@/utils/indexedDB";

interface FileType {
  type: "file";
  fileList: File[];
}

type MessageType = FileType;

const store = createStore({
  dbName: HMI_CACHE_DB_NAME,
  storeName: HMI_CACHE_STORE_NAME
});

onmessage = async (ev: MessageEvent<MessageType>) => {
  const { fileList } = ev.data;
  await store.clear();
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
          await store.set([...map.entries()]);
          map.clear();
        }
      }
    }
  });

  if (map.size) {
    await store.set([...map.entries()]);
    map.clear();
  }
  store.close();
  postMessage({ type: "end" });
};
