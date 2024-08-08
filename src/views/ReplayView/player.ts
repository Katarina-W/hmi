import EventEmitter from "eventemitter3";

import renderEmitter from "@/renderer/utils/renderEmitter";

export class HMIPlayer extends EventEmitter {
  setWorker: Worker | null = null;
  playWorker: Worker;

  startTime?: number;
  endTime?: number;
  currentTime?: number;

  state: "init" | "loading" | "play" | "pause" = "init";

  get duration() {
    if (!this.startTime || !this.endTime) return;
    return this.endTime - this.startTime;
  }

  constructor() {
    super();

    this.playWorker = new Worker(
      new URL("./workers/play.worker.ts", import.meta.url),
      { type: "module" }
    );
    this.playWorker.onmessage = this.onMessage;
  }

  init(fileList: File[]) {
    if (!fileList.length) return;
    fileList.sort((a, b) => a.name.localeCompare(b.name));

    this.setWorker = new Worker(
      new URL("./workers/set.worker.ts", import.meta.url),
      { type: "module" }
    );
    this.setWorker.onmessage = (ev) => {
      const { type } = ev.data;
      switch (type) {
        case "end":
          this.setWorker?.terminate();
          this.setWorker = null;
          break;
      }
    };
    this.setWorker.postMessage({
      type: "file",
      fileList
    });
    this.playWorker.postMessage({
      type: "file",
      fileList
    });
  }

  play(timestamp = this.currentTime) {
    if (!this.duration) {
      this.state = "loading";
    } else {
      this.state = "play";
      this.playWorker.postMessage({
        type: "play",
        timestamp
      });
    }
  }

  pause() {
    this.state = "pause";
    this.playWorker.postMessage({
      type: "pause"
    });
  }

  onMessage = (ev: MessageEvent) => {
    const { type, data } = ev.data;

    switch (type) {
      case "data":
        renderEmitter.emit(data.data.topic, data.data);
        this.currentTime = data.currentTime;
        this.emit("currentTime", data.currentTime);
        break;
      case "duration":
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.currentTime = data.startTime;
        this.emit("duration", data);
        if (this.state === "loading") this.play();
        break;
    }
  };

  dispose() {
    this.setWorker?.terminate();
    this.setWorker = null;
    this.playWorker.terminate();
    this.removeAllListeners();
  }
}
