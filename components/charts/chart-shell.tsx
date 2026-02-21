import { Card } from "@/components/ui/card";

export function ChartShell({ title, description }: { title: string; description: string }) {
  return (
    <Card title={title} subtitle={description} className="h-[320px]">
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-neutral">
        Chart container (lazy-loaded chart integration point)
      </div>
    </Card>
  );
}
