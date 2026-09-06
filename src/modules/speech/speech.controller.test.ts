import { describe, it, expect, vi, beforeEach } from "vitest";
import SpeechController from "./speech.controller";
import SpeechService from "./speech.service";
import { SPEECH_LISTEN_RESULTS } from "./constants";

vi.mock("./speech.service", () => ({
  default: {
    textToSpeech: vi.fn(),
    synthesizeText: vi.fn(),
    playText: vi.fn(),
    transcribeAudio: vi.fn(),
    startListening: vi.fn(),
    stopListening: vi.fn(),
    playUrl: vi.fn(),
    stopPlayback: vi.fn(),
    getSnapshot: vi.fn(),
    subscribe: vi.fn(),
  },
}));

describe("SpeechController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("playText", () => {
    it("returns success when SpeechService.playText resolves", async () => {
      vi.mocked(SpeechService.playText).mockResolvedValue();

      const result = await SpeechController.playText("Hello Rexone");

      expect(SpeechService.playText).toHaveBeenCalledWith(
        "Hello Rexone",
        undefined,
      );
      expect(result).toEqual({ success: true });
    });

    it("returns failure when SpeechService.playText throws", async () => {
      vi.mocked(SpeechService.playText).mockRejectedValue(
        new Error("Audio play failed"),
      );

      const result = await SpeechController.playText("Hello Rexone");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Audio play failed");
    });
  });

  describe("synthesizeText", () => {
    it("returns audioUrl and blob on success", async () => {
      const mockBlob = new Blob(["audio-data"]);
      vi.mocked(SpeechService.synthesizeText).mockResolvedValue({
        success: true,
        audioUrl: "blob:http://localhost/123",
        blob: mockBlob,
      });

      const result = await SpeechController.synthesizeText(
        "Hello",
        "en-US-Neural2-A",
      );

      expect(SpeechService.synthesizeText).toHaveBeenCalledWith(
        "Hello",
        "en-US-Neural2-A",
      );
      expect(result).toEqual({
        success: true,
        audioUrl: "blob:http://localhost/123",
        blob: mockBlob,
      });
    });

    it("returns failure on error", async () => {
      vi.mocked(SpeechService.synthesizeText).mockResolvedValue({
        success: false,
        error: "Quota exceeded",
      });

      const result = await SpeechController.synthesizeText("Hello");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Quota exceeded");
    });
  });

  describe("transcribeAudio", () => {
    it("transcribes audio file or blob", async () => {
      const audio = new Blob(["test-audio"]);
      vi.mocked(SpeechService.transcribeAudio).mockResolvedValue({
        success: true,
        text: "Transcribed speech",
      });

      const result = await SpeechController.transcribeAudio(audio);

      expect(SpeechService.transcribeAudio).toHaveBeenCalledWith(audio);
      expect(result).toEqual({
        success: true,
        text: "Transcribed speech",
      });
    });

    it("handles transcribe error", async () => {
      const audio = new Blob(["test-audio"]);
      vi.mocked(SpeechService.transcribeAudio).mockResolvedValue({
        success: false,
        error: "Audio too short",
      });

      const result = await SpeechController.transcribeAudio(audio);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Audio too short");
    });
  });

  describe("transcribeUrl", () => {
    it("transcribes audio from URL", async () => {
      vi.mocked(SpeechService.transcribeAudio).mockResolvedValue({
        success: true,
        text: "Transcribed from URL",
      });

      const result = await SpeechController.transcribeUrl(
        "https://example.com/audio.mp3",
      );

      expect(SpeechService.transcribeAudio).toHaveBeenCalledWith(
        "https://example.com/audio.mp3",
      );
      expect(result).toEqual({
        success: true,
        text: "Transcribed from URL",
      });
    });
  });

  describe("queueTextToSpeech", () => {
    it("returns success and message when SpeechService succeeds", async () => {
      vi.mocked(SpeechService.textToSpeech).mockResolvedValue({
        success: true,
        message: "TTS generation queued",
      });

      const result = await SpeechController.queueTextToSpeech("msg-123");

      expect(SpeechService.textToSpeech).toHaveBeenCalledWith("msg-123");
      expect(result).toEqual({
        success: true,
        message: "TTS generation queued",
      });
    });

    it("returns failure and server error when SpeechService fails", async () => {
      vi.mocked(SpeechService.textToSpeech).mockResolvedValue({
        success: false,
        error: "Quota exceeded",
      });

      const result = await SpeechController.queueTextToSpeech("msg-123");

      expect(SpeechService.textToSpeech).toHaveBeenCalledWith("msg-123");
      expect(result).toEqual({
        success: false,
        error: "Quota exceeded",
      });
    });

    it("falls back to localized error when SpeechService fails without message", async () => {
      vi.mocked(SpeechService.textToSpeech).mockResolvedValue({
        success: false,
      });

      const result = await SpeechController.queueTextToSpeech("msg-123");

      expect(result.success).toBe(false);
      expect(typeof result.error).toBe("string");
      expect(result.error?.length).toBeGreaterThan(0);
    });
  });

  describe("startListening", () => {
    it("delegates options to SpeechService.startListening", async () => {
      vi.mocked(SpeechService.startListening).mockResolvedValue(
        SPEECH_LISTEN_RESULTS.STARTED,
      );

      const result = await SpeechController.startListening({ seed: "initial" });

      expect(SpeechService.startListening).toHaveBeenCalledWith({
        seed: "initial",
      });
      expect(result).toBe(SPEECH_LISTEN_RESULTS.STARTED);
    });
  });

  describe("stopListening", () => {
    it("calls SpeechService.stopListening", async () => {
      vi.mocked(SpeechService.stopListening).mockResolvedValue();

      await SpeechController.stopListening();

      expect(SpeechService.stopListening).toHaveBeenCalledTimes(1);
    });
  });

  describe("playUrl", () => {
    it("calls SpeechService.playUrl with target url", async () => {
      vi.mocked(SpeechService.playUrl).mockResolvedValue();

      await SpeechController.playUrl("https://example.com/audio.mp3");

      expect(SpeechService.playUrl).toHaveBeenCalledWith(
        "https://example.com/audio.mp3",
      );
    });
  });

  describe("stopPlayback", () => {
    it("calls SpeechService.stopPlayback", () => {
      SpeechController.stopPlayback();

      expect(SpeechService.stopPlayback).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSnapshot", () => {
    it("returns current snapshot from SpeechService", () => {
      const mockSnapshot = {
        isListening: true,
        isListenSessionActive: true,
        isBusy: true,
        voiceLevel: 0.75,
        liveText: "Hello test",
        isPlaying: false,
        playingUrl: null,
      };
      vi.mocked(SpeechService.getSnapshot).mockReturnValue(mockSnapshot);

      const snapshot = SpeechController.getSnapshot();

      expect(snapshot).toEqual(mockSnapshot);
    });
  });

  describe("subscribe", () => {
    it("registers listener and returns unsubscribe callback", () => {
      const unsub = vi.fn();
      const listener = vi.fn();
      vi.mocked(SpeechService.subscribe).mockReturnValue(unsub);

      const unsubscribe = SpeechController.subscribe(listener);

      expect(SpeechService.subscribe).toHaveBeenCalledWith(listener);
      expect(unsubscribe).toBe(unsub);
    });
  });
});
