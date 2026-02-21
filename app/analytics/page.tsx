import { AnalyticsBoard } from "@/components/analytics/analytics-board";

export default function AnalyticsPage() {
  return (
    <div className="section-gap">
      <h1 className="text-page text-primary">Performance Analytics</h1>
      <AnalyticsBoard />
    </div>
  );
}
