import type { TSpeechListenResult } from "./constants";

export interface IStartListeningOptions {
  seed?: string;
}

export interface ISpeechSnapshot {
  isListening: boolean;
  isListenSessionActive: boolean;
  isBusy: boolean;
  voiceLevel: number;
  liveText: string;
  isPlaying: boolean;
  playingUrl: string | null;
}

export interface ITtsQueueResponse {
  message_id: string;
  room_id: string;
  status: "queued";
  job_id: string;
}

export interface ITtsQueueResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: ITtsQueueResponse;
}

export interface ISpeechSynthesizeResult {
  success: boolean;
  audioUrl?: string;
  blob?: Blob;
  error?: string;
}

export interface ISpeechTranscribeResult {
  success: boolean;
  text?: string;
  error?: string;
}

export type { TSpeechListenResult };
