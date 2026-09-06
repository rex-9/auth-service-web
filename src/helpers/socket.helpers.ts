export type ISocketMessage = {
  type: string;
  message?: string;
  data?: Record<string, unknown>;
  created_at?: string;
  channel?: string;
};

export const SOCKET_CHANNELS = {
  NOTIFICATION: "NotificationChannel",
  SPEECH_LIVE: "SpeechLiveChannel",
} as const;

export const SPEECH_EVENT_TYPES = {
  PARTIAL: "partial",
  FINAL: "final",
  ERROR: "error",
} as const;

export const SOCKET_SUBSCRIBE_TIMEOUT_MS = 10_000;
export const SOCKET_CONNECT_WAIT_MS = 5_000;

export const NOTIFICATION_TOAST_SUCCESS_TYPES = [
  "payment_success",
  "subscription_created",
  "subscription_resumed",
  "welcome",
  "ai_response_ready",
  "tts_ready",
  "asset_compressed",
] as const;

export const NOTIFICATION_TOAST_ERROR_TYPES = [
  "payment_failed",
  "subscription_canceled",
  "ai_response_failed",
  "tts_failed",
  "asset_compression_failed",
] as const;

export type TSocketToastKind = "success" | "error" | "info" | "none";

export function parseCableChannel(identifier: unknown): string {
  if (identifier && typeof identifier === "object") {
    const channel = (identifier as { channel?: unknown }).channel;
    return typeof channel === "string" ? channel : "";
  }

  if (typeof identifier !== "string" || identifier.trim() === "") {
    return "";
  }

  try {
    const parsed = JSON.parse(identifier) as { channel?: unknown };
    return typeof parsed.channel === "string" ? parsed.channel : "";
  } catch {
    return "";
  }
}

export function getSpeechEventType(data: ISocketMessage): string {
  return typeof data.data?.type === "string" ? data.data.type : "";
}

export function isSpeechLiveMessage(data: ISocketMessage): boolean {
  if (data.channel === SOCKET_CHANNELS.SPEECH_LIVE) {
    return true;
  }

  const eventType = getSpeechEventType(data);
  return (
    eventType === SPEECH_EVENT_TYPES.PARTIAL ||
    eventType === SPEECH_EVENT_TYPES.FINAL ||
    eventType === SPEECH_EVENT_TYPES.ERROR
  );
}

export function getSocketToast(data: ISocketMessage): {
  kind: TSocketToastKind;
  message: string;
} {
  const message = data.message?.trim() ?? "";

  if (isSpeechLiveMessage(data)) {
    if (getSpeechEventType(data) === SPEECH_EVENT_TYPES.ERROR && message) {
      return { kind: "error", message };
    }
    return { kind: "none", message: "" };
  }

  if (data.type !== "notification" || !message) {
    return { kind: "none", message: "" };
  }

  const eventType = getSpeechEventType(data);

  if (
    (NOTIFICATION_TOAST_SUCCESS_TYPES as readonly string[]).includes(eventType)
  ) {
    return { kind: "success", message };
  }

  if (
    (NOTIFICATION_TOAST_ERROR_TYPES as readonly string[]).includes(eventType)
  ) {
    return { kind: "error", message };
  }

  return { kind: "info", message };
}
