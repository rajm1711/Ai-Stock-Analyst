import { NewsView } from "@/components/news/news-view";

export default function NewsSymbolPage({ params }: { params: { symbol: string } }) {
  return <NewsView symbol={params.symbol.toUpperCase()} />;
}
