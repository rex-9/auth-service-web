import AppConfig from "../AppConfig";
import {
  parseCableChannel,
  SOCKET_CHANNELS,
  SOCKET_CONNECT_WAIT_MS,
  SOCKET_SUBSCRIBE_TIMEOUT_MS,
  type ISocketMessage,
} from "../helpers/socket.helpers";

export type { ISocketMessage } from "../helpers/socket.helpers";

type TSubscriptionWaiter = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

class SocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private listeners: ((data: ISocketMessage) => void)[] = [];
  private isConnected = false;
  private token: string | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;
  private subscriptionWaiters = new Map<string, TSubscriptionWaiter>();
  private subscribedChannels = new Set<string>();

  connect(token: string | null): void {
    // Don't connect if already connecting or no token
    if (this.isConnecting) {
      console.log("🔌 Connection already in progress");
      return;
    }

    if (!token || token.trim() === "") {
      console.log("🔌 No token, skipping WebSocket");
      this.disconnect();
      return;
    }

    // If already connected with same token, skip
    if (this.ws?.readyState === WebSocket.OPEN && this.token === token) {
      return;
    }

    // Clean previous connection
    this.cleanup();

    const cleanToken = token.replace(/^"|"$/g, "").trim();
    this.token = cleanToken;
    this.isConnecting = true;

    const wsUrl = `${AppConfig.SERVER_WS_BASE_URL}/cable?token=${cleanToken}`;
    console.log("🔌 Connecting to WebSocket...");
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  disconnect(): void {
    this.token = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.cleanup();
  }

  private identifierFor(channel: string): string {
    return JSON.stringify({ channel });
  }

  private rejectSubscriptionWaiters(reason: string): void {
    this.subscriptionWaiters.forEach((waiter) => {
      clearTimeout(waiter.timer);
      waiter.reject(new Error(reason));
    });
    this.subscriptionWaiters.clear();
  }

  private settleSubscription(channel: string, confirmed: boolean): void {
    if (!channel) {
      return;
    }

    const waiter = this.subscriptionWaiters.get(channel);
    if (confirmed) {
      this.subscribedChannels.add(channel);
    }

    if (!waiter) {
      return;
    }

    clearTimeout(waiter.timer);
    this.subscriptionWaiters.delete(channel);

    if (confirmed) {
      waiter.resolve();
      return;
    }

    waiter.reject(new Error(`Subscription rejected: ${channel}`));
  }

  private cleanup(): void {
    this.rejectSubscriptionWaiters("WebSocket disconnected");
    this.subscribedChannels.clear();

    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close WebSocket
    if (this.ws) {
      // Remove all listeners to prevent memory leaks
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;

      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close();
      }
      this.ws = null;
    }

    this.isConnected = false;
  }

  private handleOpen(): void {
    console.log("🔌 WebSocket connected");
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    void this.subscribeChannel(SOCKET_CHANNELS.NOTIFICATION).catch((error) => {
      console.warn("NotificationChannel subscribe failed:", error);
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as {
        type?: string;
        identifier?: unknown;
        message?: unknown;
      };

      // Handle different message types
      if (data.type === "welcome") {
        console.log("👋 WebSocket welcome");
        return;
      }

      if (data.type === "ping") {
        // Keep-alive, ignore
        return;
      }

      if (data.type === "confirm_subscription") {
        this.settleSubscription(parseCableChannel(data.identifier), true);
        return;
      }

      if (data.type === "reject_subscription") {
        this.settleSubscription(parseCableChannel(data.identifier), false);
        return;
      }

      if (data.message && typeof data.message === "object") {
        this.notifyListeners({
          ...(data.message as ISocketMessage),
          channel: parseCableChannel(data.identifier),
        });
      }
    } catch (error) {
      console.error("WebSocket parse error:", error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log("🔌 WebSocket disconnected");
    this.isConnected = false;
    this.isConnecting = false;
    this.rejectSubscriptionWaiters("WebSocket disconnected");
    this.subscribedChannels.clear();

    if (this.token && event.code !== 1000) {
      this.reconnect();
    }
  }

  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
  }

  private send(data: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return;
    }

    console.warn("📨 SocketService: WebSocket not open, message not sent");
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.token) {
      this.reconnectAttempts++;
      const delay = 2000 * this.reconnectAttempts;
      console.log(
        `🔄 Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
      }

      this.reconnectTimer = setTimeout(() => {
        if (this.token) {
          this.connect(this.token);
        }
      }, delay);
      return;
    }

    console.log("❌ Max reconnect attempts reached");
    this.isConnecting = false;
  }

  // ===== LISTENER SYSTEM =====

  addListener(callback: (data: ISocketMessage) => void): void {
    // Prevent duplicate listeners
    if (!this.listeners.includes(callback)) {
      this.listeners.push(callback);
    }
  }

  removeListener(callback: (data: ISocketMessage) => void): void {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  // Clear all listeners
  clearListeners(): void {
    this.listeners = [];
  }

  private notifyListeners(data: ISocketMessage): void {
    // Use a copy to prevent modification during iteration
    const listeners = [...this.listeners];
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error("Listener error:", error);
      }
    });
  }

  // ===== PUBLIC METHODS =====

  isConnectedToSocket(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  waitUntilConnected(timeoutMs = SOCKET_CONNECT_WAIT_MS): Promise<void> {
    if (this.isConnectedToSocket()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      const timer = setInterval(() => {
        if (this.isConnectedToSocket()) {
          clearInterval(timer);
          resolve();
          return;
        }

        if (Date.now() - startedAt >= timeoutMs) {
          clearInterval(timer);
          reject(new Error("WebSocket not connected"));
        }
      }, 100);
    });
  }

  subscribeChannel(channel: string): Promise<void> {
    if (!this.isConnectedToSocket()) {
      return Promise.reject(new Error("WebSocket not connected"));
    }

    const inFlight = this.subscriptionWaiters.get(channel);
    if (inFlight) {
      return inFlight.promise;
    }

    if (this.subscribedChannels.has(channel)) {
      return Promise.resolve();
    }

    let resolve!: () => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const timer = setTimeout(() => {
      this.subscriptionWaiters.delete(channel);
      reject(new Error(`Subscription timeout: ${channel}`));
    }, SOCKET_SUBSCRIBE_TIMEOUT_MS);

    this.subscriptionWaiters.set(channel, { promise, resolve, reject, timer });
    this.send({
      command: "subscribe",
      identifier: this.identifierFor(channel),
    });

    return promise;
  }

  unsubscribeChannel(channel: string): void {
    const waiter = this.subscriptionWaiters.get(channel);
    if (waiter) {
      clearTimeout(waiter.timer);
      this.subscriptionWaiters.delete(channel);
      waiter.reject(new Error(`Subscription cancelled: ${channel}`));
    }

    this.subscribedChannels.delete(channel);
    this.send({
      command: "unsubscribe",
      identifier: this.identifierFor(channel),
    });
  }

  perform(
    channel: string,
    action: string,
    payload: Record<string, unknown> = {},
  ): void {
    if (!this.isConnectedToSocket()) {
      console.warn("WebSocket not connected");
      return;
    }

    this.send({
      command: "message",
      identifier: this.identifierFor(channel),
      data: JSON.stringify({ action, ...payload }),
    });
  }

  sendMessage(
    channel: string,
    message: string,
    data: Record<string, unknown> = {},
  ): void {
    this.perform(channel, "receive", { message, ...data });
  }
}

export default new SocketService();
