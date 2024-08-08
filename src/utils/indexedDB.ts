type StoreOptions = {
  dbName: string;
  storeName: string;
  version?: number;
};

class IndexedDBStore {
  #dbName: string;
  #storeName: string;
  #version: number;
  #db: IDBDatabase | null = null;

  constructor({ dbName, storeName, version = 1 }: StoreOptions) {
    this.#dbName = dbName;
    this.#storeName = storeName;
    this.#version = version;
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#version);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.#storeName)) {
          db.createObjectStore(this.#storeName);
        }
      };

      request.onsuccess = () => {
        this.#db = request.result;
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async get<T, K extends IDBValidKey[] = IDBValidKey[]>(
    keys: K
  ): Promise<(T | undefined)[]>;
  async get<
    T,
    K extends Exclude<IDBValidKey, IDBValidKey[]> = Exclude<
      IDBValidKey,
      IDBValidKey[]
    >
  >(keys: K): Promise<T | undefined>;
  async get<T>(keys: IDBValidKey) {
    if (!this.#db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], "readonly");
      const store = transaction.objectStore(this.#storeName);

      if (Array.isArray(keys)) {
        // Handle multiple keys with other types
        const results: (T | undefined)[] = [];
        let pendingRequests = keys.length;

        keys.forEach((key) => {
          const request = store.get(key);

          request.onsuccess = () => {
            results.push(request.result);
            pendingRequests -= 1;
            if (pendingRequests === 0) {
              resolve(results);
            }
          };

          request.onerror = () => {
            reject(request.error);
          };
        });
      } else {
        const request = store.get(keys);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      }
    });
  }

  async set(key: IDBValidKey, value: unknown): Promise<void>;
  async set(entries: [IDBValidKey, unknown][]): Promise<void>;
  async set(
    keys: IDBValidKey | [IDBValidKey, unknown][],
    value?: unknown
  ): Promise<void> {
    if (!this.#db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], "readwrite");
      const store = transaction.objectStore(this.#storeName);

      let request: IDBRequest<IDBValidKey> | null = null;

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(request?.error);
      };
      if (value) {
        request = store.put(value, keys as IDBValidKey);
      } else {
        keys = keys as [IDBValidKey, unknown][];
        keys.forEach(([key, value]) => {
          request = store.put(value, key);
        });
      }
    });
  }

  async delete(keys: IDBValidKey): Promise<void> {
    if (!this.#db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], "readwrite");
      const store = transaction.objectStore(this.#storeName);

      let request: IDBRequest<undefined> | null = null;

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(request?.error);
      };

      if (Array.isArray(keys)) {
        keys.forEach((key) => {
          request = store.delete(key);
        });
      } else {
        request = store.delete(keys);
      }
    });
  }

  async clear(): Promise<void> {
    if (!this.#db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.#db!.transaction([this.#storeName], "readwrite");
      const store = transaction.objectStore(this.#storeName);
      const request = store.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(request.error);
      };
    });
  }

  close() {
    if (this.#db) {
      this.#db.close();
      this.#db = null;
    }
  }
}

function createStore(options: StoreOptions): IndexedDBStore {
  return new IndexedDBStore(options);
}

export { createStore, IndexedDBStore };
