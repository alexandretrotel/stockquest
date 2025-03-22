export type ChartInterval =
  | "1m"
  | "2m"
  | "5m"
  | "15m"
  | "30m"
  | "60m"
  | "90m"
  | "1h"
  | "1d"
  | "5d"
  | "1wk"
  | "1mo"
  | "3mo";

/**
 * Determines the appropriate chart interval based on the time difference between a starting date and the current date.
 * Returns a daily interval ("1d") for periods up to 2 years, and a weekly interval ("1wk") for longer periods.
 *
 * @param startingDate - The starting date for the chart period
 * @returns The chart interval, either "1d" (daily) or "1wk" (weekly)
 */
export const getChartInterval = (startingDate: Date): ChartInterval => {
  const now = new Date();
  const diffInDays =
    (now.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays <= 365 * 2) return "1d";

  return "1wk";
};
