import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const savedPortfolios = pgTable("saved_portfolios", {
  id: text("uuid")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  allocations: jsonb("allocations")
    .$type<{ symbol: string; weight: number }[]>()
    .notNull(),
  performance: jsonb("performance").$type<
    {
      date: Date;
      totalReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      startDate: Date;
      endDate: Date;
      beatsSP500: boolean;
    }[]
  >(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const simulationLogs = pgTable("simulation_logs", {
  id: text("uuid")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});
