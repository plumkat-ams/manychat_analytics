import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { flows } from "./flows";

export const messageEvents = pgTable(
  "message_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    flowId: uuid("flow_id").references(() => flows.id),
    subscriberId: text("subscriber_id").notNull(),
    eventType: text("event_type").notNull(), // 'sent', 'delivered', 'opened', 'clicked', 'replied'
    messageId: text("message_id"),
    stepName: text("step_name"),
    metadata: text("metadata"), // JSON string for additional data
    occurredAt: timestamp("occurred_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("message_events_account_idx").on(table.accountId),
    flowIdx: index("message_events_flow_idx").on(table.flowId),
    eventTypeIdx: index("message_events_event_type_idx").on(table.eventType),
    occurredAtIdx: index("message_events_occurred_at_idx").on(table.occurredAt),
  })
);

export type MessageEvent = typeof messageEvents.$inferSelect;
export type NewMessageEvent = typeof messageEvents.$inferInsert;
