import type { Scene } from "three";

import { TrafficSignal, type TrafficSignalUpdateData } from "../common";
import type { VIRTUAL_RENDER_MAP } from "../constants/topic";
import emitter from "../utils/renderEmitter";

type TOPIC_TYPE = (typeof VIRTUAL_RENDER_MAP.trafficSignalModel)[number];

export default class TrafficSignalRender extends TrafficSignal {
  topic: TOPIC_TYPE;

  constructor(scene: Scene, topic: TOPIC_TYPE) {
    super(scene);
    this.topic = topic;

    emitter.on(
      topic,
      (data: { data: TrafficSignalUpdateData; topic: TOPIC_TYPE }) => {
        this.update(data.data);
      }
    );
  }
}
