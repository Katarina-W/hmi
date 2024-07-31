import type { Scene } from "three";

import type { VIRTUAL_RENDER_MAP } from "../../constants/topic";
import { Text, type TextUpdateData } from "../common";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.text_sprite)[number];

export default class TextRender extends Text {
  topic: TOPIC_TYPE;
  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(topic, (data: { data: TextUpdateData; topic: TOPIC_TYPE }) => {
      this.update(data.data);
    });
  }
}
