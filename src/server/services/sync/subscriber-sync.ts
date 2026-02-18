import { db } from "../../db";
import { subscribers, syncJobs } from "../../db/schema";
import { ManychatClient } from "../manychat-client";
import { eq, and } from "drizzle-orm";

export async function syncSubscribers(accountId: string, apiToken: string) {
  const client = new ManychatClient(apiToken);

  // Create sync job
  const [job] = await db
    .insert(syncJobs)
    .values({
      accountId,
      jobType: "subscribers",
      status: "running",
      startedAt: new Date(),
    })
    .returning();

  let processed = 0;
  let offset = 0;
  const batchSize = 100;

  try {
    while (true) {
      const result = await client.getSubscribers(batchSize, offset);
      if (!result.data || result.data.length === 0) break;

      for (const sub of result.data) {
        await db
          .insert(subscribers)
          .values({
            accountId,
            manychatSubscriberId: sub.id,
            firstName: sub.first_name,
            lastName: sub.last_name,
            name: sub.name,
            gender: sub.gender,
            profilePicUrl: sub.profile_pic,
            locale: sub.locale,
            timezone: sub.timezone,
            subscribedAt: sub.subscribed ? new Date(sub.subscribed) : null,
            lastInteractionAt: sub.last_interaction ? new Date(sub.last_interaction) : null,
            tags: sub.tags?.map((t) => t.name) ?? [],
            customFields: sub.custom_fields ? JSON.stringify(sub.custom_fields) : null,
          })
          .onConflictDoUpdate({
            target: [subscribers.manychatSubscriberId],
            set: {
              firstName: sub.first_name,
              lastName: sub.last_name,
              name: sub.name,
              gender: sub.gender,
              lastInteractionAt: sub.last_interaction ? new Date(sub.last_interaction) : null,
              tags: sub.tags?.map((t) => t.name) ?? [],
              customFields: sub.custom_fields ? JSON.stringify(sub.custom_fields) : null,
              updatedAt: new Date(),
            },
          });

        processed++;
      }

      offset += batchSize;
      if (offset >= result.total) break;
    }

    await db
      .update(syncJobs)
      .set({
        status: "completed",
        recordsProcessed: processed,
        completedAt: new Date(),
      })
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
