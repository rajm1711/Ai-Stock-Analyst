import { fetchWithRetry } from "@/lib/fetch";
import { NewsItem } from "@/types/market";

const NEWS_BASE_URL = process.env.NEWS_API_BASE_URL ?? "https://newsapi.org/v2/everything";

export async function fetchNews(symbol: string): Promise<NewsItem[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error("NEWS_API_KEY is not configured");

  const query = `${NEWS_BASE_URL}?q=${encodeURIComponent(symbol)}&sortBy=publishedAt&pageSize=8&language=en&apiKey=${key}`;
  const response = await fetchWithRetry(query, { next: { revalidate: 0 } });
  const payload = await response.json();

  return (payload.articles ?? []).map((article: Record<string, unknown>, index: number) => ({
    id: `${symbol}-${index}`,
    symbol,
    headline: String(article.title ?? "Untitled"),
    source: String((article.source as { name?: string } | undefined)?.name ?? "Unknown"),
    url: String(article.url ?? "#"),
    publishedAt: String(article.publishedAt ?? new Date().toISOString()),
    sentiment: "neutral"
  }));
}
