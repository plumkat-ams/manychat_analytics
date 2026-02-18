import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import {
  isMockAccount,
  getMockAiSummary,
  getMockFlowAnalysis,
  getMockContentAnalysis,
  getMockCoverageAnalysis,
  getMockChatResponse,
  getMockSuggestedQueries,
  getMockHomeHighlights,
  getMockHomeActions,
  getMockHomeRecommendations,
  getMockHomeProfile,
  getMockHomeInsights,
  getMockActiveAutomations,
} from "../../mock-data";

export const aiRouter = createTRPCRouter({
  getViewSummary: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        view: z.enum(["overview", "content", "automation", "audience", "conversion", "comparison"]),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockAiSummary(input.view);
      return getMockAiSummary(input.view);
    }),

  analyzeFlow: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        flowId: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockFlowAnalysis(input.flowId);
      return getMockFlowAnalysis(input.flowId);
    }),

  analyzeContent: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        postId: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockContentAnalysis(input.postId);
      return getMockContentAnalysis(input.postId);
    }),

  analyzeCoverage: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockCoverageAnalysis();
      return getMockCoverageAnalysis();
    }),

  chat: protectedProcedure
    .input(
      z.object({
        accountId: z.string().uuid(),
        message: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockChatResponse(input.message);
      return getMockChatResponse(input.message);
    }),

  getSuggestedQueries: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockSuggestedQueries();
      return getMockSuggestedQueries();
    }),

  getHomeHighlights: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockHomeHighlights();
      return getMockHomeHighlights();
    }),

  getHomeActions: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockHomeActions();
      return getMockHomeActions();
    }),

  getHomeRecommendations: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockHomeRecommendations();
      return getMockHomeRecommendations();
    }),

  getHomeProfile: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockHomeProfile();
      return getMockHomeProfile();
    }),

  getHomeInsights: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockHomeInsights();
      return getMockHomeInsights();
    }),

  getActiveAutomations: protectedProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => {
      if (isMockAccount(input.accountId)) return getMockActiveAutomations();
      return getMockActiveAutomations();
    }),
});
