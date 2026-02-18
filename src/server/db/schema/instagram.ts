import { pgTable, text, timestamp, uuid, integer, real, index } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

export const instagramPosts = pgTable(
  "instagram_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    instagramMediaId: text("instagram_media_id").notNull(),
    contentType: text("content_type").notNull(), // IMAGE, VIDEO, CAROUSEL_ALBUM, REEL, STORY
    caption: text("caption"),
    permalink: text("permalink"),
    thumbnailUrl: text("thumbnail_url"),
    publishedAt: timestamp("published_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("ig_posts_account_idx").on(table.accountId),
    mediaIdIdx: index("ig_posts_media_id_idx").on(table.instagramMediaId),
    publishedAtIdx: index("ig_posts_published_at_idx").on(table.publishedAt),
  })
);

export const postInsightSnapshots = pgTable(
  "post_insight_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .references(() => instagramPosts.id)
      .notNull(),
    snapshotDate: timestamp("snapshot_date").notNull(),
    reach: integer("reach").default(0),
    impressions: integer("impressions").default(0),
    engagement: integer("engagement").default(0),
    likes: integer("likes").default(0),
    comments: integer("comments").default(0),
    shares: integer("shares").default(0),
    saves: integer("saves").default(0),
    videoViews: integer("video_views"),
    engagementRate: real("engagement_rate"),
    saveRate: real("save_rate"),
    shareRate: real("share_rate"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdx: index("post_insights_post_idx").on(table.postId),
    dateIdx: index("post_insights_date_idx").on(table.snapshotDate),
  })
);

export const instagramInsightSnapshots = pgTable(
  "instagram_insight_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    snapshotDate: timestamp("snapshot_date").notNull(),
    followersCount: integer("followers_count").default(0),
    followsCount: integer("follows_count").default(0),
    reach: integer("reach").default(0),
    impressions: integer("impressions").default(0),
    profileViews: integer("profile_views").default(0),
    websiteClicks: integer("website_clicks").default(0),
    emailClicks: integer("email_clicks").default(0),
    newFollowers: integer("new_followers").default(0),
    unfollows: integer("unfollows").default(0),
    audienceGenderAge: text("audience_gender_age"), // JSON
    audienceCity: text("audience_city"), // JSON
    audienceCountry: text("audience_country"), // JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("ig_insights_account_idx").on(table.accountId),
    dateIdx: index("ig_insights_date_idx").on(table.snapshotDate),
  })
);

export type InstagramPost = typeof instagramPosts.$inferSelect;
export type NewInstagramPost = typeof instagramPosts.$inferInsert;
export type PostInsightSnapshot = typeof postInsightSnapshots.$inferSelect;
export type NewPostInsightSnapshot = typeof postInsightSnapshots.$inferInsert;
export type InstagramInsightSnapshot = typeof instagramInsightSnapshots.$inferSelect;
export type NewInstagramInsightSnapshot = typeof instagramInsightSnapshots.$inferInsert;
