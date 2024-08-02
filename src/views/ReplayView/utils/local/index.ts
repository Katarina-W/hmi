import renderEmitter from "@/renderer/utils/renderEmitter";
import { formatHMIData } from "@/utils/format";

interface FilesData {
  type: "files";
  data: File[];
}

interface PlayData {
  type: "play";
  data?: number;
}

interface PauseData {
  type: "pause";
  data?: number;
}

interface ClearData {
  type: "clear";
  data?: never;
}

export type PostMessageType = FilesData | PlayData | PauseData | ClearData;

interface DataType {
  type: "data";
  data: {
    timestamp: number;
    text: string;
  };
}

interface DurationType {
  type: "duration";
  data: {
    start: number;
    end: number;
  };
}

export type OnMessageType = DataType | DurationType;

const onData = (data: { timestamp: number; text: string }) => {
  const res = formatHMIData(data.text);
  if (!res) return;
  renderEmitter.emit(res.topic, res);
};

export class LocalReplay extends Worker {
  onmessage = (ev: MessageEvent<OnMessageType>) => {
    const { type, data } = ev.data;
    switch (type) {
      case "duration":
        console.log(data);
        break;
      case "data":
        onData(data);
        break;
    }
  };

  postMessage(message: PostMessageType, transfer: Transferable[]): void;
  postMessage(
    message: PostMessageType,
    options?: StructuredSerializeOptions
  ): void;
  postMessage(
    message: PostMessageType,
    other: Transferable[] | StructuredSerializeOptions | undefined
  ) {
    if (Array.isArray(other)) {
      super.postMessage(message, other);
    } else {
      super.postMessage(message, other);
    }
  }

  terminate() {
    this.postMessage({ type: "clear" });
    super.terminate();
  }
}
