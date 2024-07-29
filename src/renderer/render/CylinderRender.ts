import type { Scene } from "three";

import { Cylinder, type CylinderUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.cylinder)[number];

export default class CylinderRender extends Cylinder {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(
      topic,
      (data: { data: CylinderUpdateData; topic: TOPIC_TYPE }) => {
        this.update(data.data);
      }
    );
  }
}
