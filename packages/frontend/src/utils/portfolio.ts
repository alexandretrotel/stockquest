import { SavedPortfolios } from "@/schemas/portfolio.schema";
import _ from "lodash";

/**
 * Calculates the total number of unique stocks across all saved portfolios.
 * Extracts stock symbols from portfolio allocations and counts distinct symbols.
 *
 * @param savedPortfolios - Array of saved portfolio objects
 * @returns The number of unique stock symbols across all portfolios
 */
export const getNumberOfStocks = (savedPortfolios: SavedPortfolios) => {
  const allStockSymbols = _.flatMap(
    savedPortfolios,
    (portfolio: SavedPortfolios[number]) =>
      portfolio.allocations.map((stock) => stock.symbol),
  );

  const numberOfStocks = _.uniq(allStockSymbols).length;
  return numberOfStocks;
};

/**
 * Checks if at least one portfolio in the saved portfolios outperforms the S&P 500.
 * A portfolio beats the S&P 500 if any of its performance records indicate so.
 *
 * @param {SavedPortfolios} savedPortfolios - Array of saved portfolio objects
 * @returns {boolean} True if at least one portfolio beats the S&P 500, false otherwise
 */
export const atLeastOnePortfolioBeatsSP500 = (
  savedPortfolios: SavedPortfolios,
) =>
  savedPortfolios.some((portfolio: SavedPortfolios[number]) => {
    if (!portfolio.performance) return false;

    return portfolio.performance.some((performance) => performance.beatsSP500);
  });
