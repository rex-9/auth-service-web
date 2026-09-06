import { describe, it, expect } from "vitest";
import {
  downsampleFloat32,
  floatToInt16,
  floatChannelToPcm16,
  bytesToBase64,
  floatToVoiceLevel,
  pcmBytesToVoiceLevel,
} from "./pcm";

describe("pcm helpers", () => {
  describe("downsampleFloat32", () => {
    it("returns input array directly when source and target rates match", () => {
      const input = new Float32Array([0.1, 0.2, 0.3]);
      const result = downsampleFloat32(input, 16000, 16000);
      expect(result).toBe(input);
    });

    it("resamples 48kHz to 16kHz (3:1 ratio)", () => {
      const input = new Float32Array([0, 0.3, 0.6, 0.9, 0.6, 0.3]);
      const result = downsampleFloat32(input, 48000, 16000);
      expect(result.length).toBe(2);
      expect(result[0]).toBeCloseTo(0, 4);
      expect(result[1]).toBeCloseTo(0.9, 4);
    });
  });

  describe("floatToInt16", () => {
    it("converts normalized float32 samples to int16 range", () => {
      const input = new Float32Array([0, 1, -1, 0.5, -0.5]);
      const result = floatToInt16(input);

      expect(result[0]).toBe(0);
      expect(result[1]).toBe(32767);
      expect(result[2]).toBe(-32768);
      expect(result[3]).toBe(Math.trunc(0.5 * 32767));
      expect(result[4]).toBe(Math.trunc(-0.5 * 32768));
    });

    it("clamps out-of-range floats to [-1, 1]", () => {
      const input = new Float32Array([2.5, -3.0]);
      const result = floatToInt16(input);

      expect(result[0]).toBe(32767);
      expect(result[1]).toBe(-32768);
    });
  });

  describe("floatChannelToPcm16", () => {
    it("downsamples and encodes into Uint8Array bytes (2 bytes per sample)", () => {
      const input = new Float32Array([0, 0.5, 1.0, 0.5, 0, -0.5]);
      const result = floatChannelToPcm16(input, 16000, 16000);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.byteLength).toBe(input.length * 2);
    });
  });

  describe("bytesToBase64", () => {
    it("encodes Uint8Array into base64 string", () => {
      const text = "Hello Rexone Speech";
      const bytes = new TextEncoder().encode(text);
      const b64 = bytesToBase64(bytes);

      expect(atob(b64)).toBe(text);
    });

    it("handles large byte chunks (> 32KB) without error", () => {
      const largeBytes = new Uint8Array(40_000);
      for (let i = 0; i < largeBytes.length; i += 1) {
        largeBytes[i] = i % 256;
      }
      const b64 = bytesToBase64(largeBytes);
      expect(typeof b64).toBe("string");
      expect(b64.length).toBeGreaterThan(0);
    });
  });

  describe("floatToVoiceLevel", () => {
    it("returns 0 for empty input", () => {
      expect(floatToVoiceLevel(new Float32Array([]))).toBe(0);
    });

    it("returns 0 for silent input", () => {
      const silent = new Float32Array([0, 0, 0, 0]);
      expect(floatToVoiceLevel(silent)).toBe(0);
    });

    it("returns a normalized value between 0 and 1 for active audio", () => {
      const active = new Float32Array([0.2, -0.4, 0.6, -0.3, 0.5]);
      const level = floatToVoiceLevel(active);
      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThanOrEqual(1);
    });
  });

  describe("pcmBytesToVoiceLevel", () => {
    it("returns 0 for empty or undersized byte buffers", () => {
      expect(pcmBytesToVoiceLevel(new Uint8Array([]))).toBe(0);
      expect(pcmBytesToVoiceLevel(new Uint8Array([1]))).toBe(0);
    });

    it("calculates voice level from PCM16 byte buffers", () => {
      const samples = new Int16Array([1000, 5000, 15000, -8000]);
      const bytes = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
      const level = pcmBytesToVoiceLevel(bytes);

      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThanOrEqual(1);
    });
  });
});
