import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import {
  subscribers,
  messageEvents,
  conversionEvents,
  flows,
  instagramInsightSnapshots,
  instagramPosts,
  postInsightSnapshots,
  conversionGoals,
} from "../../db/schema";
import { and, eq, gte, lte, count, sql, desc } from "drizzle-orm";
import {
  isMockAccount,
  getMockComparePeriods,
  getMockContentTypeComparison,
  getMockGoalProgress,
  getMockDailyEngagement,
} from "../../mock-data";

export const comparisonRouter = createTRPCRouter({
  comparePeriods: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        periodA: z.object({ from: z.string().datetime(), to: z.string().datetime() }),
        periodB: z.object({ from: z.string().datetime(), to: z.string().datetime() }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, periodA, periodB } = input;
      if (isMockAccount(accountId)) return getMockComparePeriods();

      async function getMetricsForPeriod(from: string, to: string) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const [subs] = await ctx.db
          .select({ count: count() })
          .from(subscribers)
          .where(
            and(
              eq(subscribers.accountId, accountId),
              gte(subscribers.subscribedAt, fromDate),
              lte(subscribers.subscribedAt, toDate)
            )
          );

        const [messages] = await ctx.db
          .select({
            sent: sql<number>`count(case when ${messageEvents.eventType} = 'sent' then 1 end)`,
            opened: sql<number>`count(case when ${messageEvents.eventType} = 'opened' then 1 end)`,
          })
          .from(messageEvents)
          .where(
            and(
              eq(messageEvents.accountId, accountId),
              gte(messageEvents.occurredAt, fromDate),
              lte(messageEvents.occurredAt, toDate)
            )
          );

        const [conversions] = await ctx.db
          .select({
            count: count(),
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

        const [igMetrics] = await ctx.db
          .select({
            reach: sql<number>`coalesce(sum(${instagramInsightSnapshots.reach}), 0)`,
            impressions: sql<number>`coalesce(sum(${instagramInsightSnapshots.impressions}), 0)`,
          })
          .from(instagramInsightSnapshots)
          .where(
            and(
              eq(instagramInsightSnapshots.accountId, accountId),
              gte(instagramInsightSnapshots.snapshotDate, fromDate),
              lte(instagramInsightSnapshots.snapshotDate, toDate)
            )
          );

        return {
          newSubscribers: subs.count,
          messagesSent: messages.sent,
          messagesOpened: messages.opened,
          openRate: messages.sent > 0 ? (messages.opened / messages.sent) * 100 : 0,
          conversions: conversions.count,
          revenue: conversions.revenue,
          igReach: igMetrics.reach,
          igImpressions: igMetrics.impressions,
        };
      }

      const [metricsA, metricsB] = await Promise.all([
        getMetricsForPeriod(periodA.from, periodA.to),
        getMetricsForPeriod(periodB.from, periodB.to),
      ]);

      return { periodA: metricsA, periodB: metricsB };
    }),

  compareFlows: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        flowIdA: z.string().uuid(),
        flowIdB: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { flowIdA, flowIdB, from, to } = input;
      const fromDate = new Date(from);
      const toDate = new Date(to);

      async function getFlowMetrics(flowId: string) {
        const [flow] = await ctx.db.select().from(flows).where(eq(flows.id, flowId));

        const [messages] = await ctx.db
          .select({
            sent: sql<number>`count(case when ${messageEvents.eventType} = 'sent' then 1 end)`,
            opened: sql<number>`count(case when ${messageEvents.eventType} = 'opened' then 1 end)`,
            clicked: sql<number>`count(case when ${messageEvents.eventType} = 'clicked' then 1 end)`,
            replied: sql<number>`count(case when ${messageEvents.eventType} = 'replied' then 1 end)`,
          })
          .from(messageEvents)
          .where(
            and(
              eq(messageEvents.flowId, flowId),
              gte(messageEvents.occurredAt, fromDate),
              lte(messageEvents.occurredAt, toDate)
            )
          );

        const [conversions] = await ctx.db
          .select({
            count: count(),
            revenue: sql<number>`coalesce(sum(${conversionEvents.revenue}), 0)`,
          })
          .from(conversionEvents)
          .where(
            and(
              eq(conversionEvents.flowId, flowId),
              gte(conversionEvents.convertedAt, fromDate),
              lte(conversionEvents.convertedAt, toDate)
            )
          );

        return {
          name: flow?.name ?? "Unknown",
          sent: messages.sent,
          opened: messages.opened,
          clicked: messages.clicked,
          replied: messages.replied,
          openRate: messages.sent > 0 ? (messages.opened / messages.sent) * 100 : 0,
          clickRate: messages.opened > 0 ? (messages.clicked / messages.opened) * 100 : 0,
          conversions: conversions.count,
          revenue: conversions.revenue,
        };
      }

      const [flowA, flowB] = await Promise.all([getFlowMetrics(flowIdA), getFlowMetrics(flowIdB)]);

      return { flowA, flowB };
    }),

  getContentTypeComparison: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockContentTypeComparison();

      const comparison = await ctx.db
        .select({
          contentType: instagramPosts.contentType,
          avgReach: sql<number>`avg(${postInsightSnapshots.reach})`,
          avgEngagement: sql<number>`avg(${postInsightSnapshots.engagementRate})`,
          avgSaves: sql<number>`avg(${postInsightSnapshots.saves})`,
          avgShares: sql<number>`avg(${postInsightSnapshots.shares})`,
          avgComments: sql<number>`avg(${postInsightSnapshots.comments})`,
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

      return comparison;
    }),

  getGoalProgress: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (isMockAccount(input.accountId)) return getMockGoalProgress();
      const goals = await ctx.db
        .select()
        .from(conversionGoals)
        .where(and(eq(conversionGoals.accountId, input.accountId), eq(conversionGoals.isActive, true)));

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const progress = await Promise.all(
        goals.map(async (goal) => {
          const [result] = await ctx.db
            .select({
              count: count(),
              revenue: sql<number>`coalesce(sum(${conversionEvents.revenue}), 0)`,
            })
            .from(conversionEvents)
            .where(
              and(
                eq(conversionEvents.accountId, input.accountId),
                eq(conversionEvents.goalId, goal.id),
                gte(conversionEvents.convertedAt, startOfMonth),
                lte(conversionEvents.convertedAt, now)
              )
            );

          const daysElapsed = Math.ceil((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24));
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          const dailyRate = daysElapsed > 0 ? result.count / daysElapsed : 0;
          const projected = Math.round(dailyRate * daysInMonth);

          return {
            goalId: goal.id,
            goalName: goal.name,
            target: goal.targetCount ?? 0,
            current: result.count,
            revenue: result.revenue,
            projected,
          };
        })
      );

      return progress;
    }),

  getDailyEngagement: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accountId, from, to } = input;
      if (isMockAccount(accountId)) return getMockDailyEngagement();

      const daily = await ctx.db
        .select({
          date: sql<string>`date_trunc('day', ${messageEvents.occurredAt})::date`,
          count: count(),
        })
        .from(messageEvents)
        .where(
          and(
            eq(messageEvents.accountId, accountId),
            gte(messageEvents.occurredAt, new Date(from)),
            lte(messageEvents.occurredAt, new Date(to))
          )
        )
        .groupBy(sql`date_trunc('day', ${messageEvents.occurredAt})::date`)
        .orderBy(sql`date_trunc('day', ${messageEvents.occurredAt})::date`);

      return daily;
    }),
});
