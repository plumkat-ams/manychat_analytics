import { INSTAGRAM_API_BASE } from "@/lib/constants";
import { db } from "../db";
import { accounts } from "../db/schema";
import { eq } from "drizzle-orm";

export class InstagramClient {
  private accessToken: string;
  private accountId: string;
  private instagramAccountId: string;

  constructor(accessToken: string, accountId: string, instagramAccountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
    this.instagramAccountId = instagramAccountId;
  }

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${INSTAGRAM_API_BASE}${endpoint}`);
    url.searchParams.set("access_token", this.accessToken);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }

    const response = await fetch(url.toString());

    if (response.status === 401) {
      // Token might be expired, try to refresh
      await this.refreshToken();
      // Retry the request
      url.searchParams.set("access_token", this.accessToken);
      const retryResponse = await fetch(url.toString());
      if (!retryResponse.ok) {
        throw new Error(`Instagram API error: ${retryResponse.status}`);
      }
      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async refreshToken(): Promise<void> {
    const response = await fetch(
      `${INSTAGRAM_API_BASE}/oauth/access_token?grant_type=ig_refresh_token&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to refresh Instagram token");
    }

    const data = await response.json();
    this.accessToken = data.access_token;

    // Update token in database
    await db
      .update(accounts)
      .set({
        instagramAccessToken: data.access_token,
        instagramTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, this.accountId));
  }

  async getAccountInfo() {
    return this.request<{
      id: string;
      username: string;
      name: string;
      biography: string;
      followers_count: number;
      follows_count: number;
      media_count: number;
      profile_picture_url: string;
    }>(`/${this.instagramAccountId}`, {
      fields: "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url",
    });
  }

  async getAccountInsights(period: "day" | "week" | "days_28" = "day", since?: number, until?: number) {
    const params: Record<string, string> = {
      metric: "reach,impressions,profile_views,website_clicks,follower_count",
      period,
    };

    if (since) params.since = String(since);
    if (until) params.until = String(until);

    return this.request<{
      data: Array<{
        name: string;
        period: string;
        values: Array<{
          value: number;
          end_time: string;
        }>;
      }>;
    }>(`/${this.instagramAccountId}/insights`, params);
  }

  async getMedia(limit: number = 50, after?: string) {
    const params: Record<string, string> = {
      fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
      limit: String(limit),
    };
    if (after) params.after = after;

    return this.request<{
      data: Array<{
        id: string;
        caption?: string;
        media_type: string;
        media_url: string;
        thumbnail_url?: string;
        permalink: string;
        timestamp: string;
      }>;
      paging?: {
        cursors: { before: string; after: string };
        next?: string;
      };
    }>(`/${this.instagramAccountId}/media`, params);
  }

  async getMediaInsights(mediaId: string, mediaType: string) {
    const metrics =
      mediaType === "VIDEO" || mediaType === "REEL"
        ? "reach,impressions,engagement,saved,shares,likes,comments,video_views"
        : "reach,impressions,engagement,saved,shares,likes,comments";

    return this.request<{
      data: Array<{
        name: string;
        period: string;
        values: Array<{ value: number }>;
      }>;
    }>(`/${mediaId}/insights`, { metric: metrics });
  }

  async getAudienceDemographics() {
    return this.request<{
      data: Array<{
        name: string;
        period: string;
        values: Array<{
          value: Record<string, number>;
          end_time: string;
        }>;
      }>;
    }>(`/${this.instagramAccountId}/insights`, {
      metric: "audience_gender_age,audience_city,audience_country",
      period: "lifetime",
    });
  }
}
