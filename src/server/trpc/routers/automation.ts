import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import {
  isMockAccount,
  getMockFlows,
  getMockFlowSteps,
  getMockFlowIssues,
  getMockAutomationInsights,
} from "../../mock-data";

export const automationRouter = createTRPCRouter({
  getFlows: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockFlows();
      return getMockFlows();
    }),

  getFlowSteps: protectedProcedure
    .input(z.object({ flowId: z.string().uuid() }))
    .query(async ({ input }) => {
      return getMockFlowSteps(input.flowId);
    }),

  getFlowIssues: protectedProcedure
    .input(z.object({ flowId: z.string().uuid() }))
    .query(async ({ input }) => {
      return getMockFlowIssues(input.flowId);
    }),

  getInsights: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockAutomationInsights();
      return getMockAutomationInsights();
    }),
});
