import { appStoreActions } from "@/store/use-app-store";

const WS_URL = "wss://api.yourdomain.com/ws";
const channels = ["candle_close", "market_update", "scanner_update"];

export type WsMessage = {
  channel: "candle_close" | "market_update" | "scanner_update";
  payload: unknown;
};

export class MarketWebSocket {
  private ws: WebSocket | null = null;
  private retries = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<(data: WsMessage) => void>();

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    appStoreActions.setWsState("connecting");
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.retries = 0;
      appStoreActions.setWsState("connected");
      this.ws?.send(JSON.stringify({ action: "subscribe", channels }));
    };

    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as WsMessage;
        this.listeners.forEach((listener) => listener(parsed));
      } catch {
        // ignore malformed payloads
      }
    };

    this.ws.onclose = () => {
      appStoreActions.setWsState("disconnected");
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
    appStoreActions.setWsState("disconnected");
  }

  onMessage(listener: (data: WsMessage) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private scheduleReconnect() {
    const delay = Math.min(1000 * 2 ** this.retries, 15000);
    this.retries += 1;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }
}
