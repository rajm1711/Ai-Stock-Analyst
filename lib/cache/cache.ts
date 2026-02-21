type CacheRecord<T> = { value: T; expiresAt: number };

const memory = new Map<string, CacheRecord<unknown>>();

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = memory.get(key);
  if (!cached || cached.expiresAt < Date.now()) {
    memory.delete(key);
    return null;
  }

  return cached.value as T;
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function withCacheFallback<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  try {
    const fresh = await fetcher();
    await setCache(key, fresh, ttlSeconds);
    return fresh;
  } catch (error) {
    const stale = await getCache<T>(key);
    if (stale) return stale;
    throw error;
  }
}
