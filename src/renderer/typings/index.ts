import {
  ALL_TOPICS,
  AUGMENTED_RENDER_MAP,
  OTHER_INFO_MAP,
  VIRTUAL_RENDER_MAP
} from "../../constants/topic";

export interface UpdateDataTool<T = any> {
  data: T;
  defaultEnable: boolean;
  group: string;
  style: Record<string, any>;
  timestamp_nsec: number;
  topic: string;
}

export type TopicEvent = {
  [E in ALL_TOPICS]: (data: { topic: E; data: any }) => void;
};

export type VIRTUAL_RENDER_TYPE = keyof typeof VIRTUAL_RENDER_MAP;
export type AUGMENTED_RENDER_TYPE = keyof typeof AUGMENTED_RENDER_MAP;
export type OTHER_INFO_TYPE = keyof typeof OTHER_INFO_MAP;

export type ALL_RENDER_TYPE =
  | VIRTUAL_RENDER_TYPE
  | AUGMENTED_RENDER_TYPE
  | OTHER_INFO_TYPE;

export type ALL_RENDER_EVENT = {
  loaded: () => void;
  enable: (data: {
    type: ALL_RENDER_TYPE;
    topic: ALL_TOPICS;
    enable: boolean;
  }) => void;
};
