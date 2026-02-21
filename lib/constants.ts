export const NAV_ITEMS = [
  { href: "/overview", label: "Overview" },
  { href: "/research", label: "Research" },
  { href: "/scanner", label: "Scanner" },
  { href: "/insights", label: "Insights" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

export const RESEARCH_DISCLAIMER =
  "This report is for informational and research purposes only and does not constitute financial advice.";

export const SUBSCRIPTION_LIMITS = {
  free: { reportsPerDay: 3, scannerRequestsPerDay: 20 },
  pro: { reportsPerDay: 100, scannerRequestsPerDay: 400 },
  elite: { reportsPerDay: 500, scannerRequestsPerDay: 2000 }
} as const;
