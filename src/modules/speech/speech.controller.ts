// src/modules/speech/speech.controller.ts

import SpeechService from "./speech.service";
import { AppLocales, translate } from "../../locales";
import type {
  ISpeechSnapshot,
  ISpeechSynthesizeResult,
  ISpeechTranscribeResult,
  IStartListeningOptions,
  ITtsQueueResult,
} from "./types";
import type { TSpeechListenResult } from "./constants";

export class SpeechController {
  /**
   * Synthesize text to speech and play it immediately through HTML5 audio.
   * Can be called from any page or controller (e.g. notifications, accessibility, voice cues).
   */
  static async playText(
    text: string,
    voiceName?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await SpeechService.playText(text, voiceName);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error:
          err?.message ||
          translate(AppLocales.Speech.PlaybackFailed) ||
          translate(AppLocales.Speech.TtsFailed),
      };
    }
  }

  /**
   * Synthesize arbitrary text into an audio Blob and object URL.
   * Can be called from any page or controller to generate playable audio on demand.
   */
  static async synthesizeText(
    text: string,
    voiceName?: string,
  ): Promise<ISpeechSynthesizeResult> {
    const result = await SpeechService.synthesizeText(text, voiceName);
    if (result.success) {
      return result;
    }

    return {
      success: false,
      error:
        result.error ||
        translate(AppLocales.Speech.TtsFailed) ||
        translate(AppLocales.Ai.TtsFailed),
    };
  }

  /**
   * Transcribe an audio file or Blob using Rexone Core STT.
   * Usable across any upload form, feedback voice note, or media recorder.
   */
  static async transcribeAudio(
    audio: File | Blob,
  ): Promise<ISpeechTranscribeResult> {
    const result = await SpeechService.transcribeAudio(audio);
    if (result.success) {
      return result;
    }

    return {
      success: false,
      error:
        result.error ||
        translate(AppLocales.Speech.SttFailed) ||
        "Failed to transcribe audio",
    };
  }

  /**
   * Transcribe audio from a remote URL.
   */
  static async transcribeUrl(
    audioUrl: string,
  ): Promise<ISpeechTranscribeResult> {
    const result = await SpeechService.transcribeAudio(audioUrl);
    if (result.success) {
      return result;
    }

    return {
      success: false,
      error:
        result.error ||
        translate(AppLocales.Speech.SttFailed) ||
        "Failed to transcribe audio",
    };
  }

  /**
   * Enqueue asynchronous text-to-speech generation for a chat message.
   */
  static async queueTextToSpeech(messageId: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const result: ITtsQueueResult = await SpeechService.textToSpeech(messageId);

    if (result.success) {
      return {
        success: true,
        message: result.message,
      };
    }

    return {
      success: false,
      error:
        result.error ||
        translate(AppLocales.Speech.TtsFailed) ||
        translate(AppLocales.Ai.TtsFailed),
    };
  }

  /**
   * Start live speech recognition stream via SpeechLiveChannel.
   * Can be initiated from any page or workflow.
   */
  static async startListening(
    options?: IStartListeningOptions,
  ): Promise<TSpeechListenResult> {
    return SpeechService.startListening(options);
  }

  /**
   * Stop active speech recognition stream.
   */
  static async stopListening(): Promise<void> {
    return SpeechService.stopListening();
  }

  /**
   * Play audio from a URL.
   */
  static async playUrl(url: string): Promise<void> {
    return SpeechService.playUrl(url);
  }

  /**
   * Stop active audio playback.
   */
  static stopPlayback(): void {
    SpeechService.stopPlayback();
  }

  /**
   * Get synchronous snapshot of speech state.
   */
  static getSnapshot(): ISpeechSnapshot {
    return SpeechService.getSnapshot();
  }

  /**
   * Subscribe to speech state changes.
   */
  static subscribe(listener: () => void): () => void {
    return SpeechService.subscribe(listener);
  }
}

export default SpeechController;
