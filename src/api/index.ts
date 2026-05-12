import axios, { AxiosError } from "axios";
import Constants from "expo-constants";
import { MOCK_NEIGHBORHOODS, getMockOutages } from "../utils/mockData";
import { Neighborhood, Outage } from "../types";

// Priority: env var → app.json extra → Android emulator default
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  "http://10.0.2.2:8000/api/v1";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: { "Content-Type": "application/json" },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isNetworkError(e: unknown): boolean {
  return axios.isAxiosError(e) && !e.response;
}

// ─── Neighborhoods ────────────────────────────────────────────────────────────

export const neighborhoodsApi = {
  async list(): Promise<Neighborhood[]> {
    try {
      const { data } = await client.get<Neighborhood[]>("/neighborhoods/");
      return data;
    } catch (e) {
      console.warn("[API] neighborhoods fallback to mock:", (e as AxiosError).message);
      return MOCK_NEIGHBORHOODS;
    }
  },
};

// ─── Outages ──────────────────────────────────────────────────────────────────

export const outagesApi = {
  async list(params?: {
    neighborhood_id?: number;
    status?: string;
    upcoming?: boolean;
  }): Promise<Outage[]> {
    try {
      const { data } = await client.get<Outage[]>("/outages/", { params });
      return data;
    } catch (e) {
      console.warn("[API] outages fallback to mock:", (e as AxiosError).message);
      let mock = getMockOutages();
      if (params?.upcoming) mock = mock.filter((o) => new Date(o.start_time) > new Date());
      if (params?.neighborhood_id) mock = mock.filter((o) => o.neighborhood_id === params.neighborhood_id);
      if (params?.status) mock = mock.filter((o) => o.status === params.status);
      return mock;
    }
  },

  async active(): Promise<Outage[]> {
    try {
      const { data } = await client.get<Outage[]>("/outages/active");
      return data;
    } catch {
      const now = Date.now();
      return getMockOutages().filter(
        (o) => new Date(o.start_time).getTime() <= now && new Date(o.end_time).getTime() >= now
      );
    }
  },
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reportsApi = {
  async create(payload: {
    neighborhood_id: number;
    description?: string;
    latitude?: number;
    longitude?: number;
    reporter_token?: string;
  }): Promise<void> {
    try {
      await client.post("/reports/", payload);
    } catch (e) {
      if (isNetworkError(e)) throw new Error("network");
      throw e;
    }
  },
};

// ─── Notifications ─────────────────────────────────────────────────────────────

export const notificationsApi = {
  async register(payload: {
    token: string;
    neighborhood_ids: number[];
    language: string;
  }): Promise<void> {
    try {
      await client.post("/notifications/register", payload);
    } catch (e) {
      // Non-fatal — app works without push registration
      console.warn("[API] push register failed:", (e as AxiosError).message);
    }
  },

  async unregister(token: string): Promise<void> {
    try {
      await client.delete(`/notifications/unregister/${token}`);
    } catch {
      // Non-fatal
    }
  },
};
