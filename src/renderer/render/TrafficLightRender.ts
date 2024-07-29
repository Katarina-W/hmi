import type { Scene } from "three";

import { TrafficLight, type TrafficLightUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.trafficLightModel)[number];

export default class TrafficLightRender extends TrafficLight {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(
      topic,
      (data: { data: TrafficLightUpdateData; topic: TOPIC_TYPE }) => {
        this.update(data.data);
      }
    );
  }
}
