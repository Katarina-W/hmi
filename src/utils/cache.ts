import {
  clear as dbClear,
  createStore,
  del as dbDel,
  get as dbGet,
  getMany as dbGetMany,
  set as dbSet,
  setMany as dbSetMany
} from "idb-keyval";

interface Options {
  dbName: string;
  storeName: string;
  version?: IDBValidKey;
}

const createCache = (options: Options) => {
  const store = createStore(options.dbName, options.storeName);

  const versionKey = "cache_version";

  let isChecked = false;
  let currentVersion: IDBValidKey | undefined;

  const checkVersion = async () => {
    if (isChecked) return;
    try {
      if (!currentVersion) {
        currentVersion = await dbGet<IDBValidKey>(versionKey, store);
      }
      if (currentVersion !== options.version) {
        await dbClear(store);
        currentVersion = options.version;
        await dbSet(versionKey, options.version, store);
      }
      isChecked = true;
    } catch (error) {
      console.log(error);
    }
  };

  const get = async <T>(key: IDBValidKey) => {
    !isChecked && (await checkVersion());
    return dbGet<T>(key, store);
  };

  const getMany = async <T>(keys: IDBValidKey[]) => {
    !isChecked && (await checkVersion());
    return dbGetMany<T>(keys, store);
  };

  const set = async (key: IDBValidKey, value: any) => {
    !isChecked && (await checkVersion());
    return dbSet(key, value, store);
  };

  const setMany = async (entries: [IDBValidKey, any][]) => {
    !isChecked && (await checkVersion());
    return dbSetMany(entries, store);
  };

  const del = (key: IDBValidKey) => dbDel(key, store);

  const clear = () => dbClear(store);

  return {
    get,
    getMany,
    set,
    setMany,
    del,
    clear
  };
};

export default createCache;
