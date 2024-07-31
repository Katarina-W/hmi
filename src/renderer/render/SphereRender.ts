import type { Scene } from "three";

import type { VIRTUAL_RENDER_MAP } from "../../constants/topic";
import { Sphere, type SphereUpdateData } from "../common";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.sphere)[number];

export default class SphereRender extends Sphere {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(topic, (data: { data: SphereUpdateData; topic: TOPIC_TYPE }) => {
      this.update(data.data);
    });
  }
}
