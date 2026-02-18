import { db } from "../../db";
import {
  instagramPosts,
  postInsightSnapshots,
  instagramInsightSnapshots,
  syncJobs,
} from "../../db/schema";
import { InstagramClient } from "../instagram-client";
import { eq } from "drizzle-orm";

export async function syncInstagramPosts(
  accountId: string,
  accessToken: string,
  instagramAccountId: string
) {
  const client = new InstagramClient(accessToken, accountId, instagramAccountId);

  const [job] = await db
    .insert(syncJobs)
    .values({
      accountId,
      jobType: "instagram_posts",
      status: "running",
      startedAt: new Date(),
    })
    .returning();

  let processed = 0;

  try {
    let after: string | undefined;

    while (true) {
      const mediaResult = await client.getMedia(50, after);
      if (!mediaResult.data || mediaResult.data.length === 0) break;

      for (const media of mediaResult.data) {
        // Upsert post
        const [post] = await db
          .insert(instagramPosts)
          .values({
            accountId,
            instagramMediaId: media.id,
            contentType: media.media_type,
            caption: media.caption ?? null,
            permalink: media.permalink,
            thumbnailUrl: media.thumbnail_url ?? media.media_url,
            publishedAt: new Date(media.timestamp),
          })
          .onConflictDoUpdate({
            target: [instagramPosts.instagramMediaId],
            set: {
              caption: media.caption ?? null,
              updatedAt: new Date(),
            },
          })
          .returning();

        // Fetch and store insights
        try {
          const insights = await client.getMediaInsights(media.id, media.media_type);
          const metricsMap: Record<string, number> = {};
          for (const metric of insights.data) {
            metricsMap[metric.name] = metric.values[0]?.value ?? 0;
          }

          const reach = metricsMap.reach ?? 0;

          await db.insert(postInsightSnapshots).values({
            postId: post.id,
            snapshotDate: new Date(),
            reach,
            impressions: metricsMap.impressions ?? 0,
            engagement: metricsMap.engagement ?? 0,
            likes: metricsMap.likes ?? 0,
            comments: metricsMap.comments ?? 0,
            shares: metricsMap.shares ?? 0,
            saves: metricsMap.saved ?? 0,
            videoViews: metricsMap.video_views ?? null,
            engagementRate: reach > 0 ? ((metricsMap.engagement ?? 0) / reach) * 100 : 0,
            saveRate: reach > 0 ? ((metricsMap.saved ?? 0) / reach) * 100 : 0,
            shareRate: reach > 0 ? ((metricsMap.shares ?? 0) / reach) * 100 : 0,
          });
        } catch (err) {
          // Some media types may not support insights
          console.warn(`Could not fetch insights for media ${media.id}:`, err);
        }

        processed++;
      }

      after = mediaResult.paging?.cursors.after;
      if (!mediaResult.paging?.next) break;
    }

    await db
      .update(syncJobs)
      .set({ status: "completed", recordsProcessed: processed, completedAt: new Date() })
      .where(eq(syncJobs.id, job.id));

    return { success: true, processed };
  } catch (error) {
    await db
      .update(syncJobs)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(syncJobs.id, job.id));

    throw error;
  }
}

export async function syncInstagramInsights(
  accountId: string,
  accessToken: string,
  instagramAccountId: string
) {
  const client = new InstagramClient(accessToken, accountId, instagramAccountId);

  const [job] = await db
    .insert(syncJobs)
    .values({
      accountId,
      jobType: "instagram_insights",
      status: "running",
      startedAt: new Date(),
    })
    .returning();

  try {
    const accountInfo = await client.getAccountInfo();
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 86400;

    const insights = await client.getAccountInsights("day", oneDayAgo, now);

    const metricsMap: Record<string, number> = {};
    for (const metric of insights.data) {
      const latestValue = metric.values[metric.values.length - 1];
      metricsMap[metric.name] = latestValue?.value ?? 0;
    }

    // Get demographics
    let audienceGenderAge: string | null = null;
    let audienceCity: string | null = null;
    let audienceCountry: string | null = null;

    try {
      const demographics = await client.getAudienceDemographics();
      for (const metric of demographics.data) {
        const value = metric.values[0]?.value;
        if (metric.name === "audience_gender_age") audienceGenderAge = JSON.stringify(value);
        if (metric.name === "audience_city") audienceCity = JSON.stringify(value);
        if (metric.name === "audience_country") audienceCountry = JSON.stringify(value);
      }
    } catch {
      // Demographics require minimum followers
    }

    await db.insert(instagramInsightSnapshots).values({
      accountId,
      snapshotDate: new Date(),
      followersCount: accountInfo.followers_count,
      followsCount: accountInfo.follows_count,
      reach: metricsMap.reach ?? 0,
      impressions: metricsMap.impressions ?? 0,
      profileViews: metricsMap.profile_views ?? 0,
      websiteClicks: metricsMap.website_clicks ?? 0,
      newFollowers: metricsMap.follower_count ?? 0,
      audienceGenderAge,
      audienceCity,
      audienceCountry,
    });

    await db
      .update(syncJobs)
      .set({ status: "completed", recordsProcessed: 1, completedAt: new Date() })
      .where(eq(syncJobs.id, job.id));

    return { success: true };
  } catch (error) {
    await db
      .update(syncJobs)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(syncJobs.id, job.id));

    throw error;
  }
}
