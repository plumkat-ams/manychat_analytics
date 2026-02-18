import type { ACQUISITION_SOURCES, CONTENT_TYPES } from "@/lib/constants";

export type AcquisitionSource = (typeof ACQUISITION_SOURCES)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];

export type MetricCardData = {
  label: string;
  value: number;
  previousValue: number;
  format: "number" | "percent" | "currency";
  sparklineData: number[];
};

export type DateRangeOption = {
  label: string;
  value: string;
  from: Date;
  to: Date;
};

export type FlowHealth = "green" | "yellow" | "red";

export type EngagementSegment = "hot" | "warm" | "cold";

export type ChartDataPoint = {
  date: string;
  [key: string]: string | number;
};

export type SubscriberGrowth = {
  date: string;
  newSubscribers: number;
  unsubscribed: number;
  net: number;
};

export type AcquisitionBreakdown = {
  source: AcquisitionSource;
  count: number;
  percentage: number;
};

export type PostPerformance = {
  id: string;
  instagramId: string;
  thumbnailUrl: string | null;
  caption: string | null;
  contentType: ContentType;
  publishedAt: Date;
  reach: number;
  impressions: number;
  engagement: number;
  engagementRate: number;
  saves: number;
  shares: number;
  comments: number;
  likes: number;
  dmConversions: number;
  performanceScore: number;
};

export type FlowPerformance = {
  id: string;
  name: string;
  triggerCount: number;
  openRate: number;
  clickRate: number;
  dropOffRate: number;
  unsubscribeRate: number;
  health: FlowHealth;
  weekOverWeekChange: number;
};

export type FlowStep = {
  stepNumber: number;
  name: string;
  type: string;
  reached: number;
  completed: number;
  dropOff: number;
};

export type ConversionFunnel = {
  stage: string;
  count: number;
  rate: number;
};

export type RevenueAttribution = {
  flowId: string;
  flowName: string;
  conversions: number;
  revenue: number;
  percentage: number;
};

export type CohortRow = {
  cohortWeek: string;
  totalUsers: number;
  retention: number[]; // percentage retained per week
};

export type PostingTimeData = {
  day: number; // 0-6
  hour: number; // 0-23
  engagementRate: number;
  postCount: number;
};

export type ComparisonMetric = {
  metric: string;
  valueA: number;
  valueB: number;
  format: "number" | "percent" | "currency";
};

export type GoalProgress = {
  metric: string;
  target: number;
  current: number;
  projected: number;
  format: "number" | "percent" | "currency";
};
