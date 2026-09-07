import { ToastTypes, type TToastTypes } from "../design";
import { NOTIFICATION_SOCKET_TYPES } from "../modules/notification";

export type ISocketMessage = {
  type: string;
  message?: string;
  data?: Record<string, unknown>;
  created_at?: string;
  channel?: string;
};

export const SOCKET_MESSAGE_TYPES = {
  NOTIFICATION: "notification",
  SPEECH: "speech",
} as const;

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
  NOTIFICATION_SOCKET_TYPES.PAYMENT_SUCCESS,
  NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_CREATED,
  NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_RESUMED,
  NOTIFICATION_SOCKET_TYPES.WELCOME,
  NOTIFICATION_SOCKET_TYPES.AI_RESPONSE_READY,
  NOTIFICATION_SOCKET_TYPES.TTS_READY,
  NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSED,
  NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_GENERATED,
] as const;

export const NOTIFICATION_TOAST_ERROR_TYPES = [
  NOTIFICATION_SOCKET_TYPES.PAYMENT_FAILED,
  NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_CANCELED,
  NOTIFICATION_SOCKET_TYPES.AI_RESPONSE_FAILED,
  NOTIFICATION_SOCKET_TYPES.TTS_FAILED,
  NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSION_FAILED,
  NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_FAILED,
] as const;

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

export const ASSET_SOCKET_TOAST_TYPES = [
  NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSING,
  NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSED,
  NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSION_FAILED,
  NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_GENERATED,
  NOTIFICATION_SOCKET_TYPES.ASSET_THUMBNAIL_FAILED,
] as const;

export function isAssetSocketToast(data: ISocketMessage): boolean {
  return (ASSET_SOCKET_TOAST_TYPES as readonly string[]).includes(
    getSpeechEventType(data),
  );
}

export function isSpeechLiveMessage(data: ISocketMessage): boolean {
  if (data.channel === SOCKET_CHANNELS.SPEECH_LIVE) {
    return true;
  }

  if (data.type === SOCKET_MESSAGE_TYPES.SPEECH) {
    const eventType = getSpeechEventType(data);
    return (
      eventType === SPEECH_EVENT_TYPES.PARTIAL ||
      eventType === SPEECH_EVENT_TYPES.FINAL ||
      eventType === SPEECH_EVENT_TYPES.ERROR
    );
  }

  return false;
}

export function getSocketToast(data: ISocketMessage): {
  kind: TToastTypes;
  message: string;
} | null {
  const message = data.message?.trim() ?? "";

  if (isSpeechLiveMessage(data)) {
    if (getSpeechEventType(data) === SPEECH_EVENT_TYPES.ERROR && message) {
      return { kind: ToastTypes.ERROR, message };
    }
    return null;
  }

  if (data.type !== SOCKET_MESSAGE_TYPES.NOTIFICATION || !message) {
    return null;
  }

  const eventType = getSpeechEventType(data);

  if (
    (NOTIFICATION_TOAST_SUCCESS_TYPES as readonly string[]).includes(eventType)
  ) {
    return { kind: ToastTypes.SUCCESS, message };
  }

  if (
    (NOTIFICATION_TOAST_ERROR_TYPES as readonly string[]).includes(eventType)
  ) {
    return { kind: ToastTypes.ERROR, message };
  }

  return { kind: ToastTypes.INFO, message };
}
