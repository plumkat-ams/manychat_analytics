import { pgTable, text, timestamp, uuid, integer, index } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

export const syncJobs = pgTable(
  "sync_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    jobType: text("job_type").notNull(), // 'subscribers', 'flows', 'instagram_posts', 'instagram_insights'
    status: text("status").notNull().default("pending"), // 'pending', 'running', 'completed', 'failed'
    recordsProcessed: integer("records_processed").default(0),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("sync_jobs_account_idx").on(table.accountId),
    statusIdx: index("sync_jobs_status_idx").on(table.status),
  })
);

export type SyncJob = typeof syncJobs.$inferSelect;
export type NewSyncJob = typeof syncJobs.$inferInsert;
