import type { IAsset } from "../../models/asset.model";
import type { TAiChatRole, TAiMessageStatus } from "./constants";

export interface IChatRequest {
  message: string;
  room_id?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface IChatResponse {
  message: IMessage;
  room_id: string;
  status: TAiMessageStatus;
  job_id: string;
}

export interface IMessage {
  id: string;
  role: TAiChatRole;
  content: string;
  room_id?: string;
  assets?: IAsset[];
  metadata?: {
    status?: TAiMessageStatus;
    tts_status?: string;
    system_prompt?: string;
    temperature?: number;
    max_tokens?: number;
    error?: string | null;
    assistant_message_id?: string;
    usage?: Record<string, number>;
    model?: string;
  };
  created_at: string;
}

export interface IRoom {
  id: string;
  title: string;
  message_count: number;
  last_message: string | null;
  created_at: string;
  updated_at: string;
  processing: boolean;
}

export interface IRoomsResponse {
  rooms: IRoom[];
}

const AUDIO_ASSET_TYPE = "audio";

function findMessageAudioAsset(message: IMessage): IAsset | undefined {
  return message.assets?.find(
    (item) => item.type === AUDIO_ASSET_TYPE && item.url.trim() !== "",
  );
}

export function getMessageAudioUrl(message: IMessage): string | null {
  return findMessageAudioAsset(message)?.url ?? null;
}

export function messageHasAudio(message: IMessage): boolean {
  return Boolean(findMessageAudioAsset(message));
}
