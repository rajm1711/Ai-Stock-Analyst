"use client";

import { useMarketSocket } from "@/hooks/use-market-socket";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useMarketSocket();
  return <>{children}</>;
}
