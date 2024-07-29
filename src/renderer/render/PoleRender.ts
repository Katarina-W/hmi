import type { Scene } from "three";

import { Pole, type PoleUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.poleModel)[number];

export default class PoleRender extends Pole {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(topic, (data: { data: PoleUpdateData; topic: TOPIC_TYPE }) => {
      this.update(data.data);
    });
  }
}
