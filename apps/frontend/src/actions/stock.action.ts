"use server";

import {
  ScreenerQuotes,
  ScreenerQuotesSchema,
} from "@/schemas/screener.schema";
import { getChartInterval } from "@/utils/date";
import yahooFinance from "yahoo-finance2";

export type YahooStockQuotes = Awaited<ReturnType<typeof getStockQuotes>>;
export type YahooRecommendations = Awaited<
  ReturnType<typeof getStockRecommendations>
>;
export type YahooInsights = Awaited<ReturnType<typeof getStockInsights>>;
export type YahooStockQuoteSummaryAssetProfile = Awaited<
  ReturnType<typeof getStockQuoteSummaryAssetProfile>
>;
export type YahooChartQuotes = Awaited<ReturnType<typeof getStockChartQuotes>>;
export type YahooSearch = Awaited<ReturnType<typeof getSearchQuotes>>;
export type YahooDailyGainers = Awaited<ReturnType<typeof getDailyGainers>>;
export type YahooDailyLosers = Awaited<ReturnType<typeof getDailyLosers>>;
export type YahooScreener = {
  day_gainers: YahooDailyGainers;
  day_losers: YahooDailyLosers;
};
const { FailedYahooValidationError } = yahooFinance.errors;

/**
 * Determines if an error is a Yahoo Finance validation error.
 * Checks if the error object is an instance of FailedYahooValidationError.
 *
 * @param error - The error to inspect
 * @returns True if the error is a FailedYahooValidationError, false otherwise
 */
function isFailedYahooValidationError(
  error: unknown,
): error is typeof FailedYahooValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "result" in error &&
    error instanceof FailedYahooValidationError
  );
}

/**
 * Retrieves real-time stock quotes for a given symbol from Yahoo Finance.
 *
 * @param symbol - The stock ticker symbol (e.g., "AAPL") to fetch quotes for
 * @returns A promise resolving to the stock quote data from Yahoo Finance
 */
export const getStockQuotes = async (symbol: string) => {
  const data = await yahooFinance.quote(symbol);
  return data;
};

/**
 * Retrieves analyst recommendations for a given stock symbol from Yahoo Finance.
 *
 * @param symbol - The stock ticker symbol (e.g., "AAPL") to fetch recommendations for
 * @returns A promise resolving to the stock recommendation data
 */
export const getStockRecommendations = async (symbol: string) => {
  const data = await yahooFinance.recommendationsBySymbol(symbol);
  return data;
};

/**
 * Retrieves detailed insights for a given stock symbol from Yahoo Finance.
 *
 * @param symbol - The stock ticker symbol (e.g., "AAPL") to fetch insights for
 * @returns A promise resolving to the stock insights data
 */
export const getStockInsights = async (symbol: string) => {
  const data = await yahooFinance.insights(symbol);
  return data;
};

/**
 * Retrieves a stock’s quote summary with asset profile details from Yahoo Finance.
 * Includes information like company profile and sector.
 *
 * @param symbol - The stock ticker symbol (e.g., "AAPL") to fetch summary data for
 * @returns A promise resolving to the quote summary data with asset profile
 */
export const getStockQuoteSummaryAssetProfile = async (symbol: string) => {
  const data = await yahooFinance.quoteSummary(symbol, {
    modules: ["assetProfile"],
  });
  return data;
};

/**
 * Retrieves historical chart data for a stock symbol from Yahoo Finance.
 * Uses a dynamic interval (daily or weekly) based on the date range unless bypassed.
 *
 * @param symbol - The stock ticker symbol (e.g., "AAPL") to fetch chart data for
 * @param startingDate - The start date for the chart data range
 * @param bypassChartInterval - Optional flag to force a daily ("1d") interval (defaults to false)
 * @returns A promise resolving to the stock’s historical chart quotes
 */
export const getStockChartQuotes = async (
  symbol: string,
  startingDate: Date,
  bypassChartInterval?: boolean,
) => {
  const data = await yahooFinance.chart(symbol, {
    interval: bypassChartInterval ? "1d" : getChartInterval(startingDate),
    period1: startingDate,
  });

  return data.quotes;
};

/**
 * Retrieves historical chart data for multiple stock symbols from Yahoo Finance.
 * Fetches data for each symbol and pairs it with its quotes.
 *
 * @param symbols - Array of stock ticker symbols (e.g., ["AAPL", "GOOG"]) to fetch chart data for
 * @param startingDate - The start date for the chart data range
 * @param bypassChartInterval - Optional flag to force a daily ("1d") interval (defaults to false)
 * @returns A promise resolving to an array of objects with symbols and their chart quotes
 */
export const getStocksChartQuotes = async (
  symbols: string[],
  startingDate: Date,
  bypassChartInterval?: boolean,
) => {
  const data = await Promise.all(
    symbols.map(async (symbol) => {
      const quotes = await getStockChartQuotes(
        symbol,
        startingDate,
        bypassChartInterval,
      );

      return { symbol, quotes };
    }),
  );

  return data;
};

/**
 * Searches for stock quotes based on a query using Yahoo Finance.
 * Returns up to 10 matching stock quotes.
 *
 * @param query - The search term (e.g., "Apple" or "AAPL") to find stock quotes for
 * @returns A promise resolving to an array of search result quotes
 */
export const getSearchQuotes = async (query: string) => {
  const data = await yahooFinance.search(query, {
    quotesCount: 10,
  });
  return data.quotes;
};

/**
 * Retrieves the top daily gaining stocks from Yahoo Finance.
 * Fetches up to 8 stocks, validated against a schema, with fallback on validation errors.
 *
 * @returns A promise resolving to an array of daily gainer stock quotes
 */
export const getDailyGainers = async () => {
  let unvalidatedData;
  try {
    unvalidatedData = await yahooFinance.screener({
      scrIds: "day_gainers",
      count: 8,
    });
  } catch (error) {
    if (isFailedYahooValidationError(error)) {
      console.error(error);
      unvalidatedData = error.result;
    } else {
      throw error;
    }
  }

  let data: ScreenerQuotes = [];
  try {
    data = await ScreenerQuotesSchema.parseAsync(unvalidatedData.quotes);
  } catch (error) {
    throw error;
  }

  return data;
};

/**
 * Retrieves the top daily losing stocks from Yahoo Finance.
 * Fetches up to 8 stocks, validated against a schema, with fallback on validation errors.
 *
 * @returns A promise resolving to an array of daily loser stock quotes
 */
export const getDailyLosers = async () => {
  let unvalidatedData;
  try {
    unvalidatedData = await yahooFinance.screener({
      scrIds: "day_losers",
      count: 8,
    });
  } catch (error) {
    if (isFailedYahooValidationError(error)) {
      console.error(error);
      unvalidatedData = error.result;
    } else {
      throw error;
    }
  }

  let data: ScreenerQuotes = [];
  try {
    data = await ScreenerQuotesSchema.parseAsync(unvalidatedData.quotes);
  } catch (error) {
    throw error;
  }

  return data;
};

/**
 * Retrieves both daily gainers and losers from Yahoo Finance.
 * Combines results into a single object, with error logging on failure.
 *
 * @returns A promise resolving to an object with daily gainers and losers, or the error if failed
 */
export const getScreeners = async () => {
  try {
    const screener = await Promise.all([getDailyGainers(), getDailyLosers()]);
    const result: YahooScreener = {
      day_gainers: screener[0],
      day_losers: screener[1],
    };

    return result;
  } catch (error) {
    throw error;
  }
};
