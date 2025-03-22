"use server";

import { db } from "@/db";
import { savedPortfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SavedPortfolios } from "@/schemas/portfolio.schema";
import { MOST_PROFITABLE_PORTFOLIOS_NUMBER } from "@/data/settings";

/**
 * Retrieves all saved portfolios for a user from the database, sorted by performance.
 * Orders portfolios in descending order based on the total return of their latest performance record,
 * with portfolios lacking performance defaulting to a return of 0.
 *
 * @param userId - The ID of the user whose saved portfolios are being retrieved
 * @returns A promise resolving to an array of the user’s saved portfolios, sorted by total return
 */
export const getSavedPortfolios = async (
  userId: string,
): Promise<SavedPortfolios> => {
  const portfolios = await db
    .select()
    .from(savedPortfolios)
    .where(eq(savedPortfolios.userId, userId))
    .execute();

  const sortedPortfolios = portfolios.sort((a, b) => {
    const getTotalReturn = (portfolio: (typeof portfolios)[number]) => {
      const lastPerformance = portfolio?.performance?.at(-1);
      return lastPerformance?.totalReturn ?? 0;
    };

    const aReturn = getTotalReturn(a);
    const bReturn = getTotalReturn(b);

    return bReturn - aReturn;
  });

  return sortedPortfolios;
};

/**
 * Retrieves the most profitable portfolio for a user from the database.
 * The most profitable portfolio is the one with the highest total return in its latest performance record.
 *
 * @returns A promise resolving to the most profitable portfolio for the user
 */
export const getMostProfitablePortfolios =
  async (): Promise<SavedPortfolios> => {
    const portfolios = await db.select().from(savedPortfolios).execute();

    const sortedPortfolios = portfolios.sort((a, b) => {
      const getTotalReturn = (portfolio: (typeof portfolios)[number]) => {
        const lastPerformance = portfolio?.performance?.at(-1);
        return lastPerformance?.totalReturn ?? 0;
      };

      const aReturn = getTotalReturn(a);
      const bReturn = getTotalReturn(b);

      return bReturn - aReturn;
    });

    const mostProfitablePortfolios = sortedPortfolios.slice(
      0,
      MOST_PROFITABLE_PORTFOLIOS_NUMBER,
    );

    return mostProfitablePortfolios;
  };
