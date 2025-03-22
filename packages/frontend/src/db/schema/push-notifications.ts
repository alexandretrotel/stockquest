import { sql } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const pushNotificationSubscriptions = pgTable(
  "push_notification_subscriptions",
  {
    id: text("uuid")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    subscription: jsonb("subscription").notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
);
