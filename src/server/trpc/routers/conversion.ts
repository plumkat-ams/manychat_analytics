import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import {
  conversionEvents,
  conversionGoals,
  flows,
  subscribers,
  instagramInsightSnapshots,
} from "../../db/schema";
import { and, eq, gte, lte, count, sql, desc, sum } from "drizzle-orm";
import {
  isMockAccount,
  getMockConversionMetrics,
  getMockJourneyFunnel,
  getMockRevenueByFlow,
  getMockTimeToConversion,
} from "../../mock-data";

export const conversionRouter = createTRPCRouter({
  getMetrics: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockConversionMetrics();
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const periodDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      const prevFrom = new Date(fromDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // Current period
      const [current] = await ctx.db
        .select({
          conversions: count(),
          revenue: sql<number>`coalesce(sum(${conversionEvents.revenue}), 0)`,
        })
        .from(conversionEvents)
        .where(
          and(
            eq(conversionEvents.accountId, accountId),
            gte(conversionEvents.convertedAt, fromDate),
            lte(conversionEvents.convertedAt, toDate)
          )
        );

      // Previous period
      const [previous] = await ctx.db
        .select({
          conversions: count(),
          revenue: sql<number>`coalesce(sum(${conversionEvents.revenue}), 0)`,
        })
        .from(conversionEvents)
        .where(
          and(
            eq(conversionEvents.accountId, accountId),
            gte(conversionEvents.convertedAt, prevFrom),
            lte(conversionEvents.convertedAt, fromDate)
          )
        );

      // Total subscribers in period for conversion rate
      const [subCount] = await ctx.db
        .select({ count: count() })
        .from(subscribers)
        .where(
          and(
            eq(subscribers.accountId, accountId),
            gte(subscribers.subscribedAt, fromDate),
            lte(subscribers.subscribedAt, toDate)
          )
        );

      const conversionRate = subCount.count > 0 ? (current.conversions / subCount.count) * 100 : 0;

      return {
        conversions: { current: current.conversions, previous: previous.conversions },
        revenue: { current: current.revenue, previous: previous.revenue },
        conversionRate,
        cac: current.conversions > 0 ? current.revenue / current.conversions : 0,
      };
    }),

  getJourneyFunnel: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockJourneyFunnel();
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // IG Impressions
      const [impressions] = await ctx.db
        .select({ total: sql<number>`coalesce(sum(${instagramInsightSnapshots.impressions}), 0)` })
        .from(instagramInsightSnapshots)
        .where(
          and(
            eq(instagramInsightSnapshots.accountId, accountId),
            gte(instagramInsightSnapshots.snapshotDate, fromDate),
            lte(instagramInsightSnapshots.snapshotDate, toDate)
          )
        );

      // New followers
      const [newFollowers] = await ctx.db
        .select({ total: sql<number>`coalesce(sum(${instagramInsightSnapshots.newFollowers}), 0)` })
        .from(instagramInsightSnapshots)
        .where(
          and(
            eq(instagramInsightSnapshots.accountId, accountId),
            gte(instagramInsightSnapshots.snapshotDate, fromDate),
            lte(instagramInsightSnapshots.snapshotDate, toDate)
          )
        );

      // DM subscribers
      const [dmSubs] = await ctx.db
        .select({ count: count() })
        .from(subscribers)
        .where(
          and(
            eq(subscribers.accountId, accountId),
            gte(subscribers.subscribedAt, fromDate),
            lte(subscribers.subscribedAt, toDate),
            sql`${subscribers.acquisitionSource} LIKE '%instagram%'`
          )
        );

      // Total new subscribers
      const [totalSubs] = await ctx.db
        .select({ count: count() })
        .from(subscribers)
        .where(
          and(
            eq(subscribers.accountId, accountId),
            gte(subscribers.subscribedAt, fromDate),
            lte(subscribers.subscribedAt, toDate)
          )
        );

      // Conversions
      const [conversions] = await ctx.db
        .select({ count: count() })
        .from(conversionEvents)
        .where(
          and(
            eq(conversionEvents.accountId, accountId),
            gte(conversionEvents.convertedAt, fromDate),
            lte(conversionEvents.convertedAt, toDate)
          )
        );

      const funnel = [
        { stage: "IG Impressions", count: impressions.total },
        { stage: "New Followers", count: newFollowers.total },
        { stage: "DM Subscribers", count: dmSubs.count },
        { stage: "Total Subscribers", count: totalSubs.count },
        { stage: "Conversions", count: conversions.count },
      ];

      return funnel.map((stage, i) => ({
        ...stage,
        rate: i === 0 ? 100 : funnel[i - 1].count > 0 ? (stage.count / funnel[i - 1].count) * 100 : 0,
      }));
    }),

  getRevenueByFlow: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to, limit } = input;
      if (isMockAccount(accountId)) return getMockRevenueByFlow().slice(0, limit);

      const revenueData = await ctx.db
        .select({
          flowId: flows.id,
          flowName: flows.name,
          conversions: count(),
          revenue: sql<number>`coalesce(sum(${conversionEvents.revenue}), 0)`,
        })
        .from(conversionEvents)
        .innerJoin(flows, eq(conversionEvents.flowId, flows.id))
        .where(
          and(
            eq(conversionEvents.accountId, accountId),
            gte(conversionEvents.convertedAt, new Date(from)),
            lte(conversionEvents.convertedAt, new Date(to))
          )
        )
        .groupBy(flows.id)
        .orderBy(desc(sql`coalesce(sum(${conversionEvents.revenue}), 0)`))
        .limit(limit);

      const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
      return revenueData.map((r) => ({
        ...r,
        percentage: totalRevenue > 0 ? (r.revenue / totalRevenue) * 100 : 0,
      }));
    }),

  getTimeToConversion: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockTimeToConversion();

      const ttc = await ctx.db.execute(sql`
        SELECT
          CASE
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 3600 < 1 THEN '< 1h'
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 3600 < 24 THEN '1-24h'
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 86400 < 7 THEN '1-7 days'
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 86400 < 30 THEN '7-30 days'
            ELSE '30+ days'
          END as bucket,
          count(*) as count
        FROM conversion_events ce
        JOIN subscribers s ON ce.subscriber_id = s.manychat_subscriber_id AND ce.account_id = s.account_id
        WHERE ce.account_id = ${accountId}
          AND ce.converted_at >= ${new Date(from)}
          AND ce.converted_at <= ${new Date(to)}
        GROUP BY 1
        ORDER BY
          CASE
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 3600 < 1 THEN 1
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 3600 < 24 THEN 2
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 86400 < 7 THEN 3
            WHEN EXTRACT(EPOCH FROM (ce.converted_at - s.subscribed_at)) / 86400 < 30 THEN 4
            ELSE 5
          END
      `);

      return ttc as Array<{ bucket: string; count: number }>;
    }),
});
