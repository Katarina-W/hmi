import {
  AnimationClip,
  type AnimationClipJSON,
  Camera,
  Group,
  type Object3DJSON,
  ObjectLoader
} from "three";
import {
  type GLTF,
  GLTFLoader as BASE_GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  MODEL_CACHE_DB_NAME,
  MODEL_CACHE_STORE_NAME,
  MODEL_CACHE_VERSION
} from "@/constants";
import createCache from "@/utils/cache";

interface GLTFJSON {
  animations: AnimationClipJSON[];
  scene: Object3DJSON;
  scenes: Object3DJSON[];
  cameras: Object3DJSON[];
  asset: GLTF["asset"];
  userData: GLTF["userData"];
}

const loader = new ObjectLoader();

const cache = createCache({
  dbName: MODEL_CACHE_DB_NAME,
  storeName: MODEL_CACHE_STORE_NAME,
  version: MODEL_CACHE_VERSION
});

// 序列化 GLTF 对象
const serializeGLTF = (gltf: GLTF): GLTFJSON => ({
  animations: gltf.animations.map(AnimationClip.toJSON),
  scene: gltf.scene.toJSON(),
  scenes: gltf.scenes.map((scene) => scene.toJSON()),
  cameras: gltf.cameras.map((camera) => camera.toJSON()),
  asset: gltf.asset,
  userData: gltf.userData
});

// 反序列化 GLTF 对象
const deserializeGLTF = (gltf: GLTFJSON): Omit<GLTF, "parser"> => ({
  animations: gltf.animations.map((animation) =>
    AnimationClip.parse(animation)
  ),
  scene: loader.parse(gltf.scene) as Group,
  scenes: gltf.scenes.map((scene) => loader.parse(scene) as Group),
  cameras: gltf.cameras.map((camera) => loader.parse(camera) as Camera),
  asset: gltf.asset,
  userData: gltf.userData
});

export default class GLTFLoader extends BASE_GLTFLoader {
  #retry = 0;
  #MAX_RETRY = 3;

  async #tryCache(
    url: string,
    onLoad: (data: GLTF) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void
  ) {
    try {
      const data = await cache.get<GLTFJSON>(url);
      if (data) {
        this.#retry = 0;
        this.manager.itemEnd(url);
        const gltf = deserializeGLTF(data);
        onLoad(gltf as GLTF);
      } else {
        super.load(
          url,
          (gltf) => {
            this.#retry = 0;
            this.manager.itemEnd(url);
            onLoad(gltf);
            const g = serializeGLTF(gltf);
            cache.set(url, g);
          },
          onProgress,
          () => {
            this.manager.itemEnd(url);
            this.#retry++;
            this.load(url, onLoad, onProgress, onError);
          }
        );
      }
    } catch (error) {
      try {
        await cache.del(url);
        this.manager.itemEnd(url);
        this.#retry++;
        this.load(url, onLoad, onProgress, onError);
      } catch (e) {
        this.manager.itemEnd(url);
        this.#retry = 0;
        onError?.call(this, e);
      }
    }
  }

  load(
    url: string,
    onLoad: (data: GLTF) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void
  ) {
    this.manager.itemStart(url);
    if (this.#retry > this.#MAX_RETRY) {
      this.#retry = 0;
      onError?.call(this, new Error("retry too many times"));
      this.manager.itemError(url);
      this.manager.itemEnd(url);
      return;
    }
    this.#tryCache(url, onLoad, onProgress, onError);
  }

  loadAsync(
    url: string,
    onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined
  ): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.load(url, resolve, onProgress, reject);
    });
  }
}
