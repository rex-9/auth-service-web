export const SPEECH_LISTEN_RESULTS = {
  STARTED: "started",
  ALREADY_LISTENING: "alreadyListening",
  DISCONNECTED: "disconnected",
  PERMISSION_DENIED: "permissionDenied",
  FAILED: "failed",
} as const;

export type TSpeechListenResult =
  (typeof SPEECH_LISTEN_RESULTS)[keyof typeof SPEECH_LISTEN_RESULTS];

export const SPEECH_PCM = {
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  CHUNK_BYTES: 3200,
} as const;

export const SPEECH_ACTIONS = {
  AUDIO: "audio",
  STOP: "stop",
} as const;

export const SPEECH_WORKLET = {
  NAME: "pcm-processor",
} as const;

export const SPEECH_CONNECTION_POLL_MS = 250;
export const SPEECH_VOICE_LEVEL_THROTTLE_MS = 100;
