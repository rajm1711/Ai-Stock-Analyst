import { LiveOverview } from "@/components/dashboard/live-overview";

export default function OverviewPage() {
  return (
    <div className="section-gap">
      <h1 className="text-page text-primary">Market Intelligence Overview</h1>
      <LiveOverview />
    </div>
  );
}
