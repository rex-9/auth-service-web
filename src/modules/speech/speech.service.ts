import {
  getSpeechEventType,
  isSpeechLiveMessage,
  SOCKET_CHANNELS,
  SPEECH_EVENT_TYPES,
  type ISocketMessage,
} from "../../helpers/socket.helpers";
import AppRoutes from "../../AppRoutes";
import { api } from "../../services/api.service";
import SocketService from "../../services/socket.service";
import {
  SPEECH_ACTIONS,
  SPEECH_CONNECTION_POLL_MS,
  SPEECH_LISTEN_RESULTS,
  SPEECH_PCM,
  SPEECH_VOICE_LEVEL_THROTTLE_MS,
  SPEECH_WORKLET,
  type TSpeechListenResult,
} from "./constants";
import pcmWorkletUrl from "./pcm-processor.ts?worker&url";
import { bytesToBase64, floatChannelToPcm16, floatToVoiceLevel, pcmBytesToVoiceLevel } from "./pcm";
import { joinTranscript, mergePartial } from "./transcript";
import type {
  ISpeechSnapshot,
  ISpeechSynthesizeResult,
  ISpeechTranscribeResult,
  IStartListeningOptions,
  ITtsQueueResponse,
  ITtsQueueResult,
} from "./types";

class SpeechService {
  private isListening = false;
  private isStartingListen = false;
  private isTearingDown = false;
  private speechSubscribed = false;
  private listenEpoch = 0;
  private committedText = "";
  private partialText = "";
  private liveText = "";
  private voiceLevel = 0;
  private lastVoiceLevelAt = 0;
  private pcmBuffer: number[] = [];
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private silentGain: GainNode | null = null;
  private connectionPollId: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<() => void>();
  private visibilityBound = false;
  private player: HTMLAudioElement | null = null;
  private isPlaying = false;
  private playingUrl: string | null = null;

  constructor() {
    SocketService.addListener(this.handleSocketMessage);
    this.bindVisibility();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): ISpeechSnapshot {
    const isListenSessionActive = this.isListenSessionActive();
    return {
      isListening: this.isListening,
      isListenSessionActive,
      isBusy: isListenSessionActive || this.isPlaying,
      voiceLevel: this.voiceLevel,
      liveText: this.liveText,
      isPlaying: this.isPlaying,
      playingUrl: this.playingUrl,
    };
  }

  isListenSessionActive(): boolean {
    return this.isListening || this.speechSubscribed || this.isStartingListen;
  }

  async startListening(
    options: IStartListeningOptions = {},
  ): Promise<TSpeechListenResult> {
    if (this.isListening || this.isStartingListen) {
      return SPEECH_LISTEN_RESULTS.ALREADY_LISTENING;
    }

    this.stopPlayback();
    this.isStartingListen = true;
    const epoch = ++this.listenEpoch;
    this.committedText = options.seed ?? "";
    this.partialText = "";
    this.liveText = this.committedText;
    this.notify();

    let permissionStream: MediaStream | null = null;

    try {
      try {
        await SocketService.waitUntilConnected();
      } catch (error) {
        console.warn("Speech live socket not connected:", error);
        return SPEECH_LISTEN_RESULTS.DISCONNECTED;
      }

      if (epoch !== this.listenEpoch) {
        return SPEECH_LISTEN_RESULTS.FAILED;
      }

      const micResult = await this.requestMicrophone();
      if (micResult === "denied") {
        return SPEECH_LISTEN_RESULTS.PERMISSION_DENIED;
      }
      if (micResult === "failed") {
        return SPEECH_LISTEN_RESULTS.FAILED;
      }

      permissionStream = micResult;

      if (epoch !== this.listenEpoch) {
        this.stopTracks(permissionStream);
        return SPEECH_LISTEN_RESULTS.FAILED;
      }

      try {
        await SocketService.subscribeChannel(SOCKET_CHANNELS.SPEECH_LIVE);
      } catch (error) {
        console.warn("SpeechLiveChannel subscribe failed:", error);
        this.stopTracks(permissionStream);
        return SPEECH_LISTEN_RESULTS.DISCONNECTED;
      }

      if (epoch !== this.listenEpoch) {
        this.abortStaleSubscription();
        this.stopTracks(permissionStream);
        return SPEECH_LISTEN_RESULTS.FAILED;
      }

      this.speechSubscribed = true;

      try {
        await this.startMicStream(permissionStream);
      } catch (error) {
        console.warn("Speech microphone stream failed:", error);
        this.stopTracks(permissionStream);
        await this.stopListening();
        return SPEECH_LISTEN_RESULTS.FAILED;
      }

      if (epoch !== this.listenEpoch) {
        await this.stopListening();
        return SPEECH_LISTEN_RESULTS.FAILED;
      }

      this.isListening = true;
      this.voiceLevel = 0;
      this.startConnectionWatch();
      this.notify();
      return SPEECH_LISTEN_RESULTS.STARTED;
    } catch (error) {
      console.warn("Speech listen failed:", error);
      this.stopTracks(permissionStream);
      await this.stopListening();
      return SPEECH_LISTEN_RESULTS.FAILED;
    } finally {
      this.isStartingListen = false;
      this.notify();
    }
  }

  async stopListening(): Promise<void> {
    if (
      !this.isListening &&
      !this.speechSubscribed &&
      !this.isStartingListen
    ) {
      return;
    }

    if (this.isTearingDown) {
      return;
    }

    this.isTearingDown = true;
    this.listenEpoch += 1;

    try {
      this.stopConnectionWatch();
      this.flushPcm();
      this.pcmBuffer = [];
      await this.stopMicStream();

      if (this.speechSubscribed) {
        SocketService.perform(
          SOCKET_CHANNELS.SPEECH_LIVE,
          SPEECH_ACTIONS.STOP,
        );
        SocketService.unsubscribeChannel(SOCKET_CHANNELS.SPEECH_LIVE);
        this.speechSubscribed = false;
      }

      this.isListening = false;
      this.voiceLevel = 0;
      this.committedText = this.liveText;
      this.partialText = "";
      this.notify();
    } finally {
      this.isTearingDown = false;
    }
  }

  async textToSpeech(messageId: string): Promise<ITtsQueueResult> {
    this.stopPlayback();

    const response = await api.post<ITtsQueueResponse>(
      AppRoutes.server.protected.SPEECH_TTS,
      { message_id: messageId },
    );
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        message: status.message,
        data,
      };
    }

    return {
      success: false,
      error:
        status?.error ||
        status?.message ||
        response.error ||
        "Failed to queue speech",
    };
  }

  async synthesizeText(
    text: string,
    voiceName?: string,
  ): Promise<ISpeechSynthesizeResult> {
    if (!text.trim()) {
      return {
        success: false,
        error: "Text is required for speech synthesis",
      };
    }

    try {
      const response = await api.post<Blob>(
        AppRoutes.server.protected.SPEECH_TTS,
        { text, voice_name: voiceName },
        { responseType: "blob" },
      );

      const rawData = response.data as unknown;
      if (
        rawData &&
        (rawData instanceof Blob ||
          (typeof rawData === "object" && "size" in rawData))
      ) {
        const blob = rawData as Blob;
        const audioUrl = URL.createObjectURL(blob);
        return {
          success: true,
          audioUrl,
          blob,
        };
      }

      return {
        success: false,
        error: response.error || "Failed to synthesize speech",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to synthesize speech",
      };
    }
  }

  async playText(text: string, voiceName?: string): Promise<void> {
    const result = await this.synthesizeText(text, voiceName);
    if (!result.success || !result.audioUrl) {
      throw new Error(result.error || "Failed to synthesize speech");
    }
    await this.playUrl(result.audioUrl);
  }

  async transcribeAudio(
    audio: File | Blob | string,
  ): Promise<ISpeechTranscribeResult> {
    try {
      if (typeof audio === "string") {
        const response = await api.post<{ text: string }>(
          AppRoutes.server.protected.SPEECH_STT,
          { audio_url: audio },
        );
        const { status, data } = response.data || {};
        if (status?.success && data?.text !== undefined) {
          return { success: true, text: data.text };
        }
        return {
          success: false,
          error:
            status?.error ||
            status?.message ||
            response.error ||
            "Failed to transcribe audio",
        };
      }

      const formData = new FormData();
      formData.append("audio", audio);

      const response = await api.post<{ text: string }>(
        AppRoutes.server.protected.SPEECH_STT,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const { status, data } = response.data || {};
      if (status?.success && data?.text !== undefined) {
        return { success: true, text: data.text };
      }
      return {
        success: false,
        error:
          status?.error ||
          status?.message ||
          response.error ||
          "Failed to transcribe audio",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to transcribe audio",
      };
    }
  }

  async playUrl(url: string): Promise<void> {
    this.stopPlayback();
    this.ensurePlayer();

    if (!this.player) {
      throw new Error("Audio playback is not available");
    }

    this.playingUrl = url;
    this.player.src = url;
    this.player.onended = () => {
      this.stopPlayback();
    };
    this.player.onerror = () => {
      this.stopPlayback();
    };

    try {
      await this.player.play();
      this.isPlaying = true;
      this.notify();
    } catch (error) {
      this.stopPlayback();
      throw error;
    }
  }

  stopPlayback(): void {
    if (this.player) {
      this.player.pause();
      this.player.removeAttribute("src");
      this.player.load();
      this.player.onended = null;
      this.player.onerror = null;
    }

    const wasPlaying = this.isPlaying || this.playingUrl !== null;
    this.isPlaying = false;
    this.playingUrl = null;

    if (wasPlaying) {
      this.notify();
    }
  }

  onSpeechEvent(event: ISocketMessage): void {
    if (!this.speechSubscribed && !this.isListening) {
      return;
    }

    const kind = getSpeechEventType(event);
    const text = event.message ?? "";

    if (kind === SPEECH_EVENT_TYPES.PARTIAL) {
      this.partialText = mergePartial(this.partialText, text);
      this.liveText = joinTranscript(this.committedText, this.partialText);
      this.notify();
      return;
    }

    if (kind === SPEECH_EVENT_TYPES.FINAL) {
      this.committedText = joinTranscript(this.committedText, text);
      this.partialText = "";
      this.liveText = this.committedText;
      this.notify();
      return;
    }

    if (kind === SPEECH_EVENT_TYPES.ERROR) {
      void this.stopListening();
    }
  }

  private handleSocketMessage = (event: ISocketMessage): void => {
    if (!isSpeechLiveMessage(event)) {
      return;
    }
    this.onSpeechEvent(event);
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private bindVisibility(): void {
    if (this.visibilityBound || typeof document === "undefined") {
      return;
    }

    this.visibilityBound = true;
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === "hidden") {
      this.stopPlayback();
      void this.stopListening();
    }
  };

  private ensurePlayer(): void {
    if (!this.player && typeof Audio !== "undefined") {
      this.player = new Audio();
    }
  }

  private abortStaleSubscription(): void {
    SocketService.perform(SOCKET_CHANNELS.SPEECH_LIVE, SPEECH_ACTIONS.STOP);
    SocketService.unsubscribeChannel(SOCKET_CHANNELS.SPEECH_LIVE);
    this.speechSubscribed = false;
  }

  private async requestMicrophone(): Promise<MediaStream | "denied" | "failed"> {
    if (!navigator.mediaDevices?.getUserMedia) {
      return "failed";
    }

    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
      ) {
        return "denied";
      }
      return "failed";
    }
  }

  private async startMicStream(stream: MediaStream): Promise<void> {
    this.mediaStream = stream;
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error("AudioContext is not available");
    }

    this.audioContext = new AudioContextCtor();
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.sourceNode = this.audioContext.createMediaStreamSource(stream);
    this.silentGain = this.audioContext.createGain();
    this.silentGain.gain.value = 0;

    try {
      await this.loadPcmWorklet(this.audioContext);
      this.workletNode = new AudioWorkletNode(
        this.audioContext,
        SPEECH_WORKLET.NAME,
      );
      this.workletNode.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
        this.onPcmChunk(new Uint8Array(event.data));
      };
      this.sourceNode.connect(this.workletNode);
      this.workletNode.connect(this.silentGain);
    } catch (error) {
      console.warn("AudioWorklet unavailable, using ScriptProcessor", error);
      this.startScriptProcessor();
    }

    this.silentGain.connect(this.audioContext.destination);
  }

  private async loadPcmWorklet(audioContext: AudioContext): Promise<void> {
    try {
      await audioContext.audioWorklet.addModule(pcmWorkletUrl);
    } catch {
      const response = await fetch(pcmWorkletUrl);
      const text = await response.text();
      const blob = new Blob([text], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      try {
        await audioContext.audioWorklet.addModule(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  }

  private startScriptProcessor(): void {
    if (!this.audioContext || !this.sourceNode || !this.silentGain) {
      throw new Error("Audio graph is not ready");
    }

    this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.scriptProcessor.onaudioprocess = (event: AudioProcessingEvent) => {
      const input = event.inputBuffer.getChannelData(0);
      this.updateVoiceLevelFromFloat(input);
      this.onPcmChunk(
        floatChannelToPcm16(
          input,
          this.audioContext?.sampleRate ?? SPEECH_PCM.SAMPLE_RATE,
          SPEECH_PCM.SAMPLE_RATE,
        ),
      );
    };
    this.sourceNode.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.silentGain);
  }

  private async stopMicStream(): Promise<void> {
    if (this.workletNode) {
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.scriptProcessor) {
      this.scriptProcessor.onaudioprocess = null;
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.silentGain) {
      this.silentGain.disconnect();
      this.silentGain = null;
    }

    if (this.audioContext) {
      await this.audioContext.close().catch(() => undefined);
      this.audioContext = null;
    }

    this.stopTracks(this.mediaStream);
    this.mediaStream = null;
  }

  private stopTracks(stream: MediaStream | null): void {
    stream?.getTracks().forEach((track) => track.stop());
  }

  private onPcmChunk(bytes: Uint8Array): void {
    for (const byte of bytes) {
      this.pcmBuffer.push(byte);
    }

    this.updateVoiceLevel(bytes);

    while (this.pcmBuffer.length >= SPEECH_PCM.CHUNK_BYTES) {
      this.flushPcm(SPEECH_PCM.CHUNK_BYTES);
    }
  }

  private flushPcm(size = this.pcmBuffer.length): void {
    if (!this.speechSubscribed || this.pcmBuffer.length === 0) {
      return;
    }

    const take = Math.min(size, this.pcmBuffer.length);
    const chunk = Uint8Array.from(this.pcmBuffer.splice(0, take));
    SocketService.perform(SOCKET_CHANNELS.SPEECH_LIVE, SPEECH_ACTIONS.AUDIO, {
      chunk: bytesToBase64(chunk),
    });
  }

  private updateVoiceLevel(bytes: Uint8Array): void {
    this.setVoiceLevel(pcmBytesToVoiceLevel(bytes));
  }

  private updateVoiceLevelFromFloat(input: Float32Array): void {
    this.setVoiceLevel(floatToVoiceLevel(input));
  }

  private setVoiceLevel(level: number): void {
    const now = Date.now();
    if (now - this.lastVoiceLevelAt < SPEECH_VOICE_LEVEL_THROTTLE_MS) {
      return;
    }

    this.lastVoiceLevelAt = now;
    this.voiceLevel = level;
    this.notify();
  }

  private startConnectionWatch(): void {
    this.stopConnectionWatch();
    this.connectionPollId = setInterval(() => {
      if (!SocketService.isConnectedToSocket()) {
        void this.stopListening();
      }
    }, SPEECH_CONNECTION_POLL_MS);
  }

  private stopConnectionWatch(): void {
    if (this.connectionPollId) {
      clearInterval(this.connectionPollId);
      this.connectionPollId = null;
    }
  }
}

export default new SpeechService();
