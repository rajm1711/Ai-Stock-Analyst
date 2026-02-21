import "./globals.css";
import type { Metadata } from "next";
import { TopNav } from "@/components/layout/top-nav";

export const metadata: Metadata = {
  title: "AI Institutional Market Research Platform",
  description: "Institutional-grade AI market intelligence for equities and forex"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
          <TopNav />
          {children}
        </main>
      </body>
    </html>
  );
}
