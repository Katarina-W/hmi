import type { Scene } from "three";

import { FixedPolygon, type FixedPolygonUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.fixedPolygon)[number];

export default class FixedPolygonRender extends FixedPolygon {
  topic: TOPIC_TYPE;
  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(
      topic,
      (data: { data: FixedPolygonUpdateData; topic: TOPIC_TYPE }) => {
        this.update(data.data);
      }
    );
  }
}
