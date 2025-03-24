"use server";

import { db } from "@/db";
import { savedPortfolios } from "@/db/schema";
import { PerformanceResult } from "@/schemas/performance.schema";
import { Allocations, PortfolioPerformance } from "@/schemas/portfolio.schema";
import { and, eq } from "drizzle-orm";

/**
 * Removes a portfolio from a user's saved portfolios.
 * Deletes the portfolio from the database if it matches the given ID and user.
 *
 * @param portfolioId - The unique ID of the portfolio to unsave
 * @param userId - The ID of the user who owns the portfolio
 */
export const unsavePortfolio = async (portfolioId: string, userId: string) => {
  await db
    .delete(savedPortfolios)
    .where(
      and(
        eq(savedPortfolios.id, portfolioId),
        eq(savedPortfolios.userId, userId),
      ),
    )
    .execute();
};

/**
 * Saves a new portfolio for a user in the database.
 * Stores the portfolio’s name, allocations, and optional performance data.
 *
 * @param name - The name to assign to the portfolio
 * @param allocations - The stock allocations for the portfolio
 * @param userId - The ID of the user saving the portfolio
 * @param performance - Optional performance metrics for the portfolio (defaults to undefined)
 * @returns A promise resolving to the ID of the newly saved portfolio
 */
export const savePortfolio = async (
  name: string,
  allocations: Allocations,
  userId: string,
  performance?: PortfolioPerformance,
): Promise<string> => {
  let result;
  if (performance) {
    result = await db
      .insert(savedPortfolios)
      .values({
        name,
        allocations,
        performance: [performance],
        userId,
      })
      .returning()
      .execute();
  } else {
    result = await db
      .insert(savedPortfolios)
      .values({ name, allocations, userId })
      .returning()
      .execute();
  }

  const portfolioId = result[0].id;

  return portfolioId;
};

/**
 * Updates the name of an existing saved portfolio for a user.
 * Changes the portfolio’s name in the database if it matches the given ID and user.
 *
 * @param name - The new name for the portfolio
 * @param portfolioId - The unique ID of the portfolio to rename
 * @param userId - The ID of the user who owns the portfolio
 */
export const renamePortfolio = async (
  name: string,
  portfolioId: string,
  userId: string,
) => {
  await db
    .update(savedPortfolios)
    .set({ name })
    .where(
      and(
        eq(savedPortfolios.id, portfolioId),
        eq(savedPortfolios.userId, userId),
      ),
    )
    .execute();
};

/**
 * Updates a saved portfolio’s performance data to include a new result, indicating if it beats the S&P 500.
 * Appends the latest performance metrics to the portfolio’s existing performance history.
 *
 * @param portfolioId - The unique ID of the portfolio to update
 * @param userId - The ID of the user who owns the portfolio
 * @param performanceResult - The performance result containing portfolio metrics and S&P 500 comparison
 */
export const setBeatsSP500 = async (
  portfolioId: string,
  userId: string,
  performanceResult: PerformanceResult,
) => {
  const currentPortfolioPerformance = await db
    .select()
    .from(savedPortfolios)
    .where(
      and(
        eq(savedPortfolios.id, portfolioId),
        eq(savedPortfolios.userId, userId),
      ),
    )
    .execute();

  const newPortfolioPerformance = {
    date: new Date(),
    totalReturn: performanceResult.portfolio.totalReturn,
    sharpeRatio: performanceResult.portfolio.sharpeRatio,
    maxDrawdown: performanceResult.portfolio.maxDrawdown,
    startDate: performanceResult.startingDate,
    endDate: performanceResult.endingDate,
    beatsSP500: performanceResult.beatsBenchmark,
  };

  let portfolioPerformance = [];
  if (currentPortfolioPerformance[0].performance) {
    portfolioPerformance = [
      ...currentPortfolioPerformance[0].performance,
      newPortfolioPerformance,
    ];
  } else {
    portfolioPerformance = [newPortfolioPerformance];
  }

  await db
    .update(savedPortfolios)
    .set({ performance: portfolioPerformance })
    .where(
      and(
        eq(savedPortfolios.id, portfolioId),
        eq(savedPortfolios.userId, userId),
      ),
    )
    .execute();
};
