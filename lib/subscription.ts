import { SUBSCRIPTION_LIMITS } from "@/lib/constants";

export type Tier = keyof typeof SUBSCRIPTION_LIMITS;

export function getTierLimit(tier: Tier, kind: "reportsPerDay" | "scannerRequestsPerDay") {
  return SUBSCRIPTION_LIMITS[tier][kind];
}
