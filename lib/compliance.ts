import { RESEARCH_DISCLAIMER } from "@/lib/constants";

const blockedPatterns = [/\bbuy\s+now\b/i, /\bsell\s+now\b/i, /\bguaranteed\s+profit\b/i];

export function assertCompliantLanguage(text: string) {
  const violated = blockedPatterns.some((pattern) => pattern.test(text));
  if (violated) {
    throw new Error("Output failed compliance policy checks.");
  }

  return text.includes(RESEARCH_DISCLAIMER) ? text : `${text}\n\n${RESEARCH_DISCLAIMER}`;
}
