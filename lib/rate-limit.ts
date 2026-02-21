const inMemoryCounter = new Map<string, { count: number; windowStart: number }>();

export function enforceRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const current = inMemoryCounter.get(key);

  if (!current || now - current.windowStart > windowMs) {
    inMemoryCounter.set(key, { count: 1, windowStart: now });
    return;
  }

  if (current.count >= maxRequests) {
    throw new Error("Rate limit exceeded");
  }

  current.count += 1;
  inMemoryCounter.set(key, current);
}
