import { pgTable, text, timestamp, uuid, integer, boolean, index } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    manychatSubscriberId: text("manychat_subscriber_id").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    name: text("name"),
    gender: text("gender"),
    profilePicUrl: text("profile_pic_url"),
    locale: text("locale"),
    timezone: text("timezone"),
    city: text("city"),
    country: text("country"),
    language: text("language"),
    acquisitionSource: text("acquisition_source").notNull().default("other"),
    isSubscribed: boolean("is_subscribed").default(true).notNull(),
    subscribedAt: timestamp("subscribed_at"),
    unsubscribedAt: timestamp("unsubscribed_at"),
    lastInteractionAt: timestamp("last_interaction_at"),
    engagementScore: integer("engagement_score").default(0),
    tags: text("tags").array(),
    customFields: text("custom_fields"), // JSON string
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("subscribers_account_idx").on(table.accountId),
    manychatIdIdx: index("subscribers_manychat_id_idx").on(table.manychatSubscriberId),
    sourceIdx: index("subscribers_source_idx").on(table.acquisitionSource),
    subscribedAtIdx: index("subscribers_subscribed_at_idx").on(table.subscribedAt),
  })
);

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
