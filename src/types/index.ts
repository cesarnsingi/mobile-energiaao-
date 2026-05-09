export type Language = "pt" | "en";

export interface Neighborhood {
  id: number;
  name_pt: string;
  name_en: string;
  municipality: string;
  latitude: number;
  longitude: number;
  zone_code: string;
  is_active: boolean;
}

export interface Outage {
  id: number;
  neighborhood_id: number;
  neighborhood: Neighborhood;
  start_time: string;
  end_time: string;
  outage_type: "planned" | "unplanned" | "maintenance";
  reason_pt: string | null;
  reason_en: string | null;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  created_at: string;
}

export interface OutageReport {
  id: number;
  neighborhood_id: number;
  description: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export type OutageStatus = Outage["status"];
export type OutageType = Outage["outage_type"];
