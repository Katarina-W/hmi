import type { Scene } from "three";

import type { VIRTUAL_RENDER_MAP } from "../../constants/topic";
import { Ellipse, type EllipseUpdateData } from "../common";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.ellipse)[number];

export default class EllipseRender extends Ellipse {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(
      topic,
      (data: { data: EllipseUpdateData; topic: TOPIC_TYPE }) => {
        this.update(data.data);
      }
    );
  }
}
