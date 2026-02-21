import { NewsItem } from "@/types/market";
import { finnhubRequest } from "./client";

interface FinnhubNewsItem {
  id: number;
  headline: string;
  source: string;
  summary: string;
  url: string;
  datetime: number;
}

export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
  const toDate = new Date();
  const fromDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const payload = await finnhubRequest<FinnhubNewsItem[]>({
    path: "/company-news",
    params: {
      symbol: symbol.toUpperCase(),
      from: fromDate.toISOString().slice(0, 10),
      to: toDate.toISOString().slice(0, 10)
    },
    throttleKey: "finnhub:news"
  });

  return payload.slice(0, 8).map((item) => ({
    id: String(item.id),
    symbol: symbol.toUpperCase(),
    headline: item.headline,
    source: item.source,
    url: item.url,
    publishedAt: new Date(item.datetime * 1000).toISOString(),
    sentiment: "neutral"
  }));
}
