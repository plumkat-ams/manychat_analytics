import { MANYCHAT_API_BASE, MANYCHAT_RATE_LIMIT } from "@/lib/constants";

type ManychatResponse<T> = {
  status: "success" | "error";
  data: T;
};

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private maxTokens: number;
  private refillRate: number;

  constructor(maxPerSecond: number) {
    this.maxTokens = maxPerSecond;
    this.tokens = maxPerSecond;
    this.lastRefill = Date.now();
    this.refillRate = maxPerSecond;
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens <= 0) {
      const waitTime = (1000 / this.refillRate) * (1 - this.tokens);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.refill();
    }
    this.tokens -= 1;
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

export class ManychatClient {
  private apiToken: string;
  private rateLimiter: RateLimiter;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.rateLimiter = new RateLimiter(MANYCHAT_RATE_LIMIT);
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    await this.rateLimiter.acquire();

    const response = await fetch(`${MANYCHAT_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Manychat API error: ${response.status} ${response.statusText}`);
    }

    const data: ManychatResponse<T> = await response.json();
    if (data.status !== "success") {
      throw new Error("Manychat API returned error status");
    }

    return data.data;
  }

  async getPageInfo() {
    return this.request<{
      id: string;
      name: string;
      avatar: string;
      subscribers_count: number;
    }>("/page/getInfo");
  }

  async getSubscribers(limit: number = 100, offset: number = 0) {
    return this.request<{
      data: Array<{
        id: string;
        first_name: string;
        last_name: string;
        name: string;
        gender: string;
        profile_pic: string;
        locale: string;
        timezone: string;
        subscribed: string;
        last_interaction: string;
        tags: Array<{ id: string; name: string }>;
        custom_fields: Array<{ id: number; name: string; value: string }>;
      }>;
      total: number;
    }>(`/subscriber/getSubscribers?limit=${limit}&offset=${offset}`);
  }

  async getSubscriberInfo(subscriberId: string) {
    return this.request<{
      id: string;
      first_name: string;
      last_name: string;
      name: string;
      gender: string;
      profile_pic: string;
      locale: string;
      timezone: string;
      subscribed: string;
      last_interaction: string;
      tags: Array<{ id: string; name: string }>;
      custom_fields: Array<{ id: number; name: string; value: string }>;
    }>(`/subscriber/getInfo?subscriber_id=${subscriberId}`);
  }

  async getFlows() {
    return this.request<
      Array<{
        ns: string;
        name: string;
        type: string;
        trigger_keyword?: string;
      }>
    >("/flows");
  }

  async getTags() {
    return this.request<
      Array<{
        id: string;
        name: string;
        subscribers_count: number;
      }>
    >("/page/getTags");
  }

  async getCustomFields() {
    return this.request<
      Array<{
        id: number;
        name: string;
        type: string;
        description: string;
      }>
    >("/page/getCustomFields");
  }

  async getBotFields() {
    return this.request<
      Array<{
        id: number;
        name: string;
        type: string;
        value: string;
        description: string;
      }>
    >("/page/getBotFields");
  }
}
