export interface FilesData {
  type: "files";
  data: File[];
}

export interface PlayData {
  type: "play";
  data?: number;
}

export interface PauseData {
  type: "pause";
  data?: number;
}

export interface ClearData {
  type: "clear";
  data: undefined;
}

export type MessageData = FilesData | PlayData | PauseData | ClearData;
