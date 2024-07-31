export const CANVAS_ID = "canvas_id";

export const HZ = 60;

/** 模型缓存数据库名称 */
export const MODEL_CACHE_DB_NAME = "MODEL_CACHE";
/** 模型缓存集合名称 */
export const MODEL_CACHE_STORE_NAME = "MODELS";
/** 模型缓存版本 由vite编译时计算 src/assets/model 目录的hash值生成 */
export const MODEL_CACHE_VERSION = __MODEL_DIRECTORY_HASH__;

/** HMI缓存数据库名称 */
export const HMI_CACHE_DB_NAME = "HMI_CACHE";
/** 帧缓存集合名称 */
export const HMI_CACHE_STORE_NAME = "FRAMES";
