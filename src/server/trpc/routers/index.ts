import { createTRPCRouter } from "..";
import { overviewRouter } from "./overview";
import { audienceRouter } from "./audience";
import { contentRouter } from "./content";
import { automationRouter } from "./automation";
import { conversionRouter } from "./conversion";
import { comparisonRouter } from "./comparison";
import { aiRouter } from "./ai";

export const appRouter = createTRPCRouter({
  overview: overviewRouter,
  audience: audienceRouter,
  content: contentRouter,
  automation: automationRouter,
  conversion: conversionRouter,
  comparison: comparisonRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
