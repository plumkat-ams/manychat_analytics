/**
 * Mock data for dashboard testing when accountId === MOCK_ACCOUNT_ID.
 * Use API token "demo" on login to get this account.
 */

const MOCK_ACCOUNT_ID = "00000000-0000-0000-0000-000000000001";
export { MOCK_ACCOUNT_ID };

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isMockAccount(accountId: string): boolean {
  return accountId === MOCK_ACCOUNT_ID;
}

// --- Overview: Business Snapshot ---
export function getMockBusinessSnapshot() {
  return {
    leads: { current: 342, previous: 290, label: "Leads this period" },
    touchRate: { value: 68.4, previous: 61.2, label: "Touch Rate" },
    timeSaved: { hours: 127, label: "Time Saved" },
    followerGrowth: { netNew: 1840, percentChange: 14.7, label: "Follower Growth" },
  };
}

// --- Overview: Top Content (by leads/1K reach) ---
export function getMockTopContent() {
  return [
    {
      id: "tc-1",
      thumbnail: null as string | null,
      title: "5 DM hacks that grew my list 3x",
      type: "Reel" as const,
      leadsPerKReach: 18.4,
      reach: 24300,
      leads: 447,
      automationCoverage: 92,
    },
    {
      id: "tc-2",
      thumbnail: null as string | null,
      title: "Free template drop (comment GUIDE)",
      type: "Carousel" as const,
      leadsPerKReach: 14.2,
      reach: 18700,
      leads: 266,
      automationCoverage: 100,
    },
    {
      id: "tc-3",
      thumbnail: null as string | null,
      title: "Behind the scenes: how I automate everything",
      type: "Reel" as const,
      leadsPerKReach: 11.7,
      reach: 31200,
      leads: 365,
      automationCoverage: 85,
    },
    {
      id: "tc-4",
      thumbnail: null as string | null,
      title: "Reply FREEBIE to get the checklist",
      type: "Story" as const,
      leadsPerKReach: 9.8,
      reach: 12400,
      leads: 122,
      automationCoverage: 100,
    },
    {
      id: "tc-5",
      thumbnail: null as string | null,
      title: "Day in my life as a creator",
      type: "Reel" as const,
      leadsPerKReach: 3.1,
      reach: 45600,
      leads: 141,
      automationCoverage: 0,
    },
  ];
}

// --- Overview: Top Flows (by conversions) ---
export function getMockTopFlows() {
  return [
    {
      id: "tf-1",
      name: "Welcome Sequence",
      channels: ["instagram", "messenger"] as string[],
      conversionRate: 24.3,
      leads: 1020,
      status: "ok" as const,
    },
    {
      id: "tf-2",
      name: "Lead Magnet Delivery",
      channels: ["instagram"] as string[],
      conversionRate: 18.7,
      leads: 780,
      status: "ok" as const,
    },
    {
      id: "tf-3",
      name: "Comment-to-DM (GUIDE)",
      channels: ["instagram"] as string[],
      conversionRate: 15.2,
      leads: 540,
      status: "ok" as const,
    },
    {
      id: "tf-4",
      name: "Re-engagement Drip",
      channels: ["messenger"] as string[],
      conversionRate: 8.1,
      leads: 195,
      status: "warning" as const,
    },
    {
      id: "tf-5",
      name: "Promo Broadcast",
      channels: ["instagram", "messenger"] as string[],
      conversionRate: 6.4,
      leads: 310,
      status: "ok" as const,
    },
  ];
}

// --- Overview: What's Broken or Risky ---
export function getMockAlerts() {
  return [
    {
      id: "alert-1",
      severity: "critical" as const,
      title: "Welcome Flow completion dropped 80% → 20%",
      detail: "Completion rate crashed yesterday. Step 3 ('CTA') is failing silently.",
      estimatedImpact: "Est. –$800/week in lost conversions",
      action: "Fix" as const,
    },
    {
      id: "alert-2",
      severity: "critical" as const,
      title: "Entry point 'IG Comments: 🔥' stopped firing",
      detail: "0 triggers in last 24h vs. 50/day average. Likely a keyword mismatch or API issue.",
      estimatedImpact: "Est. 50 missed leads/day",
      action: "Fix" as const,
    },
    {
      id: "alert-3",
      severity: "warning" as const,
      title: "Conversion rate dropped 15% → 6% in 48 hours",
      detail: "Lead Magnet flow conversions declining rapidly since Tuesday.",
      estimatedImpact: "Est. –$320/week if trend continues",
      action: "Review" as const,
    },
  ];
}

// --- Overview: Missed Opportunities ---
export function getMockOpportunities() {
  return [
    {
      id: "opp-1",
      title: "3 Reels with 200+ saves have 0% automation",
      detail: "High-intent content is not connected to any flow. These posts have strong save-to-reach ratios indicating purchase intent.",
      estimatedLeads: 90,
      estimatedRevenue: "$2,700",
    },
    {
      id: "opp-2",
      title: "Refund requests: 60% escalated to human",
      detail: "Build a dedicated refund flow to handle common cases automatically. Currently eating 4h/week of support time.",
      estimatedLeads: null as number | null,
      estimatedRevenue: "4h/week saved",
    },
    {
      id: "opp-3",
      title: "Story replies averaging 120/day with no automation",
      detail: "Story reply triggers are not configured. Each reply is a warm lead going cold.",
      estimatedLeads: 35,
      estimatedRevenue: "$1,050",
    },
  ];
}

// --- Overview: Progress Trends (30/60/90 day data) ---
export function getMockProgressTrends() {
  const touchRate = Array.from({ length: 90 }, (_, i) => ({
    date: dateStr(daysAgo(89 - i)),
    value: 45 + (i / 90) * 25 + (Math.random() - 0.5) * 8,
  }));
  const leads = Array.from({ length: 90 }, (_, i) => ({
    date: dateStr(daysAgo(89 - i)),
    value: Math.round(6 + (i / 90) * 8 + (Math.random() - 0.5) * 4),
  }));
  const followerGrowth = Array.from({ length: 90 }, (_, i) => ({
    date: dateStr(daysAgo(89 - i)),
    value: Math.round(15 + (i / 90) * 25 + (Math.random() - 0.5) * 10),
  }));
  return { touchRate, leads, followerGrowth };
}

// --- Audience ---

export function getMockFollowerConversion() {
  return {
    newFollowers: 5840,
    enteredFlowsWithin7d: 3210,
    enteredFlowsPct: 55.0,
    becameLeads: 1420,
    becameLeadsPct: 24.3,
    newFollowerConvRate: 24.3,
    existingAudienceConvRate: 8.7,
  };
}

export function getMockFollowerSourceAttribution() {
  return [
    { id: "cp-5",  type: "Reel" as const,     caption: "Day in my life as a full-time creator",             followers: 820, leads: 141, conversionRate: 17.2 },
    { id: "cp-9",  type: "Reel" as const,     caption: "Unboxing haul + exclusive discount link",            followers: 680, leads: 210, conversionRate: 30.9 },
    { id: "cp-7",  type: "Reel" as const,     caption: "Stop doing this with your DMs — here's why",         followers: 540, leads: 285, conversionRate: 52.8 },
    { id: "cp-3",  type: "Reel" as const,     caption: "Behind the scenes: how I automate my entire biz",    followers: 420, leads: 365, conversionRate: 86.9 },
    { id: "cp-11", type: "Reel" as const,     caption: "POV: you finally set up your comment automation",    followers: 390, leads: 320, conversionRate: 82.1 },
  ];
}

export function getMockAudienceQualityTrend() {
  const days: Array<{ date: string; newFollowers: number; touchRatePct: number }> = [];
  for (let i = 29; i >= 0; i--) {
    days.push({
      date: dateStr(daysAgo(i)),
      newFollowers: 40 + Math.floor(Math.random() * 80),
      touchRatePct: Number((3 + Math.random() * 6).toFixed(1)),
    });
  }
  return days;
}

export function getMockAudienceInsights() {
  const conv = getMockFollowerConversion();
  const quality = getMockAudienceQualityTrend();
  const avgTouch = quality.reduce((s, d) => s + d.touchRatePct, 0) / quality.length;
  const followerGrowthPct = 15;

  const insights: Array<{ type: "tip" | "warning"; text: string }> = [];

  if (followerGrowthPct > avgTouch * 2) {
    insights.push({
      type: "warning",
      text: `You're growing followers ${followerGrowthPct}% but touch rate is only ${avgTouch.toFixed(0)}% — add more automation to engage new followers.`,
    });
  }

  if (conv.newFollowerConvRate > conv.existingAudienceConvRate * 2) {
    insights.push({
      type: "tip",
      text: `New followers convert at ${conv.newFollowerConvRate}% vs ${conv.existingAudienceConvRate}% for existing audience — your welcome flow is working well.`,
    });
  } else {
    insights.push({
      type: "tip",
      text: `New followers convert at ${conv.newFollowerConvRate}% vs ${conv.existingAudienceConvRate}% for existing — there's room to improve your welcome flow.`,
    });
  }

  return insights;
}

// --- Content & Campaigns ---

const MOCK_CONTENT_POSTS = [
  { id: "cp-1",  contentType: "Reel" as const,     caption: "5 DM hacks that grew my list 3x — save this!",               publishedAt: daysAgo(2),  reach: 24300, engagementRate: 9.2,  saves: 620,  leads: 447, automationCoverage: 92 },
  { id: "cp-2",  contentType: "Carousel" as const,  caption: "Free template drop — comment GUIDE to get it",               publishedAt: daysAgo(4),  reach: 18700, engagementRate: 7.8,  saves: 410,  leads: 266, automationCoverage: 100 },
  { id: "cp-3",  contentType: "Reel" as const,     caption: "Behind the scenes: how I automate my entire biz",             publishedAt: daysAgo(6),  reach: 31200, engagementRate: 8.1,  saves: 540,  leads: 365, automationCoverage: 85 },
  { id: "cp-4",  contentType: "Story" as const,    caption: "Reply FREEBIE for the checklist",                              publishedAt: daysAgo(3),  reach: 12400, engagementRate: 5.4,  saves: 180,  leads: 122, automationCoverage: 100 },
  { id: "cp-5",  contentType: "Reel" as const,     caption: "Day in my life as a full-time creator",                        publishedAt: daysAgo(8),  reach: 45600, engagementRate: 10.3, saves: 920,  leads: 141, automationCoverage: 0 },
  { id: "cp-6",  contentType: "Post" as const,     caption: "Biggest lesson I learned scaling to $50K/mo",                  publishedAt: daysAgo(10), reach: 8200,  engagementRate: 6.5,  saves: 310,  leads: 58,  automationCoverage: 70 },
  { id: "cp-7",  contentType: "Reel" as const,     caption: "Stop doing this with your DMs — here's why",                   publishedAt: daysAgo(5),  reach: 38400, engagementRate: 7.6,  saves: 480,  leads: 285, automationCoverage: 88 },
  { id: "cp-8",  contentType: "Carousel" as const,  caption: "The 4-step funnel that converts followers to buyers",          publishedAt: daysAgo(12), reach: 14200, engagementRate: 8.9,  saves: 390,  leads: 198, automationCoverage: 95 },
  { id: "cp-9",  contentType: "Reel" as const,     caption: "Unboxing haul + exclusive discount link",                      publishedAt: daysAgo(7),  reach: 52100, engagementRate: 11.2, saves: 1100, leads: 210, automationCoverage: 40 },
  { id: "cp-10", contentType: "Post" as const,     caption: "What nobody tells you about growing on IG in 2026",            publishedAt: daysAgo(14), reach: 6800,  engagementRate: 5.1,  saves: 220,  leads: 32,  automationCoverage: 0 },
  { id: "cp-11", contentType: "Reel" as const,     caption: "POV: you finally set up your comment automation",              publishedAt: daysAgo(9),  reach: 29800, engagementRate: 8.8,  saves: 710,  leads: 320, automationCoverage: 100 },
  { id: "cp-12", contentType: "Story" as const,    caption: "Quick poll — which freebie do you want next?",                  publishedAt: daysAgo(1),  reach: 9500,  engagementRate: 4.2,  saves: 60,   leads: 45,  automationCoverage: 0 },
];

export function getMockContentPosts() {
  return MOCK_CONTENT_POSTS.map((p) => ({
    ...p,
    thumbnailUrl: null as string | null,
    permalink: `https://instagram.com/p/${p.id}`,
    impressions: Math.round(p.reach * 1.3),
    engagement: Math.round(p.reach * p.engagementRate / 100),
    likes: Math.round(p.reach * (p.engagementRate * 0.6) / 100),
    comments: Math.round(p.reach * (p.engagementRate * 0.15) / 100),
    shares: Math.round(p.reach * (p.engagementRate * 0.1) / 100),
    leadsPerKReach: Number(((p.leads / p.reach) * 1000).toFixed(1)),
  }));
}

export function getMockContentSummary() {
  const posts = MOCK_CONTENT_POSTS;
  const totalReach = posts.reduce((s, p) => s + p.reach, 0);
  const totalLeads = posts.reduce((s, p) => s + p.leads, 0);

  const byType = (type: string) => {
    const filtered = posts.filter((p) => p.contentType === type);
    const reach = filtered.reduce((s, p) => s + p.reach, 0);
    const leads = filtered.reduce((s, p) => s + p.leads, 0);
    const avgEng = filtered.length > 0 ? filtered.reduce((s, p) => s + p.engagementRate, 0) / filtered.length : 0;
    return {
      type,
      count: filtered.length,
      reach,
      reachShare: totalReach > 0 ? Math.round((reach / totalReach) * 100) : 0,
      leads,
      leadsShare: totalLeads > 0 ? Math.round((leads / totalLeads) * 100) : 0,
      avgEngagementRate: Number(avgEng.toFixed(1)),
      leadsPerKReach: reach > 0 ? Number(((leads / reach) * 1000).toFixed(1)) : 0,
    };
  };

  const types = ["Reel", "Carousel", "Post", "Story"].map(byType).filter((t) => t.count > 0);
  const topType = [...types].sort((a, b) => b.reachShare - a.reachShare)[0];

  return {
    headline: topType
      ? `This period: ${topType.type}s = ${topType.reachShare}% of reach, ${topType.leadsShare}% of leads.`
      : "No content data for this period.",
    totalPosts: posts.length,
    totalReach,
    totalLeads,
    byType: types,
  };
}

export function getMockScatterData() {
  return getMockContentPosts().map((p) => ({
    id: p.id,
    contentType: p.contentType,
    reach: p.reach,
    engagementRate: p.engagementRate,
    dmConversions: p.leads,
  }));
}

export function getMockEngagementByType() {
  return [
    { contentType: "Reel",     avgEngagementRate: 9.0, avgReach: 36900, postCount: 6 },
    { contentType: "Carousel", avgEngagementRate: 8.4, avgReach: 16450, postCount: 2 },
    { contentType: "Post",     avgEngagementRate: 5.8, avgReach: 7500,  postCount: 2 },
    { contentType: "Story",    avgEngagementRate: 4.8, avgReach: 10950, postCount: 2 },
  ];
}

export function getMockPostingTimeHeatmap() {
  return [
    { dayOfWeek: 0, hour: 9, avgEngagementRate: 5.2, postCount: 12 },
    { dayOfWeek: 0, hour: 14, avgEngagementRate: 6.1, postCount: 18 },
    { dayOfWeek: 1, hour: 10, avgEngagementRate: 5.8, postCount: 15 },
    { dayOfWeek: 2, hour: 12, avgEngagementRate: 6.5, postCount: 20 },
    { dayOfWeek: 3, hour: 18, avgEngagementRate: 7.2, postCount: 22 },
    { dayOfWeek: 4, hour: 9, avgEngagementRate: 5.1, postCount: 14 },
    { dayOfWeek: 5, hour: 11, avgEngagementRate: 8.4, postCount: 25 },
    { dayOfWeek: 6, hour: 15, avgEngagementRate: 6.8, postCount: 19 },
  ];
}

// --- Automation ---
const MOCK_FLOW_IDS = [
  "11111111-1111-1111-1111-111111111101",
  "11111111-1111-1111-1111-111111111102",
  "11111111-1111-1111-1111-111111111103",
  "11111111-1111-1111-1111-111111111104",
  "11111111-1111-1111-1111-111111111105",
];

export { MOCK_FLOW_IDS };

export function getMockFlows() {
  return [
    { id: MOCK_FLOW_IDS[0]!, name: "Welcome Sequence",     channels: ["instagram", "messenger"] as string[], entries: 4200, completionRate: 78,  leads: 1020, conversionRate: 24.3, timeSaved: 38, status: "ok" as const,      issueTag: null as string | null },
    { id: MOCK_FLOW_IDS[1]!, name: "Lead Magnet Delivery",  channels: ["instagram"] as string[],              entries: 3100, completionRate: 82,  leads: 780,  conversionRate: 25.2, timeSaved: 24, status: "ok" as const,      issueTag: null as string | null },
    { id: MOCK_FLOW_IDS[2]!, name: "Comment-to-DM (GUIDE)", channels: ["instagram"] as string[],              entries: 8500, completionRate: 65,  leads: 540,  conversionRate: 6.4,  timeSaved: 52, status: "warning" as const, issueTag: "Completion –12% vs last week" },
    { id: MOCK_FLOW_IDS[3]!, name: "Re-engagement Drip",    channels: ["messenger"] as string[],              entries: 1200, completionRate: 20,  leads: 195,  conversionRate: 16.3, timeSaved: 12, status: "broken" as const,  issueTag: "Completion dropped 80% → 20%" },
    { id: MOCK_FLOW_IDS[4]!, name: "Promo Broadcast",       channels: ["instagram", "messenger"] as string[], entries: 6800, completionRate: 72,  leads: 310,  conversionRate: 4.6,  timeSaved: 31, status: "ok" as const,      issueTag: null as string | null },
  ];
}

const MOCK_FLOW_STEPS_MAP: Record<string, Array<{
  id: string; flowId: string; stepNumber: number; name: string; type: string;
  reached: number; completed: number; dropOff: number; dropOffRate: number;
}>> = {
  [MOCK_FLOW_IDS[0]!]: [
    { id: "s1-1", flowId: MOCK_FLOW_IDS[0]!, stepNumber: 1, name: "Welcome message",   type: "message", reached: 4200, completed: 4100, dropOff: 100,  dropOffRate: 2.4 },
    { id: "s1-2", flowId: MOCK_FLOW_IDS[0]!, stepNumber: 2, name: "Delay 1 day",       type: "delay",   reached: 4100, completed: 4050, dropOff: 50,   dropOffRate: 1.2 },
    { id: "s1-3", flowId: MOCK_FLOW_IDS[0]!, stepNumber: 3, name: "Value message",      type: "message", reached: 4050, completed: 3800, dropOff: 250,  dropOffRate: 6.2 },
    { id: "s1-4", flowId: MOCK_FLOW_IDS[0]!, stepNumber: 4, name: "CTA: Get resource",  type: "action",  reached: 3800, completed: 3280, dropOff: 520,  dropOffRate: 13.7 },
  ],
  [MOCK_FLOW_IDS[1]!]: [
    { id: "s2-1", flowId: MOCK_FLOW_IDS[1]!, stepNumber: 1, name: "DM auto-reply",     type: "message", reached: 3100, completed: 3050, dropOff: 50,   dropOffRate: 1.6 },
    { id: "s2-2", flowId: MOCK_FLOW_IDS[1]!, stepNumber: 2, name: "Deliver PDF",       type: "action",  reached: 3050, completed: 2980, dropOff: 70,   dropOffRate: 2.3 },
    { id: "s2-3", flowId: MOCK_FLOW_IDS[1]!, stepNumber: 3, name: "Follow-up (24h)",   type: "message", reached: 2980, completed: 2540, dropOff: 440,  dropOffRate: 14.8 },
  ],
  [MOCK_FLOW_IDS[3]!]: [
    { id: "s4-1", flowId: MOCK_FLOW_IDS[3]!, stepNumber: 1, name: "Re-engage msg",     type: "message", reached: 1200, completed: 920,  dropOff: 280,  dropOffRate: 23.3 },
    { id: "s4-2", flowId: MOCK_FLOW_IDS[3]!, stepNumber: 2, name: "Condition check",   type: "condition", reached: 920, completed: 600, dropOff: 320,  dropOffRate: 34.8 },
    { id: "s4-3", flowId: MOCK_FLOW_IDS[3]!, stepNumber: 3, name: "Offer message",     type: "message", reached: 600,  completed: 240,  dropOff: 360,  dropOffRate: 60.0 },
  ],
};

export function getMockFlowSteps(flowId: string) {
  return MOCK_FLOW_STEPS_MAP[flowId] ?? [
    { id: `gen-1`, flowId, stepNumber: 1, name: "Trigger",    type: "trigger",  reached: 1000, completed: 950, dropOff: 50,  dropOffRate: 5.0 },
    { id: `gen-2`, flowId, stepNumber: 2, name: "Message",    type: "message",  reached: 950,  completed: 820, dropOff: 130, dropOffRate: 13.7 },
    { id: `gen-3`, flowId, stepNumber: 3, name: "Action",     type: "action",   reached: 820,  completed: 720, dropOff: 100, dropOffRate: 12.2 },
  ];
}

export function getMockFlowIssues(flowId: string) {
  const steps = getMockFlowSteps(flowId);
  const avgDropOff = steps.reduce((s, st) => s + st.dropOffRate, 0) / steps.length;
  return steps
    .filter((st) => st.dropOffRate > avgDropOff * 1.5)
    .map((st) => ({
      stepNumber: st.stepNumber,
      stepName: st.name,
      issue: `${st.dropOffRate.toFixed(0)}% drop-off, ${(st.dropOffRate / avgDropOff).toFixed(1)}× your typical step drop-off.`,
    }));
}

export function getMockAutomationInsights() {
  const flows = getMockFlows();
  const sorted = [...flows].sort((a, b) => b.conversionRate - a.conversionRate);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const broken = flows.filter((f) => f.status === "broken" || f.status === "warning");

  const insights: Array<{ type: "tip" | "warning"; text: string }> = [];
  if (best && worst && best.conversionRate > worst.conversionRate * 2) {
    insights.push({
      type: "tip",
      text: `${best.name} converts at ${best.conversionRate}%, ${worst.name} at ${worst.conversionRate}% — replicate ${best.name}'s structure.`,
    });
  }
  for (const f of broken) {
    insights.push({
      type: "warning",
      text: f.issueTag ? `${f.name}: ${f.issueTag} — investigate.` : `${f.name} needs attention.`,
    });
  }
  return insights;
}

export function getMockTopFlowsByOutcome() {
  return [
    { flowId: MOCK_FLOW_IDS[0]!, flowName: "Welcome Sequence", sent: 4200, opened: 2940, clicked: 882, replied: 420 },
    { flowId: MOCK_FLOW_IDS[1]!, flowName: "Lead Magnet", sent: 3100, opened: 2170, clicked: 651, replied: 310 },
    { flowId: MOCK_FLOW_IDS[2]!, flowName: "Promo Broadcast", sent: 8500, opened: 5100, clicked: 1530, replied: 850 },
  ];
}

export function getMockDegradingFlows() {
  return [
    { flowId: MOCK_FLOW_IDS[3]!, flowName: "Re-engagement", currentOpenRate: 52, previousOpenRate: 68, weekOverWeekChange: -23.5 },
  ];
}

// --- Conversion ---
export function getMockConversionMetrics() {
  return {
    conversions: { current: 340, previous: 290 },
    revenue: { current: 12400, previous: 10200 },
    conversionRate: 2.73,
    cac: 36.47,
  };
}

export function getMockJourneyFunnel() {
  return [
    { stage: "IG Impressions", count: 156000, rate: 100 },
    { stage: "New Followers", count: 4200, rate: 2.69 },
    { stage: "DM Subscribers", count: 2850, rate: 67.86 },
    { stage: "Total Subscribers", count: 3100, rate: 108.77 },
    { stage: "Conversions", count: 340, rate: 10.97 },
  ];
}

export function getMockRevenueByFlow() {
  return [
    { flowId: MOCK_FLOW_IDS[0]!, flowName: "Welcome Sequence", conversions: 120, revenue: 4800, percentage: 38.7 },
    { flowId: MOCK_FLOW_IDS[1]!, flowName: "Lead Magnet", conversions: 95, revenue: 3800, percentage: 30.6 },
    { flowId: MOCK_FLOW_IDS[2]!, flowName: "Promo Broadcast", conversions: 125, revenue: 3800, percentage: 30.6 },
  ];
}

export function getMockTimeToConversion() {
  return [
    { bucket: "< 1h", count: 85 },
    { bucket: "1-24h", count: 120 },
    { bucket: "1-7 days", count: 78 },
    { bucket: "7-30 days", count: 42 },
    { bucket: "30+ days", count: 15 },
  ];
}

// --- Comparison ---
export function getMockComparePeriods() {
  return {
    periodA: {
      newSubscribers: 1250,
      messagesSent: 7200,
      messagesOpened: 4200,
      openRate: 58.3,
      conversions: 340,
      revenue: 12400,
      igReach: 156000,
      igImpressions: 420000,
    },
    periodB: {
      newSubscribers: 1180,
      messagesSent: 6800,
      messagesOpened: 3950,
      openRate: 58.1,
      conversions: 290,
      revenue: 10200,
      igReach: 142000,
      igImpressions: 380000,
    },
  };
}

export function getMockContentTypeComparison() {
  return [
    { contentType: "image", avgReach: 4200, avgEngagement: 5.2, avgSaves: 85, avgShares: 12, avgComments: 28, postCount: 45 },
    { contentType: "video", avgReach: 5600, avgEngagement: 8.1, avgSaves: 220, avgShares: 45, avgComments: 62, postCount: 28 },
    { contentType: "carousel", avgReach: 3800, avgEngagement: 6.4, avgSaves: 140, avgShares: 22, avgComments: 38, postCount: 22 },
  ];
}

export function getMockGoalProgress() {
  return [
    { goalId: "22222222-2222-2222-2222-222222222201", goalName: "Monthly sales", target: 500, current: 340, revenue: 12400, projected: 420 },
    { goalId: "22222222-2222-2222-2222-222222222202", goalName: "Lead signups", target: 1000, current: 720, revenue: 0, projected: 950 },
  ];
}

export function getMockDailyEngagement() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: dateStr(daysAgo(29 - i)),
    count: 800 + Math.floor(Math.random() * 400),
  }));
}

// ─────────────────────────────────────────────────────────
// AI Layer 1: View Summaries
// ─────────────────────────────────────────────────────────

export type AiSummaryItem = {
  icon: "chart" | "alert" | "lightbulb" | "growth";
  text: string;
  linkLabel?: string;
  linkTarget?: string;
};

export type AiViewSummary = {
  title: string;
  items: AiSummaryItem[];
};

export function getMockAiSummary(view: string): AiViewSummary {
  switch (view) {
    case "overview":
      return {
        title: "This Week",
        items: [
          { icon: "chart", text: "Leads +18%, touch rate 12% → 16%." },
          { icon: "alert", text: "Two flows degraded (Welcome Flow, Re-engagement Drip).", linkLabel: "View flows", linkTarget: "/analytics/automation" },
          { icon: "lightbulb", text: "Three high-reach Reels lack automation (~90 missed leads).", linkLabel: "See opportunities", linkTarget: "#opportunities" },
          { icon: "growth", text: "Top priority: Fix Welcome Flow Step 2 (60% drop-off).", linkLabel: "Fix now", linkTarget: "/analytics/automation" },
        ],
      };
    case "content":
      return {
        title: "Pattern Detected",
        items: [
          { icon: "lightbulb", text: "Educational Reels generate 3× more leads per 1K reach than behind-the-scenes posts." },
          { icon: "chart", text: "You posted 6 educational vs 12 BTS this month — consider flipping that ratio." },
          { icon: "growth", text: "Your top Reel \"5 DM hacks\" drives 18.4 leads/1K — replicate this format.", linkLabel: "View post", linkTarget: "#" },
        ],
      };
    case "automation":
      return {
        title: "Performance Issue",
        items: [
          { icon: "alert", text: "Most drop-off in Welcome Flow happens after Step 3. This step's completion (40%) is 2× worse than similar steps in your other flows." },
          { icon: "lightbulb", text: "Re-engagement Drip dropped from 80% → 20% completion. Step 2 condition check is filtering out 34.8% of users.", linkLabel: "View flow", linkTarget: "#" },
          { icon: "growth", text: "Comment-to-DM flow processes 8,500 entries but only converts 6.4% — optimize the response message.", linkLabel: "Optimize", linkTarget: "#" },
        ],
      };
    case "audience":
      return {
        title: "Audience Health",
        items: [
          { icon: "chart", text: "New followers convert at 24.3% vs 8.7% for existing audience — your welcome flow is highly effective." },
          { icon: "alert", text: "You're growing followers 15% but touch rate is only 6% — add more automation to engage new followers." },
          { icon: "lightbulb", text: "Top 5 Reels by follower acquisition all use educational format. Double down on this content type." },
        ],
      };
    case "conversion":
      return {
        title: "Conversion Insights",
        items: [
          { icon: "chart", text: "Conversions up 17% (+50 this period). Revenue grew 21.6% to $12,400." },
          { icon: "lightbulb", text: "72% of conversions happen within 24 hours. Optimize your first-touch messages for urgency." },
          { icon: "growth", text: "Welcome Sequence drives 38.7% of revenue — it's your most valuable flow.", linkLabel: "View flow", linkTarget: "/analytics/automation" },
        ],
      };
    case "comparison":
      return {
        title: "Period Comparison",
        items: [
          { icon: "chart", text: "All key metrics improved vs. previous period: subscribers +5.9%, conversions +17.2%, revenue +21.6%." },
          { icon: "lightbulb", text: "Your shift to educational Reels drove the leads growth. Quiz flow now outperforms Welcome." },
          { icon: "growth", text: "Video content outperforms all other types across reach, engagement, and saves." },
        ],
      };
    default:
      return { title: "Summary", items: [{ icon: "chart", text: "No summary available for this view." }] };
  }
}

// ─────────────────────────────────────────────────────────
// AI Layer 2: Contextual AI Analysis
// ─────────────────────────────────────────────────────────

export type AiAnalysisAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type AiAnalysis = {
  title: string;
  sections: Array<{
    heading?: string;
    points: string[];
  }>;
  actions: AiAnalysisAction[];
};

export function getMockFlowAnalysis(flowId: string): AiAnalysis {
  const flows = getMockFlows();
  const flow = flows.find((f) => f.id === flowId);
  if (!flow) {
    return {
      title: "Flow Analysis",
      sections: [{ points: ["Flow not found. Please select a valid flow to analyze."] }],
      actions: [],
    };
  }

  if (flow.status === "broken" || flow.status === "warning") {
    return {
      title: `AI Analysis: ${flow.name}`,
      sections: [
        {
          heading: "Likely causes",
          points: [
            `Step 2 has ${flow.status === "broken" ? "60%" : "34%"} drop-off — ${flow.status === "broken" ? "3×" : "1.8×"} higher than your typical steps. The message may be too long or the link could be broken.`,
            `Entry point traffic dropped 40% (fewer people triggering this flow).`,
            `Competing flow "Lead Magnet Delivery" now gets 2× more entries.`,
          ],
        },
        {
          heading: "Suggested fixes",
          points: [
            "Shorten the problematic step's message or add a text fallback.",
            "Check that the entry point keyword is still active and matches current content.",
            `Review if ${flow.name} is still needed or should be consolidated.`,
          ],
        },
      ],
      actions: [
        { label: "Fix Step 2", href: "#", variant: "primary" },
        { label: "Check Entry Point", href: "#", variant: "secondary" },
        { label: "Compare Flows", href: "/analytics/comparison", variant: "secondary" },
      ],
    };
  }

  return {
    title: `AI Analysis: ${flow.name}`,
    sections: [
      {
        heading: "Performance Summary",
        points: [
          `${flow.name} is performing well with ${flow.completionRate}% completion rate and ${flow.conversionRate}% conversion.`,
          `Generating ${flow.leads} leads from ${flow.entries} entries — that's solid efficiency.`,
          `Saving approximately ${flow.timeSaved} hours per month of manual work.`,
        ],
      },
      {
        heading: "Optimization opportunities",
        points: [
          "Consider A/B testing the CTA message to push conversion above 25%.",
          "Add a follow-up sequence for users who don't complete the flow.",
          "Test a shorter delay between steps to reduce drop-off.",
        ],
      },
    ],
    actions: [
      { label: "A/B Test CTA", href: "#", variant: "primary" },
      { label: "Add Follow-up", href: "#", variant: "secondary" },
    ],
  };
}

export function getMockContentAnalysis(postId: string): AiAnalysis {
  const posts = getMockContentPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return {
      title: "Content Analysis",
      sections: [{ points: ["Post not found."] }],
      actions: [],
    };
  }

  const isHighPerformer = post.leadsPerKReach > 10;

  if (isHighPerformer) {
    return {
      title: "Success Pattern",
      sections: [
        {
          heading: "Why this post works",
          points: [
            `Educational format ("hacks/tips") drives 3× more saves than average.`,
            `Clear value prop in first 3 words hooks the audience.`,
            `${post.automationCoverage}% automation = you captured nearly all interest.`,
          ],
        },
        {
          heading: "To replicate",
          points: [
            `Create 2 more "[Number] [Topic] that [Benefit]" Reels this week.`,
            `Use the pattern: educational hook + clear CTA + automation ready BEFORE posting.`,
            `Target similar posting time for maximum reach.`,
          ],
        },
      ],
      actions: [
        { label: "Generate Similar Caption", href: "#", variant: "primary" },
        { label: "View Automation Setup", href: "/analytics/automation", variant: "secondary" },
      ],
    };
  }

  if (post.automationCoverage === 0) {
    return {
      title: "Missed Opportunity",
      sections: [
        {
          heading: "Analysis",
          points: [
            `This post reached ${(post.reach / 1000).toFixed(1)}K people but has 0% automation coverage.`,
            `With ${post.saves} saves, there's strong intent — these users want more.`,
            `Estimated ~${Math.round(post.reach * 0.003)} additional leads with proper automation.`,
          ],
        },
        {
          heading: "Recommended actions",
          points: [
            "Add a comment-trigger automation (e.g., 'Comment GUIDE to get it').",
            "Set up a Story reply automation pointing to this content.",
            "Create a DM sequence to deliver value and capture the lead.",
          ],
        },
      ],
      actions: [
        { label: "Build Automation", href: "#", variant: "primary" },
        { label: "Add Comment Trigger", href: "#", variant: "secondary" },
      ],
    };
  }

  return {
    title: "Content Analysis",
    sections: [
      {
        heading: "Performance",
        points: [
          `${post.leadsPerKReach} leads/1K reach — ${post.leadsPerKReach > 5 ? "above" : "below"} your average.`,
          `Engagement rate: ${post.engagementRate}% with ${post.saves} saves.`,
          `Automation coverage at ${post.automationCoverage}% — ${post.automationCoverage >= 80 ? "well covered" : "room to improve"}.`,
        ],
      },
      {
        heading: "Suggestions",
        points: [
          post.automationCoverage < 80 ? "Increase automation coverage to capture more leads." : "Automation coverage is solid — focus on content quality.",
          "Test different caption hooks to improve engagement.",
          "Cross-promote this content type in Stories for additional reach.",
        ],
      },
    ],
    actions: [
      { label: "Boost Automation", href: "#", variant: "primary" },
      { label: "View Similar Posts", href: "#", variant: "secondary" },
    ],
  };
}

export function getMockCoverageAnalysis(): AiAnalysis {
  return {
    title: "Fastest Path to 30% Touch Rate",
    sections: [
      {
        heading: "Based on your traffic volume",
        points: [
          "1. Automate story replies for top 3 Reels (+8% touch rate). Impact: +120 leads/month.",
          "2. Add DM automation for \"refund\" keyword (+4%). 60% of refund requests currently go to human.",
          "3. Expand IG Comments automation (+3%). 5 Reels have 200+ comments, 0% automation.",
        ],
      },
      {
        points: [
          "Total estimated impact: +15% touch rate (12% → 27%), approximately +180 additional leads/month.",
        ],
      },
    ],
    actions: [
      { label: "Build Story Reply Automation", href: "#", variant: "primary" },
      { label: "Build Refund Flow", href: "#", variant: "secondary" },
      { label: "Add Comment Automation", href: "#", variant: "secondary" },
    ],
  };
}

// ─────────────────────────────────────────────────────────
// AI Layer 3: Conversational Agent
// ─────────────────────────────────────────────────────────

export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
  customDashboard?: AiCustomDashboard | null;
};

export type AiCustomDashboardMetric = {
  label: string;
  value: string;
  comparison?: string;
  trend?: "up" | "down" | "neutral";
};

export type AiCustomDashboardTableRow = {
  cells: string[];
};

export type AiCustomDashboardSection = {
  type: "metrics" | "table" | "insight";
  title?: string;
  metrics?: AiCustomDashboardMetric[];
  headers?: string[];
  rows?: AiCustomDashboardTableRow[];
  text?: string;
};

export type AiCustomDashboard = {
  title: string;
  subtitle: string;
  sections: AiCustomDashboardSection[];
  actions: Array<{ label: string; href: string }>;
};

const MOCK_CHAT_RESPONSES: Record<string, AiChatMessage> = {
  "leads": {
    role: "assistant",
    content: "Based on your current data, here's your prioritized playbook to get more leads this week:",
    customDashboard: {
      title: "Weekly Lead Growth Playbook",
      subtitle: "AI-generated action plan based on your data",
      sections: [
        {
          type: "metrics",
          title: "Current State",
          metrics: [
            { label: "Leads This Period", value: "342", comparison: "+18% vs last period", trend: "up" },
            { label: "Touch Rate", value: "16%", comparison: "up from 12%", trend: "up" },
            { label: "Missed Leads (est.)", value: "~180", comparison: "from uncovered content", trend: "down" },
          ],
        },
        {
          type: "table",
          title: "Priority Actions",
          headers: ["#", "Action", "Est. Impact", "Effort"],
          rows: [
            { cells: ["1", "Fix Welcome Flow Step 2 (60% drop-off)", "+80 leads/week", "30 min"] },
            { cells: ["2", "Add automation to 3 high-reach Reels", "+90 leads/month", "1 hour"] },
            { cells: ["3", "Set up story reply automation", "+35 leads/week", "45 min"] },
          ],
        },
        {
          type: "insight",
          text: "Fixing Welcome Flow alone could recover ~$800/week in lost conversions. Combined with automation coverage improvements, you could reach 500+ leads next period.",
        },
      ],
      actions: [
        { label: "Fix Welcome Flow", href: "/analytics/automation" },
        { label: "View Uncovered Content", href: "/analytics/content" },
      ],
    },
  },
  "flows": {
    role: "assistant",
    content: "Here are the flows costing you the most conversions, ranked by lost opportunity:",
    customDashboard: {
      title: "Flows by Lost Conversions",
      subtitle: "Biggest conversion losses across your flows",
      sections: [
        {
          type: "table",
          title: "Underperforming Flows",
          headers: ["Flow", "Completion", "Lost Entries", "Est. Lost Revenue"],
          rows: [
            { cells: ["Re-engagement Drip", "20% (was 80%)", "960 entries", "~$2,400/month"] },
            { cells: ["Comment-to-DM (GUIDE)", "65% (-12%)", "2,975 entries", "~$1,200/month"] },
            { cells: ["Promo Broadcast", "72%", "1,904 entries", "~$600/month"] },
          ],
        },
        {
          type: "insight",
          text: "Re-engagement Drip is your biggest problem — completion crashed from 80% to 20%. Step 3 (Offer message) has a 60% drop-off, suggesting the message or offer needs rework.",
        },
      ],
      actions: [
        { label: "Fix Re-engagement Drip", href: "/analytics/automation" },
        { label: "Compare All Flows", href: "/analytics/automation" },
      ],
    },
  },
  "whatsapp": {
    role: "assistant",
    content: "Here's a complete view of your WhatsApp performance this month:",
    customDashboard: {
      title: "WhatsApp Performance — Last 30 Days",
      subtitle: "AI-generated custom view",
      sections: [
        {
          type: "insight",
          text: "WhatsApp drives 28% of your leads with only 18% of your traffic — 2.2× more efficient than Instagram DMs.",
        },
        {
          type: "metrics",
          title: "Key Metrics",
          metrics: [
            { label: "Leads", value: "340", comparison: "+22% vs IG", trend: "up" },
            { label: "Touch Rate", value: "45%", comparison: "vs 18% on IG", trend: "up" },
            { label: "Avg Response Time", value: "1.2s", comparison: "automated", trend: "neutral" },
          ],
        },
        {
          type: "table",
          title: "Top WhatsApp Flows",
          headers: ["Flow", "Leads", "Conv. Rate"],
          rows: [
            { cells: ["Product Quiz", "140", "32%"] },
            { cells: ["Welcome Sequence", "88", "24%"] },
            { cells: ["Support FAQ", "62", "18%"] },
          ],
        },
        {
          type: "insight",
          text: "60% of WhatsApp conversations escalate to human — build an FAQ flow to automate common questions and reduce support load by ~4h/week.",
        },
      ],
      actions: [
        { label: "Build FAQ Flow", href: "#" },
        { label: "Export to CSV", href: "#" },
      ],
    },
  },
  "reels": {
    role: "assistant",
    content: "Here's your Reels-only performance dashboard:",
    customDashboard: {
      title: "Reels Performance — Last 30 Days",
      subtitle: "AI-generated custom view filtered to Reels",
      sections: [
        {
          type: "metrics",
          title: "Reels Summary",
          metrics: [
            { label: "Total Reels", value: "6", trend: "neutral" },
            { label: "Total Leads", value: "1,568", trend: "up" },
            { label: "Avg Leads/1K Reach", value: "8.4", comparison: "vs 4.2 other types", trend: "up" },
          ],
        },
        {
          type: "table",
          title: "Top 5 Reels by Leads/1K",
          headers: ["Reel", "Leads/1K", "Reach", "Coverage"],
          rows: [
            { cells: ["5 DM hacks that grew my list 3x", "18.4", "24.3K", "92%"] },
            { cells: ["Behind the scenes: how I automate...", "11.7", "31.2K", "85%"] },
            { cells: ["POV: you finally set up comment auto...", "10.7", "29.8K", "100%"] },
            { cells: ["Stop doing this with your DMs", "7.4", "38.4K", "88%"] },
            { cells: ["Unboxing haul + exclusive discount", "4.0", "52.1K", "40%"] },
          ],
        },
        {
          type: "table",
          title: "Format Breakdown",
          headers: ["Format", "Leads/1K", "Post Count"],
          rows: [
            { cells: ["Educational", "13.4", "3 posts"] },
            { cells: ["Behind-the-Scenes", "3.1", "1 post"] },
            { cells: ["Promotional", "4.0", "1 post"] },
            { cells: ["Lifestyle", "10.7", "1 post"] },
          ],
        },
        {
          type: "insight",
          text: "Educational Reels drive 3× more leads/1K than any other format. Create 2 more educational Reels this week using the \"[Number] [Topic] that [Benefit]\" pattern.",
        },
      ],
      actions: [
        { label: "View All Content", href: "/analytics/content" },
        { label: "Create Similar Post", href: "#" },
      ],
    },
  },
  "compare": {
    role: "assistant",
    content: "Here's your side-by-side 30-day comparison:",
    customDashboard: {
      title: "30-Day Comparison",
      subtitle: "Current period vs. previous 30 days",
      sections: [
        {
          type: "table",
          title: "Key Metrics",
          headers: ["Metric", "Last 30d", "Prior 30d", "Change"],
          rows: [
            { cells: ["Leads", "342", "290", "+17.9%"] },
            { cells: ["Touch Rate", "16%", "12%", "+33.3%"] },
            { cells: ["Revenue", "$12,400", "$10,200", "+21.6%"] },
            { cells: ["Top Content Type", "Ed. Reels", "BTS Reels", "Format shift"] },
            { cells: ["Top Flow", "Welcome Seq.", "Lead Magnet", "Shifted"] },
          ],
        },
        {
          type: "insight",
          text: "Your shift to educational Reels drove the leads growth. Quiz flow now outperforms Welcome. Keep investing in educational content format — it's your highest-converting type.",
        },
      ],
      actions: [
        { label: "View Full Comparison", href: "/analytics/comparison" },
        { label: "Export Report", href: "#" },
      ],
    },
  },
  "content_create": {
    role: "assistant",
    content: "Based on what's working for you right now, here's your content plan for this week:",
    customDashboard: {
      title: "Your Content Playbook — This Week",
      subtitle: "AI-generated based on your top-performing posts",
      sections: [
        {
          type: "insight",
          text: "Educational Reels are your #1 lead driver at 13.4 leads/1K reach — that's 3× better than any other format. You've only posted 3 this month. Double down.",
        },
        {
          type: "table",
          title: "Content to Create This Week",
          headers: ["#", "Format", "Topic Idea", "Why"],
          rows: [
            { cells: ["1", "Educational Reel", "\"5 [niche] mistakes costing you sales\"", "Mistake-format Reels got 18.4 leads/1K for you"] },
            { cells: ["2", "Educational Reel", "\"3 automations every creator needs\"", "Automation content drives 3× saves vs BTS"] },
            { cells: ["3", "Carousel", "\"Step-by-step: set up your first DM funnel\"", "Your carousels avg 14.2 leads/1K — strong"] },
            { cells: ["4", "Story (CTA)", "\"Reply GUIDE for the free template\"", "Story CTAs drove 122 leads from 12K reach"] },
          ],
        },
        {
          type: "table",
          title: "Winning Patterns from Your Data",
          headers: ["Pattern", "Avg Leads/1K", "Example"],
          rows: [
            { cells: ["\"[Number] [topic] that [benefit]\"", "18.4", "\"5 DM hacks that grew my list 3x\""] },
            { cells: ["\"Free [resource] — comment [KEYWORD]\"", "14.2", "\"Free template — comment GUIDE\""] },
            { cells: ["\"How I [achievement]\"", "11.7", "\"How I automate my entire biz\""] },
            { cells: ["\"Stop doing [mistake]\"", "7.4", "\"Stop doing this with your DMs\""] },
          ],
        },
        {
          type: "insight",
          text: "Pro tip: Make sure automation is set up BEFORE posting. Your top post had 92% coverage and generated 447 leads. Posts with 0% coverage waste high-intent traffic.",
        },
      ],
      actions: [
        { label: "View Content Analytics", href: "/analytics/content" },
        { label: "See Top Posts", href: "/analytics/content" },
      ],
    },
  },
  "grow_audience": {
    role: "assistant",
    content: "Here's how to accelerate your audience growth based on what's already working:",
    customDashboard: {
      title: "Audience Growth Accelerator",
      subtitle: "AI-generated plan based on your follower data",
      sections: [
        {
          type: "metrics",
          title: "Where You Stand",
          metrics: [
            { label: "New Followers", value: "+1,840", comparison: "+14.7% this period", trend: "up" },
            { label: "Follower → Lead Rate", value: "24.3%", comparison: "vs 8.7% existing audience", trend: "up" },
            { label: "Untapped Reach", value: "~45K", comparison: "from unautomated posts", trend: "down" },
          ],
        },
        {
          type: "table",
          title: "Growth Actions by Impact",
          headers: ["#", "Action", "Est. New Followers", "Effort"],
          rows: [
            { cells: ["1", "Post 2 educational Reels/week (your top format)", "+300–500/week", "3 hours"] },
            { cells: ["2", "Add comment triggers to high-reach posts", "+150–200/week", "1 hour"] },
            { cells: ["3", "Run a \"comment KEYWORD\" giveaway Reel", "+500–800 one-time", "2 hours"] },
            { cells: ["4", "Cross-promote in Stories with reply triggers", "+100–200/week", "30 min/day"] },
            { cells: ["5", "Collaborate with a creator in your niche", "+200–400 one-time", "3 hours"] },
          ],
        },
        {
          type: "insight",
          text: "Your new followers convert at 24.3% — nearly 3× better than your existing audience. Every new follower is worth roughly $2.10 in revenue based on your current funnel. Focus on volume AND quality.",
        },
      ],
      actions: [
        { label: "View Audience Analytics", href: "/analytics/audience" },
        { label: "See Top Content by Followers", href: "/analytics/audience" },
      ],
    },
  },
  "revenue": {
    role: "assistant",
    content: "Here's your fastest path to more revenue, ranked by impact and effort:",
    customDashboard: {
      title: "Revenue Growth Roadmap",
      subtitle: "Prioritized actions to increase revenue this month",
      sections: [
        {
          type: "metrics",
          title: "Revenue Snapshot",
          metrics: [
            { label: "Current Revenue", value: "$12.4K", comparison: "+21.6% vs last period", trend: "up" },
            { label: "Revenue per Lead", value: "$36.26", comparison: "from 342 leads", trend: "neutral" },
            { label: "Lost Revenue (est.)", value: "$4.2K/mo", comparison: "from broken flows + gaps", trend: "down" },
          ],
        },
        {
          type: "table",
          title: "Revenue Actions — Fastest to Slowest",
          headers: ["#", "Action", "Est. Revenue Impact", "Time to Impact"],
          rows: [
            { cells: ["1", "Fix Welcome Flow (crashed to 20%)", "+$800/week", "Today"] },
            { cells: ["2", "Fix entry point 'IG Comments: 🔥'", "+$1,500/month", "Today"] },
            { cells: ["3", "Add automation to 3 high-save Reels", "+$2,700/month", "This week"] },
            { cells: ["4", "Optimize Comment-to-DM conversion (6.4% → 12%)", "+$1,200/month", "This week"] },
            { cells: ["5", "Build story reply automation", "+$1,050/month", "This week"] },
          ],
        },
        {
          type: "insight",
          text: "If you complete all 5 actions, estimated total revenue uplift is ~$7,250/month (+58%). Actions 1-2 alone can be done today and recover $3,100/month in lost revenue.",
        },
      ],
      actions: [
        { label: "View Revenue Analytics", href: "/analytics/conversion" },
        { label: "Fix Broken Flows", href: "/analytics/automation" },
      ],
    },
  },
};

const SUGGESTED_QUERIES = [
  "How do I get more leads this week?",
  "What content should I create next?",
  "How can I grow my audience faster?",
  "Which of my automations need fixing?",
  "What's my fastest path to more revenue?",
];

export function getMockSuggestedQueries(): string[] {
  return SUGGESTED_QUERIES;
}

export function getMockChatResponse(userMessage: string): AiChatMessage {
  const lower = userMessage.toLowerCase();

  if (lower.includes("content") || lower.includes("create") || lower.includes("post") || lower.includes("reel")) {
    return MOCK_CHAT_RESPONSES["content_create"]!;
  }
  if (lower.includes("grow") || lower.includes("audience") || lower.includes("follower")) {
    return MOCK_CHAT_RESPONSES["grow_audience"]!;
  }
  if (lower.includes("revenue") || lower.includes("money") || lower.includes("sales") || lower.includes("income")) {
    return MOCK_CHAT_RESPONSES["revenue"]!;
  }
  if (lower.includes("lead") || lower.includes("week") || lower.includes("playbook")) {
    return MOCK_CHAT_RESPONSES["leads"]!;
  }
  if (lower.includes("flow") || lower.includes("automation") || lower.includes("fix")) {
    return MOCK_CHAT_RESPONSES["flows"]!;
  }
  if (lower.includes("whatsapp")) {
    return MOCK_CHAT_RESPONSES["whatsapp"]!;
  }
  if (lower.includes("compare") || lower.includes("vs") || lower.includes("previous")) {
    return MOCK_CHAT_RESPONSES["compare"]!;
  }

  return {
    role: "assistant",
    content: `Based on your current analytics data, here's what I found:\n\nYour account is performing well overall — 342 leads this period (+18%), with a 16% touch rate. However, there are two areas that need attention:\n\n1. **Re-engagement Drip** completion crashed from 80% → 20%. This is likely costing ~$2,400/month.\n2. **3 high-reach Reels** have 0% automation coverage, representing ~90 missed leads.\n\nWould you like me to dive deeper into either of these issues, or build a custom dashboard for a specific topic?`,
    customDashboard: null,
  };
}

// ─────────────────────────────────────────────────────────
// Home Page: Highlights, Actions, Recommendations
// ─────────────────────────────────────────────────────────

export type HomeHighlight = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  href: string;
};

export type HomeActionItem = {
  id: string;
  severity: "critical" | "warning" | "opportunity";
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  href: string;
};

export type HomeRecommendation = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  effort: string;
  impact: string;
  href: string;
};

export function getMockHomeHighlights(): HomeHighlight[] {
  return [
    { id: "h-1", label: "Leads", value: "342", change: "+18%", trend: "up", href: "/analytics" },
    { id: "h-2", label: "Touch Rate", value: "16%", change: "+33%", trend: "up", href: "/analytics" },
    { id: "h-3", label: "Revenue", value: "$12.4K", change: "+21.6%", trend: "up", href: "/analytics/conversion" },
    { id: "h-4", label: "Active Flows", value: "5", change: "2 need attention", trend: "down", href: "/analytics/automation" },
    { id: "h-5", label: "Followers", value: "+1,840", change: "+14.7%", trend: "up", href: "/analytics/audience" },
    { id: "h-6", label: "Time Saved", value: "127h", change: "this period", trend: "neutral", href: "/analytics" },
  ];
}

export function getMockHomeActions(): HomeActionItem[] {
  return [
    {
      id: "a-1",
      severity: "critical",
      title: "Welcome Flow completion crashed to 20%",
      description: "Step 3 ('CTA') is failing silently. Completion dropped from 80% yesterday.",
      impact: "Est. –$800/week in lost conversions",
      actionLabel: "Fix now",
      href: "/analytics/automation",
    },
    {
      id: "a-2",
      severity: "critical",
      title: "Entry point 'IG Comments: 🔥' stopped firing",
      description: "0 triggers in last 24h vs. 50/day average. Likely a keyword mismatch.",
      impact: "Est. 50 missed leads/day",
      actionLabel: "Investigate",
      href: "/analytics/automation",
    },
    {
      id: "a-3",
      severity: "warning",
      title: "Lead Magnet conversion dropping fast",
      description: "Conversion rate fell 15% → 6% in 48 hours. Something changed Tuesday.",
      impact: "Est. –$320/week if trend continues",
      actionLabel: "Review",
      href: "/analytics/automation",
    },
    {
      id: "a-4",
      severity: "opportunity",
      title: "3 Reels with 200+ saves have 0% automation",
      description: "High-intent content is not connected to any flow. Strong save-to-reach ratios.",
      impact: "~90 missed leads, ~$2,700 potential",
      actionLabel: "Build automation",
      href: "/analytics/content",
    },
    {
      id: "a-5",
      severity: "opportunity",
      title: "Story replies averaging 120/day with no automation",
      description: "Story reply triggers are not configured. Each reply is a warm lead going cold.",
      impact: "~35 leads/week, ~$1,050 potential",
      actionLabel: "Set up triggers",
      href: "/analytics/content",
    },
  ];
}

export function getMockHomeRecommendations(): HomeRecommendation[] {
  return [
    {
      id: "r-1",
      emoji: "🎬",
      title: "Create 2 educational Reels this week",
      description: "Educational Reels drive 3× more leads/1K reach than BTS. Use the \"[Number] [Topic] that [Benefit]\" format that worked for your top post.",
      effort: "2–3 hours",
      impact: "+50–80 leads",
      href: "/analytics/content",
    },
    {
      id: "r-2",
      emoji: "🔧",
      title: "Fix Welcome Flow Step 2 immediately",
      description: "60% drop-off at this step is 3× worse than your typical steps. Shorten the video message or add a text fallback.",
      effort: "30 minutes",
      impact: "+80 leads/week",
      href: "/analytics/automation",
    },
    {
      id: "r-3",
      emoji: "📩",
      title: "Automate story replies for top 3 Reels",
      description: "Your top Reels get 120+ story replies daily with zero automation. Set up reply triggers to capture this warm traffic.",
      effort: "1 hour",
      impact: "+8% touch rate",
      href: "/analytics/content",
    },
    {
      id: "r-4",
      emoji: "🤖",
      title: "Build a refund FAQ flow",
      description: "60% of refund requests escalate to human. A simple FAQ flow would handle most cases automatically.",
      effort: "2 hours",
      impact: "Save 4h/week",
      href: "/analytics/automation",
    },
    {
      id: "r-5",
      emoji: "📊",
      title: "A/B test your Comment-to-DM response",
      description: "This flow has 8,500 entries but only 6.4% conversion. Testing a shorter, punchier DM could double the rate.",
      effort: "45 minutes",
      impact: "+340 conversions",
      href: "/analytics/automation",
    },
  ];
}

// ─────────────────────────────────────────────────────────
// Home Page: Profile & Active Automations
// ─────────────────────────────────────────────────────────

export type HomeProfile = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  posts: number;
  followers: string;
  following: number;
  goal: string;
};

export function getMockHomeProfile(): HomeProfile {
  return {
    username: "ashleybrook",
    displayName: "Ashley Brook",
    avatarUrl: null,
    bio: "Content Creator · NYC",
    posts: 312,
    followers: "24.5K",
    following: 891,
    goal: "Grow Followers",
  };
}

export type HomeInsightCard = {
  id: string;
  tag: "opportunity" | "going_viral" | "needs_fix";
  title: string;
  description: string;
  stat: string;
  actionLabel: string;
  href: string;
};

export function getMockHomeInsights(): HomeInsightCard[] {
  return [
    {
      id: "ins-1",
      tag: "opportunity",
      title: "Your last 2 collabs converted 3x more followers",
      description: "Collab with @stylebyjenna and @fitcoachmia drove 1,247 follows vs your 400 avg.",
      stat: "~500 followers/mo untapped",
      actionLabel: "Build outreach flow",
      href: "/analytics/audience",
    },
    {
      id: "ins-2",
      tag: "going_viral",
      title: "\"Morning Routine\" Reel hit 52K views with no automation",
      description: "52K views, 1.2K saves, but only 89 follows. No follow-to-DM set up.",
      stat: "Est. ~300 missed followers",
      actionLabel: "Set up automation",
      href: "/analytics/content",
    },
    {
      id: "ins-3",
      tag: "needs_fix",
      title: "Your bio is losing you ~200 followers every week",
      description: "Profile visits up 23% but follow rate dropped 4.2% → 1.8%.",
      stat: "~200 missed followers/week",
      actionLabel: "Fix bio CTA",
      href: "/analytics/audience",
    },
  ];
}

export type ActiveAutomation = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  icon: "users" | "message";
  updatedAgo: string;
  triggered: number;
  replied: number;
  converted: number;
};

export function getMockActiveAutomations(): ActiveAutomation[] {
  return [
    {
      id: "auto-1",
      name: "Welcome new followers",
      description: "New follower → Send welcome DM",
      status: "active",
      icon: "users",
      updatedAgo: "2 weeks ago",
      triggered: 1247,
      replied: 892,
      converted: 234,
    },
    {
      id: "auto-2",
      name: "Comment keyword → DM",
      description: "Comment with 🔥 → Send product link via DM",
      status: "active",
      icon: "message",
      updatedAgo: "5 days ago",
      triggered: 456,
      replied: 312,
      converted: 89,
    },
    {
      id: "auto-3",
      name: "Lead Magnet Delivery",
      description: "Comment GUIDE → Send PDF via DM",
      status: "paused",
      icon: "message",
      updatedAgo: "3 weeks ago",
      triggered: 780,
      replied: 620,
      converted: 198,
    },
  ];
}
