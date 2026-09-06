import { describe, it, expect, vi, beforeEach } from "vitest";
import AiController from "./ai.controller";
import AiService from "./ai.service";
import SocketService from "../../services/socket.service";
import { IRoom, IMessage } from "./types";
import { AI_MESSAGE_STATUS, AI_SOCKET_EVENTS } from "./constants";
import { SpeechController } from "../speech";

vi.mock("../speech", () => ({
  SpeechController: {
    queueTextToSpeech: vi.fn(),
  },
}));

vi.mock("./ai.service", () => ({
  default: {
    getRooms: vi.fn(),
    createRoom: vi.fn(),
    getHistory: vi.fn(),
    chat: vi.fn(),
    clearHistory: vi.fn(),
    renameRoom: vi.fn(),
    deleteRoom: vi.fn(),
  },
}));

vi.mock("../../services/socket.service", () => ({
  default: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  },
}));

const mockRoom: IRoom = {
  id: "room-1",
  title: "General AI Chat",
  created_at: "2026-09-01T00:00:00Z",
} as any;

const mockMessage: IMessage = {
  id: "msg-1",
  room_id: "room-1",
  role: "user",
  content: "Hello AI",
  created_at: "2026-09-01T00:00:00Z",
};

describe("AiController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AiController.setRoomId("");
  });

  describe("setRoomId and getCurrentRoomId", () => {
    it("stores and returns current room ID", () => {
      AiController.setRoomId("room-123");
      expect(AiController.getCurrentRoomId()).toBe("room-123");
    });
  });

  describe("subscribeToAiMessages", () => {
    it("subscribes listener and handles relevant socket notifications", () => {
      let registeredListener: ((event: any) => void) | undefined;
      vi.mocked(SocketService.addListener).mockImplementation((listener: any) => {
        registeredListener = listener;
      });

      const callback = vi.fn();
      AiController.setRoomId("room-1");
      const unsubscribe = AiController.subscribeToAiMessages(callback);

      expect(SocketService.addListener).toHaveBeenCalled();

      // Trigger matching event
      registeredListener?.({
        type: "notification",
        data: {
          type: AI_SOCKET_EVENTS.RESPONSE_READY,
          room_id: "room-1",
        },
      });
      expect(callback).toHaveBeenCalled();

      // Trigger non-matching event
      callback.mockClear();
      registeredListener?.({
        type: "notification",
        data: {
          type: AI_SOCKET_EVENTS.RESPONSE_READY,
          room_id: "other-room",
        },
      });
      expect(callback).not.toHaveBeenCalled();

      unsubscribe();
      expect(SocketService.removeListener).toHaveBeenCalled();
    });
  });

  describe("getRooms", () => {
    it("returns rooms and pagination on success", async () => {
      vi.mocked(AiService.getRooms).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { rooms: [mockRoom] },
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await AiController.getRooms();
      expect(result.success).toBe(true);
      expect(result.rooms).toEqual([mockRoom]);
      expect(result.pagination?.total_count).toBe(1);
    });

    it("handles failure cleanly", async () => {
      vi.mocked(AiService.getRooms).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null as any,
        },
      });

      const result = await AiController.getRooms();
      expect(result.success).toBe(false);
      expect(result.rooms).toEqual([]);
    });
  });

  describe("createRoom", () => {
    it("creates room and sets currentRoomId on success", async () => {
      vi.mocked(AiService.createRoom).mockResolvedValue({
        data: {
          status: { code: 201, success: true, message: "Created" },
          data: { room: mockRoom },
        },
      });

      const result = await AiController.createRoom("New Chat");
      expect(result.success).toBe(true);
      expect(result.room).toEqual(mockRoom);
      expect(AiController.getCurrentRoomId()).toBe(mockRoom.id);
    });
  });

  describe("loadHistory", () => {
    it("loads and parses paginated message history", async () => {
      vi.mocked(AiService.getHistory).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "msg-1",
              type: "message",
              attributes: { ...mockMessage, metadata: { status: AI_MESSAGE_STATUS.COMPLETED } },
            },
          ] as any,
          meta: { pagination: { current_page: 1, total_pages: 1, total_count: 1, limit: 10 } } as any,
        },
      });

      const result = await AiController.loadHistory("room-1");
      expect(result.success).toBe(true);
      expect(result.messages.length).toBe(1);
      expect(result.processing).toBe(false);
    });

    it("detects processing state when message status is processing or queued", async () => {
      vi.mocked(AiService.getHistory).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "msg-1",
              type: "message",
              attributes: { ...mockMessage, metadata: { status: AI_MESSAGE_STATUS.PROCESSING } },
            },
          ] as any,
        },
      });

      const result = await AiController.loadHistory("room-1");
      expect(result.success).toBe(true);
      expect(result.processing).toBe(true);
    });
  });

  describe("chat", () => {
    it("sends message and returns assistant response", async () => {
      vi.mocked(AiService.chat).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { message: mockMessage, room_id: "room-1" } as any,
        },
      });

      const result = await AiController.chat("Hello AI", "room-1");
      expect(result.success).toBe(true);
      expect(result.message).toEqual(mockMessage);
      expect(result.roomId).toBe("room-1");
    });
  });

  describe("clearHistory, renameRoom, deleteRoom", () => {
    it("clears message history", async () => {
      vi.mocked(AiService.clearHistory).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Cleared" },
          data: null as any,
        },
      });

      const result = await AiController.clearHistory("room-1");
      expect(result.success).toBe(true);
    });

    it("renames room", async () => {
      vi.mocked(AiService.renameRoom).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Renamed" },
          data: { title: "Updated Title" },
        },
      });

      const result = await AiController.renameRoom("room-1", "Updated Title");
      expect(result.success).toBe(true);
      expect(result.title).toBe("Updated Title");
    });

    it("deletes room and resets currentRoomId", async () => {
      AiController.setRoomId("room-1");
      vi.mocked(AiService.deleteRoom).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Deleted" },
          data: null as any,
        },
      });

      const result = await AiController.deleteRoom("room-1");
      expect(result.success).toBe(true);
      expect(AiController.getCurrentRoomId()).toBeNull();
    });
  });

  describe("queueTextToSpeech", () => {
    it("delegates to SpeechController and returns success", async () => {
      vi.mocked(SpeechController.queueTextToSpeech).mockResolvedValue({
        success: true,
        message: "TTS queued",
      });

      const result = await AiController.queueTextToSpeech("msg-1");

      expect(SpeechController.queueTextToSpeech).toHaveBeenCalledWith("msg-1");
      expect(result).toEqual({
        success: true,
        message: "TTS queued",
      });
    });

    it("delegates to SpeechController and returns failure", async () => {
      vi.mocked(SpeechController.queueTextToSpeech).mockResolvedValue({
        success: false,
        error: "Failed to queue TTS",
      });

      const result = await AiController.queueTextToSpeech("msg-1");

      expect(SpeechController.queueTextToSpeech).toHaveBeenCalledWith("msg-1");
      expect(result).toEqual({
        success: false,
        error: "Failed to queue TTS",
      });
    });
  });
});
