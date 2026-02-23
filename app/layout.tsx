import "./globals.css";
import type { Metadata } from "next";
import { TopNav } from "@/components/layout/top-nav";
import { WebSocketProvider } from "@/components/layout/websocket-provider";

export const metadata: Metadata = {
  title: "AI Market Analyst Workstation",
  description: "Professional AI-powered research workstation for US stock and forex analysts"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <WebSocketProvider>
          <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6">
            <TopNav />
            {children}
          </main>
        </WebSocketProvider>
      </body>
    </html>
  );
}
