import type { Scene } from "three";

import { EgoCar, type EgoCarUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.car_pose)[number];

export default class EgoCarRender extends EgoCar {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(topic, (data: { data: EgoCarUpdateData; topic: TOPIC_TYPE }) => {
      this.update(data.data);
    });
  }
}
