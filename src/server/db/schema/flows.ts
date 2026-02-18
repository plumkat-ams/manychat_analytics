import { pgTable, text, timestamp, uuid, integer, real, boolean, index } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

export const flows = pgTable(
  "flows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    manychatFlowId: text("manychat_flow_id").notNull(),
    name: text("name").notNull(),
    type: text("type"), // e.g., 'keyword', 'sequence', 'rule', etc.
    isActive: boolean("is_active").default(true).notNull(),
    triggerCount: integer("trigger_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountIdx: index("flows_account_idx").on(table.accountId),
    manychatFlowIdIdx: index("flows_manychat_flow_id_idx").on(table.manychatFlowId),
  })
);

export const flowSteps = pgTable(
  "flow_steps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    flowId: uuid("flow_id")
      .references(() => flows.id)
      .notNull(),
    stepNumber: integer("step_number").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'message', 'condition', 'action', 'delay', etc.
    reached: integer("reached").default(0),
    completed: integer("completed").default(0),
    dropOff: integer("drop_off").default(0),
    avgResponseTime: real("avg_response_time"), // seconds
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    flowIdx: index("flow_steps_flow_idx").on(table.flowId),
  })
);

export type Flow = typeof flows.$inferSelect;
export type NewFlow = typeof flows.$inferInsert;
export type FlowStepRecord = typeof flowSteps.$inferSelect;
export type NewFlowStep = typeof flowSteps.$inferInsert;
