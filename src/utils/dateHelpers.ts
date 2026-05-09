import { Language } from "../types";

export function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("pt-AO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

export function formatDate(iso: string, lang: Language = "pt"): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "pt" ? "pt-AO" : "en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "—";
  }
}

export function getDurationMinutes(start: string, end: string): number {
  return Math.max(
    0,
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  );
}

export function getRelativeTime(iso: string, lang: Language = "pt"): string {
  try {
    const diff = new Date(iso).getTime() - Date.now();
    const abs  = Math.abs(diff);
    const mins  = Math.floor(abs / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    const future = diff > 0;

    if (lang === "pt") {
      if (days  > 0) return future ? `em ${days}d`   : `há ${days}d`;
      if (hours > 0) return future ? `em ${hours}h`  : `há ${hours}h`;
      return          future ? `em ${mins}min` : `há ${mins}min`;
    } else {
      if (days  > 0) return future ? `in ${days}d`   : `${days}d ago`;
      if (hours > 0) return future ? `in ${hours}h`  : `${hours}h ago`;
      return          future ? `in ${mins}min` : `${mins}min ago`;
    }
  } catch {
    return "—";
  }
}

export function isOngoing(start: string, end: string): boolean {
  const now = Date.now();
  return new Date(start).getTime() <= now && new Date(end).getTime() >= now;
}

export function isUpcoming(start: string): boolean {
  return new Date(start).getTime() > Date.now();
}

export function getGreeting(lang: Language): string {
  const h = new Date().getHours();
  if (lang === "pt") {
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  } else {
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }
}
