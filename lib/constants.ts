export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/research/SPY", label: "Research" },
  { href: "/scanner", label: "Scanner" },
  { href: "/news/SPY", label: "News" }
];

export const RESEARCH_DISCLAIMER =
  "This report is for informational and research purposes only and does not constitute financial advice.";

export const SUBSCRIPTION_LIMITS = {
  free: { reportsPerDay: 3, scannerRequestsPerDay: 20 },
  pro: { reportsPerDay: 100, scannerRequestsPerDay: 400 },
  elite: { reportsPerDay: 500, scannerRequestsPerDay: 2000 }
} as const;
