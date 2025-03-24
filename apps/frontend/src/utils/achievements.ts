import { ACHIEVEMENTS } from "@/data/achievements";
import { SavedPortfolios } from "@/schemas/portfolio.schema";

interface GetXPFromAchievementsProps {
  numberOfSavedPortfolios: number;
  numberOfStocks: number;
  numberOfSimulations: number;
  savedPortfolios: SavedPortfolios;
}

/**
 * Calculates the total experience points (XP) earned from user achievements based on portfolio-related activities.
 * Achievements may include saving portfolios, adding stocks, or running simulations.
 *
 * @param props - Object containing achievement-related data
 * @param props.numberOfSavedPortfolios - Number of portfolios saved by the user
 * @param props.numberOfStocks - Total number of stocks across all portfolios
 * @param props.numberOfSimulations - Number of simulations run by the user
 * @param props.savedPortfolios - Array of saved portfolio objects with performance data
 * @returns Total XP earned from all achievements
 */
export const getXPFromAchievements = ({
  numberOfSavedPortfolios,
  numberOfStocks,
  numberOfSimulations,
  savedPortfolios,
}: GetXPFromAchievementsProps): number => {
  return ACHIEVEMENTS.reduce((total, achievement) => {
    let xp = total;
    switch (achievement.slug) {
      case "first-steps":
        xp = achievement.condition(numberOfSavedPortfolios)
          ? total + achievement.xpReward
          : total;
        break;
      case "stock-collector":
        xp = achievement.condition(numberOfStocks)
          ? total + achievement.xpReward
          : total;
        break;
      case "first-simulation":
        xp = achievement.condition(numberOfSimulations)
          ? total + achievement.xpReward
          : total;
        break;
      case "market-beater":
        xp = achievement.condition(savedPortfolios)
          ? total + achievement.xpReward
          : total;
        break;
    }
    return xp;
  }, 0);
};
