import { enforceRateLimit } from "@/lib/rate-limit";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export class FinnhubError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "FinnhubError";
  }
}

interface RequestOptions {
  path: string;
  params?: Record<string, string | number | undefined>;
  throttleKey?: string;
}

function buildUrl(path: string, params: RequestOptions["params"]) {
  const url = new URL(`${FINNHUB_BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url;
}

export async function finnhubRequest<T>({ path, params, throttleKey = "finnhub:global" }: RequestOptions): Promise<T> {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) throw new FinnhubError("FINNHUB_API_KEY is not configured");

  enforceRateLimit(throttleKey, 50, 60_000);

  const url = buildUrl(path, { ...params, token });

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });

    if (response.status === 429) {
      throw new FinnhubError("Finnhub rate limit exceeded", 429);
    }

    if (!response.ok) {
      throw new FinnhubError(`Finnhub request failed with ${response.status}`, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof FinnhubError) throw error;
    throw new FinnhubError(`Finnhub network error: ${(error as Error).message}`);
  }
}
