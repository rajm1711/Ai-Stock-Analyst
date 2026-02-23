"use client";

import { useEffect } from "react";
import { MarketWebSocket } from "@/services/websocket";
import { appStoreActions } from "@/store/use-app-store";
import type { MarketOverview, ScannerResult } from "@/services/api";

const socket = new MarketWebSocket();

export function useMarketSocket() {
  useEffect(() => {
    const unsubscribe = socket.onMessage((message) => {
      if (message.channel === "market_update") {
        appStoreActions.setMarketOverview(message.payload as MarketOverview);
      }

      if (message.channel === "scanner_update") {
        appStoreActions.setScannerResults(message.payload as ScannerResult[]);
      }
    });

    socket.connect();

    return () => {
      unsubscribe();
      socket.disconnect();
    };
  }, []);
}
