import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import {
  isMockAccount,
  getMockFollowerConversion,
  getMockFollowerSourceAttribution,
  getMockAudienceQualityTrend,
  getMockAudienceInsights,
} from "../../mock-data";

export const audienceRouter = createTRPCRouter({
  getFollowerConversion: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockFollowerConversion();
      return getMockFollowerConversion();
    }),

  getSourceAttribution: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ input }) => {
      const data = getMockFollowerSourceAttribution();
      return data.slice(0, input.limit);
    }),

  getQualityTrend: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockAudienceQualityTrend();
      return getMockAudienceQualityTrend();
    }),

  getInsights: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockAudienceInsights();
      return getMockAudienceInsights();
    }),
});
