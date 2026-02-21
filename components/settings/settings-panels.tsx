"use client";

import { Card } from "@/components/ui/card";

const sections = ["Notifications", "Scanner Defaults", "API Usage", "Subscription"];

export function SettingsPanels() {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section} className="p-0">
          <details className="group rounded-xl p-6">
            <summary className="cursor-pointer list-none text-section text-primary">{section}</summary>
            <div className="mt-4 text-body text-slate-700">
              Configure {section.toLowerCase()} with institution-grade defaults, auditability, and account-level controls.
            </div>
          </details>
        </Card>
      ))}
    </div>
  );
}
