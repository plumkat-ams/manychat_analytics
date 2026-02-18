export const MANYCHAT_API_BASE = "https://api.manychat.com/fb";
export const MANYCHAT_RATE_LIMIT = 8; // requests per second

export const INSTAGRAM_API_BASE = "https://graph.instagram.com/v21.0";

export const CHART_COLORS = {
  primary: "hsl(209, 100%, 50%)",
  secondary: "hsl(180, 55%, 45%)",
  tertiary: "hsl(250, 60%, 58%)",
  quaternary: "hsl(35, 85%, 55%)",
  quinary: "hsl(340, 75%, 55%)",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 84%, 60%)",
} as const;

export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
];

export const ENGAGEMENT_SEGMENTS = {
  hot: { label: "Hot", color: CHART_COLORS.danger, minDays: 0, maxDays: 7 },
  warm: { label: "Warm", color: CHART_COLORS.warning, minDays: 8, maxDays: 30 },
  cold: { label: "Cold", color: CHART_COLORS.secondary, minDays: 31, maxDays: Infinity },
} as const;

export const CONTENT_TYPES = ["IMAGE", "VIDEO", "CAROUSEL_ALBUM", "REEL", "STORY"] as const;

export const FLOW_HEALTH = {
  green: { label: "Healthy", minRate: 0.7 },
  yellow: { label: "Needs Attention", minRate: 0.4 },
  red: { label: "Critical", minRate: 0 },
} as const;

export const ACQUISITION_SOURCES = [
  "instagram_dm",
  "instagram_comment",
  "instagram_story_reply",
  "landing_page",
  "qr_code",
  "referral",
  "manual",
  "api",
  "other",
] as const;

export const SYNC_INTERVALS = {
  subscribers: 15 * 60 * 1000, // 15 minutes
  flows: 60 * 60 * 1000, // 1 hour
  instagramPosts: 30 * 60 * 1000, // 30 minutes
  instagramInsights: 60 * 60 * 1000, // 1 hour
} as const;
