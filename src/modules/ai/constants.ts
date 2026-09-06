// src/modules/ai/constants.ts

export const AI_CHAT_ROLES = {
  SYSTEM: "system",
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type TAiChatRole = (typeof AI_CHAT_ROLES)[keyof typeof AI_CHAT_ROLES];

export const AI_MESSAGE_STATUS = {
  QUEUED: "queued",
  PROCESSING: "processing",
  RETRYING: "retrying",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type TAiMessageStatus =
  (typeof AI_MESSAGE_STATUS)[keyof typeof AI_MESSAGE_STATUS];

export const AI_SOCKET_EVENTS = {
  RESPONSE_READY: "ai_response_ready",
  RESPONSE_FAILED: "ai_response_failed",
  TTS_READY: "tts_ready",
  TTS_FAILED: "tts_failed",
} as const;


export const AI_DEFAULTS = {
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000,
} as const;
