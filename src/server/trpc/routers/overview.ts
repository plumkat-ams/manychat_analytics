import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import {
  isMockAccount,
  getMockBusinessSnapshot,
  getMockTopContent,
  getMockTopFlows,
  getMockAlerts,
  getMockOpportunities,
  getMockProgressTrends,
} from "../../mock-data";

export const overviewRouter = createTRPCRouter({
  getBusinessSnapshot: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockBusinessSnapshot();
      return getMockBusinessSnapshot();
    }),

  getTopContent: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockTopContent().slice(0, input.limit);
      return getMockTopContent().slice(0, input.limit);
    }),

  getTopFlows: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockTopFlows().slice(0, input.limit);
      return getMockTopFlows().slice(0, input.limit);
    }),

  getAlerts: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockAlerts();
      return getMockAlerts();
    }),

  getOpportunities: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockOpportunities();
      return getMockOpportunities();
    }),

  getProgressTrends: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockProgressTrends();
      return getMockProgressTrends();
    }),
});
