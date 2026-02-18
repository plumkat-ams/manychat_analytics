import { Worker, Queue } from "bullmq";
import { db } from "../db";
import { accounts } from "../db/schema";
import { eq } from "drizzle-orm";
import { syncSubscribers } from "../services/sync/subscriber-sync";
import { syncFlows } from "../services/sync/flow-sync";
import { syncInstagramPosts, syncInstagramInsights } from "../services/sync/instagram-sync";

const connection = {
  host: new URL(process.env.REDIS_URL ?? "redis://localhost:6379").hostname,
  port: Number(new URL(process.env.REDIS_URL ?? "redis://localhost:6379").port) || 6379,
};

// Define queues
export const syncQueue = new Queue("sync", { connection });

// Schedule recurring syncs
async function setupSchedules() {
  await syncQueue.upsertJobScheduler("sync-subscribers", { every: 15 * 60 * 1000 }, { name: "subscribers" });
  await syncQueue.upsertJobScheduler("sync-flows", { every: 60 * 60 * 1000 }, { name: "flows" });
  await syncQueue.upsertJobScheduler("sync-ig-posts", { every: 30 * 60 * 1000 }, { name: "instagram_posts" });
  await syncQueue.upsertJobScheduler("sync-ig-insights", { every: 60 * 60 * 1000 }, { name: "instagram_insights" });
}

// Worker
const worker = new Worker(
  "sync",
  async (job) => {
    // Get all active accounts
    const activeAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.isActive, true));

    for (const account of activeAccounts) {
      try {
        switch (job.name) {
          case "subscribers":
            if (account.manychatApiToken) {
              await syncSubscribers(account.id, account.manychatApiToken);
            }
            break;

          case "flows":
            if (account.manychatApiToken) {
              await syncFlows(account.id, account.manychatApiToken);
            }
            break;

          case "instagram_posts":
            if (account.instagramAccessToken && account.instagramAccountId) {
              await syncInstagramPosts(
                account.id,
                account.instagramAccessToken,
                account.instagramAccountId
              );
            }
            break;

          case "instagram_insights":
            if (account.instagramAccessToken && account.instagramAccountId) {
              await syncInstagramInsights(
                account.id,
                account.instagramAccessToken,
                account.instagramAccountId
              );
            }
            break;
        }
      } catch (error) {
        console.error(`Sync error for account ${account.id}, job ${job.name}:`, error);
      }
    }
  },
  { connection, concurrency: 2 }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} (${job.name}) completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} (${job?.name}) failed:`, err);
});

setupSchedules().then(() => {
  console.log("Sync schedules configured");
});

console.log("Worker started");
