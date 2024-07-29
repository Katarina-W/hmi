import type { Scene } from "three";

import { Freespace, type FreespaceUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.freespace)[number];

export default class FreespaceRender extends Freespace {
  topic: TOPIC_TYPE;
  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(
      topic,
      (data: { data: FreespaceUpdateData; topic: TOPIC_TYPE }) => {
        this.update(data.data);
      }
    );
  }
}
