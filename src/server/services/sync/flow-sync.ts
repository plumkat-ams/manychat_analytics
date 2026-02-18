import { db } from "../../db";
import { flows, syncJobs } from "../../db/schema";
import { ManychatClient } from "../manychat-client";
import { eq } from "drizzle-orm";

export async function syncFlows(accountId: string, apiToken: string) {
  const client = new ManychatClient(apiToken);

  const [job] = await db
    .insert(syncJobs)
    .values({
      accountId,
      jobType: "flows",
      status: "running",
      startedAt: new Date(),
    })
    .returning();

  try {
    const flowData = await client.getFlows();
    let processed = 0;

    for (const flow of flowData) {
      await db
        .insert(flows)
        .values({
          accountId,
          manychatFlowId: flow.ns,
          name: flow.name,
          type: flow.type,
        })
        .onConflictDoUpdate({
          target: [flows.manychatFlowId],
          set: {
            name: flow.name,
            type: flow.type,
            updatedAt: new Date(),
          },
        });

      processed++;
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
