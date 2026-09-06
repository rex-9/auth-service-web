import { describe, it, expect } from "vitest";
import { joinTranscript, mergePartial } from "./transcript";

describe("transcript helpers", () => {
  describe("joinTranscript", () => {
    it("returns right trimmed if left is empty", () => {
      expect(joinTranscript("", "  hello  ")).toBe("hello");
    });

    it("returns left as is if right is empty or whitespace", () => {
      expect(joinTranscript("hello", "")).toBe("hello");
      expect(joinTranscript("hello", "   ")).toBe("hello");
    });

    it("joins with space if left does not end with whitespace or newline", () => {
      expect(joinTranscript("hello", "world")).toBe("hello world");
    });

    it("does not insert extra space if left already ends with space", () => {
      expect(joinTranscript("hello ", "world")).toBe("hello world");
    });

    it("does not insert space if left ends with newline", () => {
      expect(joinTranscript("hello\n", "world")).toBe("hello\nworld");
    });
  });

  describe("mergePartial", () => {
    it("returns incoming if current is empty", () => {
      expect(mergePartial("", "partial speech")).toBe("partial speech");
    });

    it("returns current if incoming is empty", () => {
      expect(mergePartial("current", "")).toBe("current");
    });

    it("replaces current if incoming starts with current (case-insensitive extension)", () => {
      expect(mergePartial("hello", "hello world")).toBe("hello world");
      expect(mergePartial("Hello", "hello world")).toBe("hello world");
    });

    it("returns incoming if current starts with incoming (case-insensitive contraction)", () => {
      expect(mergePartial("hello world", "hello")).toBe("hello");
    });

    it("appends with space if incoming is a new, disjoint word", () => {
      expect(mergePartial("quick brown", "fox jumps")).toBe("quick brown fox jumps");
    });
  });
});
