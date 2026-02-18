import { db } from "../../db";
import {
  subscribers,
  messageEvents,
  conversionEvents,
  instagramInsightSnapshots,
} from "../../db/schema";
import { and, eq, gte, lte, count, sql } from "drizzle-orm";

type MetricsSummary = {
  totalSubscribers: number;
  activeSubscribers: number;
  totalReach: number;
  totalConversions: number;
  totalRevenue: number;
  messagesSent: number;
  messagesOpened: number;
  openRate: number;
  conversionRate: number;
};

export async function computeMetricsSummary(
  accountId: string,
  from: Date,
  to: Date
): Promise<MetricsSummary> {
  const [totalSubs] = await db
    .select({ count: count() })
    .from(subscribers)
    .where(and(eq(subscribers.accountId, accountId), eq(subscribers.isSubscribed, true)));

  const [activeSubs] = await db
    .select({ count: count() })
    .from(subscribers)
    .where(
      and(
        eq(subscribers.accountId, accountId),
        eq(subscribers.isSubscribed, true),
        gte(subscribers.lastInteractionAt, from)
      )
    );

  const [reach] = await db
    .select({ total: sql<number>`coalesce(sum(${instagramInsightSnapshots.reach}), 0)` })
    .from(instagramInsightSnapshots)
    .where(
      and(
        eq(instagramInsightSnapshots.accountId, accountId),
        gte(instagramInsightSnapshots.snapshotDate, from),
        lte(instagramInsightSnapshots.snapshotDate, to)
      )
    );

  const messageStats = await db
    .select({
      eventType: messageEvents.eventType,
      count: count(),
    })
    .from(messageEvents)
    .where(
      and(
        eq(messageEvents.accountId, accountId),
        gte(messageEvents.occurredAt, from),
        lte(messageEvents.occurredAt, to)
      )
    )
    .groupBy(messageEvents.eventType);

  const sent = messageStats.find((m) => m.eventType === "sent")?.count ?? 0;
  const opened = messageStats.find((m) => m.eventType === "opened")?.count ?? 0;

  const [conversionData] = await db
    .select({
      count: count(),
      revenue: sql<number>`coalesce(sum(${conversionEvents.revenue}), 0)`,
    })
    .from(conversionEvents)
    .where(
      and(
        eq(conversionEvents.accountId, accountId),
        gte(conversionEvents.convertedAt, from),
        lte(conversionEvents.convertedAt, to)
      )
    );

  return {
    totalSubscribers: totalSubs.count,
    activeSubscribers: activeSubs.count,
    totalReach: reach.total,
    totalConversions: conversionData.count,
    totalRevenue: conversionData.revenue,
    messagesSent: sent,
    messagesOpened: opened,
    openRate: sent > 0 ? (opened / sent) * 100 : 0,
    conversionRate: totalSubs.count > 0 ? (conversionData.count / totalSubs.count) * 100 : 0,
  };
}
