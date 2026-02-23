import { ResearchView } from "@/components/research/research-view";

export default function ResearchSymbolPage({ params }: { params: { symbol: string } }) {
  return <ResearchView symbol={params.symbol.toUpperCase()} />;
}
