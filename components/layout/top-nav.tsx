"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-100">AI Market Analyst Workstation</p>
        <p className="text-xs text-slate-400">Research only • backend-driven</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition",
                active ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
