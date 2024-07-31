import EventEmitter from "eventemitter3";

import { ALL_TOPICS } from "../../constants/topic";
import type { TopicEvent } from "../typings";

class RenderEmitter extends EventEmitter<TopicEvent> {
  allTopics = new Set(Object.values(ALL_TOPICS));
  noSubscriptions = new Set<string | symbol>();
  unknownTopics = new Set<string | symbol>();

  emit(event: ALL_TOPICS, data: any): boolean {
    // 没有被订阅的topic
    if (this.eventNames().indexOf(event) === -1) {
      if (this.allTopics.has(event)) {
        if (!this.noSubscriptions.has(event)) {
          this.noSubscriptions.add(event);
          console.warn(event, "is not subscribed");
        }
      } else if (!this.unknownTopics.has(event)) {
        this.unknownTopics.add(event);
        console.error(event, "is not defined");
      }

      return false;
    }

    return super.emit(event, data);
  }
}

export default new RenderEmitter();
