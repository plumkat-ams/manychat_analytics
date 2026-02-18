import { pgTable, text, timestamp, uuid, integer, real, boolean, index } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { flows } from "./flows";

export const conversionGoals = pgTable("conversion_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .references(() => accounts.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  targetValue: real("target_value"),
  targetCount: integer("target_count"),
  period: text("period").default("monthly"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversionEvents = pgTable(
  "conversion_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    goalId: uuid("goal_id").references(() => conversionGoals.id),
    flowId: uuid("flow_id").references(() => flows.id),
    subscriberId: text("subscriber_id"),
    eventName: text("event_name").notNull(),
    revenue: real("revenue").default(0),
    currency: text("currency").default("USD"),
    metadata: text("metadata"), // JSON string
    convertedAt: timestamp("converted_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("conversion_events_account_idx").on(table.accountId),
    goalIdx: index("conversion_events_goal_idx").on(table.goalId),
    flowIdx: index("conversion_events_flow_idx").on(table.flowId),
    convertedAtIdx: index("conversion_events_converted_at_idx").on(table.convertedAt),
  })
);

export type ConversionGoal = typeof conversionGoals.$inferSelect;
export type NewConversionGoal = typeof conversionGoals.$inferInsert;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type NewConversionEvent = typeof conversionEvents.$inferInsert;
