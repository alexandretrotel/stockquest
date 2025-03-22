import { Achievements, Categories } from "@/schemas/achievements.schema";
import { SavedPortfolios } from "@/schemas/portfolio.schema";
import { atLeastOnePortfolioBeatsSP500 } from "@/utils/portfolio";
import { Star, TrendingUp, CheckCircle2, Trophy } from "lucide-react";

export const CATEGORIES: Categories = [
  { id: "beginner", name: "Beginner", icon: Star },
  {
    id: "trading",
    name: "Trading Pro",
    icon: TrendingUp,
  },
];

export const ACHIEVEMENTS: Achievements = [
  {
    slug: "first-steps",
    category: "beginner",
    title: "First Steps",
    description: "Save your first portfolio",
    icon: CheckCircle2,
    maxProgress: 1,
    xpReward: 50,
    condition: (numberOfSavedPortfolios: number) => numberOfSavedPortfolios > 0,
  },
  {
    slug: "stock-collector",
    category: "beginner",
    title: "Stock Collector",
    description: "Add 10 different stocks to your saved portfolios",
    icon: TrendingUp,
    maxProgress: 10,
    xpReward: 100,
    condition: (numberOfStocks: number) => numberOfStocks >= 10,
  },
  {
    slug: "first-simulation",
    category: "trading",
    title: "First simulation",
    description: "Run your first portfolio simulation",
    icon: TrendingUp,
    maxProgress: 1,
    xpReward: 100,
    condition: (numberOfPerformances: number) => numberOfPerformances > 0,
  },
  {
    slug: "market-beater",
    category: "trading",
    title: "Market Beater",
    description: "Create a portfolio that beats the S&P 500 in a simulation",
    icon: Trophy,
    maxProgress: 1,
    xpReward: 300,
    condition: (savedPortfolios: SavedPortfolios) =>
      atLeastOnePortfolioBeatsSP500(savedPortfolios),
  },
];
