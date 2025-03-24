import MostProfitablePortfolios from "@/features/portfolio/components/most-profitable-portfolios";
import StockDiscoverySection from "@/features/portfolio/components/stock-discovery-section";

export default function Home() {
  return (
    <>
      <StockDiscoverySection />
      <MostProfitablePortfolios />
    </>
  );
}
