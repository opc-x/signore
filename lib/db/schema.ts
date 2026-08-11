import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const appMeta = pgTable("app_meta", {
  id: text("id").primaryKey().default("default"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
