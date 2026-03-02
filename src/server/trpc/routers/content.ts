import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import { instagramPosts, postInsightSnapshots, conversionEvents } from "../../db/schema";
import { and, eq, gte, lte, count, sql, desc, asc } from "drizzle-orm";
import {
  isMockAccount,
  getMockContentPosts,
  getMockContentSummary,
  getMockScatterData,
  getMockEngagementByType,
  getMockPostingTimeHeatmap,
} from "../../mock-data";

export const contentRouter = createTRPCRouter({
  getSummary: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockContentSummary();
      return getMockContentSummary();
    }),

  getPosts: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
        sortBy: z.enum(["publishedAt", "reach", "engagementRate", "saves", "shares", "leadsPerKReach", "leads"]).default("leadsPerKReach"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        contentType: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to, sortBy, sortOrder, contentType, limit, offset } = input;
      if (isMockAccount(accountId)) {
        let posts = getMockContentPosts();
        if (contentType) posts = posts.filter((p) => p.contentType === contentType);
        const sortFn = (a: Record<string, unknown>, b: Record<string, unknown>) => {
          const aVal = (a[sortBy] ?? 0) as number;
          const bVal = (b[sortBy] ?? 0) as number;
          return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
        };
        posts.sort(sortFn as (a: typeof posts[0], b: typeof posts[0]) => number);
        return posts.slice(offset, offset + limit);
      }

      const conditions = [
        eq(instagramPosts.accountId, accountId),
        gte(instagramPosts.publishedAt, new Date(from)),
        lte(instagramPosts.publishedAt, new Date(to)),
      ];

      if (contentType) {
        conditions.push(eq(instagramPosts.contentType, contentType));
      }

      const posts = await ctx.db
        .select({
          id: instagramPosts.id,
          instagramMediaId: instagramPosts.instagramMediaId,
          contentType: instagramPosts.contentType,
          caption: instagramPosts.caption,
          thumbnailUrl: instagramPosts.thumbnailUrl,
          permalink: instagramPosts.permalink,
          publishedAt: instagramPosts.publishedAt,
          reach: sql<number>`coalesce(max(${postInsightSnapshots.reach}), 0)`,
          impressions: sql<number>`coalesce(max(${postInsightSnapshots.impressions}), 0)`,
          engagement: sql<number>`coalesce(max(${postInsightSnapshots.engagement}), 0)`,
          likes: sql<number>`coalesce(max(${postInsightSnapshots.likes}), 0)`,
          comments: sql<number>`coalesce(max(${postInsightSnapshots.comments}), 0)`,
          shares: sql<number>`coalesce(max(${postInsightSnapshots.shares}), 0)`,
          saves: sql<number>`coalesce(max(${postInsightSnapshots.saves}), 0)`,
          engagementRate: sql<number>`coalesce(max(${postInsightSnapshots.engagementRate}), 0)`,
        })
        .from(instagramPosts)
        .leftJoin(postInsightSnapshots, eq(instagramPosts.id, postInsightSnapshots.postId))
        .where(and(...conditions))
        .groupBy(instagramPosts.id)
        .orderBy(
          sortOrder === "desc"
            ? desc(
                sortBy === "publishedAt"
                  ? instagramPosts.publishedAt
                  : sql`max(${sortBy === "reach" ? postInsightSnapshots.reach : sortBy === "engagementRate" ? postInsightSnapshots.engagementRate : sortBy === "saves" ? postInsightSnapshots.saves : postInsightSnapshots.shares})`
              )
            : asc(
                sortBy === "publishedAt"
                  ? instagramPosts.publishedAt
                  : sql`max(${sortBy === "reach" ? postInsightSnapshots.reach : sortBy === "engagementRate" ? postInsightSnapshots.engagementRate : sortBy === "saves" ? postInsightSnapshots.saves : postInsightSnapshots.shares})`
              )
        )
        .limit(limit)
        .offset(offset);

      return posts.map((p) => ({
        ...p,
        leads: 0,
        leadsPerKReach: 0,
        automationCoverage: 0,
      }));
    }),

  getScatterData: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockScatterData();

      const data = await ctx.db
        .select({
          id: instagramPosts.id,
          contentType: instagramPosts.contentType,
          reach: sql<number>`coalesce(max(${postInsightSnapshots.reach}), 0)`,
          engagementRate: sql<number>`coalesce(max(${postInsightSnapshots.engagementRate}), 0)`,
          dmConversions: sql<number>`count(distinct ${conversionEvents.id})`,
        })
        .from(instagramPosts)
        .leftJoin(postInsightSnapshots, eq(instagramPosts.id, postInsightSnapshots.postId))
        .leftJoin(
          conversionEvents,
          sql`${conversionEvents.metadata}::jsonb->>'postId' = ${instagramPosts.id}::text`
        )
        .where(
          and(
            eq(instagramPosts.accountId, accountId),
            gte(instagramPosts.publishedAt, new Date(from)),
            lte(instagramPosts.publishedAt, new Date(to))
          )
        )
        .groupBy(instagramPosts.id);

      return data;
    }),

  getEngagementByType: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockEngagementByType();

      const byType = await ctx.db
        .select({
          contentType: instagramPosts.contentType,
          avgEngagementRate: sql<number>`avg(${postInsightSnapshots.engagementRate})`,
          avgReach: sql<number>`avg(${postInsightSnapshots.reach})`,
          postCount: count(),
        })
        .from(instagramPosts)
        .leftJoin(postInsightSnapshots, eq(instagramPosts.id, postInsightSnapshots.postId))
        .where(
          and(
            eq(instagramPosts.accountId, accountId),
            gte(instagramPosts.publishedAt, new Date(from)),
            lte(instagramPosts.publishedAt, new Date(to))
          )
        )
        .groupBy(instagramPosts.contentType);

      return byType;
    }),

  getPostingTimeHeatmap: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockPostingTimeHeatmap();

      const heatmapData = await ctx.db
        .select({
          dayOfWeek: sql<number>`extract(dow from ${instagramPosts.publishedAt})`,
          hour: sql<number>`extract(hour from ${instagramPosts.publishedAt})`,
          avgEngagementRate: sql<number>`avg(${postInsightSnapshots.engagementRate})`,
          postCount: count(),
        })
        .from(instagramPosts)
        .leftJoin(postInsightSnapshots, eq(instagramPosts.id, postInsightSnapshots.postId))
        .where(
          and(
            eq(instagramPosts.accountId, accountId),
            gte(instagramPosts.publishedAt, new Date(from)),
            lte(instagramPosts.publishedAt, new Date(to))
          )
        )
        .groupBy(
          sql`extract(dow from ${instagramPosts.publishedAt})`,
          sql`extract(hour from ${instagramPosts.publishedAt})`
        );

      return heatmapData;
    }),
});
