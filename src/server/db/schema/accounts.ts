import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  manychatPageId: text("manychat_page_id"),
  manychatApiToken: text("manychat_api_token"),
  instagramAccountId: text("instagram_account_id"),
  instagramAccessToken: text("instagram_access_token"),
  instagramTokenExpiresAt: timestamp("instagram_token_expires_at"),
  instagramUsername: text("instagram_username"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
