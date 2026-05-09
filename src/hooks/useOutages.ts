import { useState, useEffect, useCallback } from "react";
import { outagesApi } from "../api";
import { Outage } from "../types";
import { useAppStore } from "../store/useAppStore";

export function useOutages() {
  const [outages, setOutages]           = useState<Outage[]>([]);
  const [activeOutages, setActive]      = useState<Outage[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const selectedNeighborhoods           = useAppStore((s) => s.selectedNeighborhoods);

  const fetch_ = useCallback(async () => {
    setError(null);
    try {
      const ids = selectedNeighborhoods.map((n) => n.id);

      if (ids.length === 0) {
        const [upcoming, active] = await Promise.all([
          outagesApi.list({ upcoming: true }),
          outagesApi.active(),
        ]);
        setOutages(upcoming);
        setActive(active);
      } else {
        const [results, active] = await Promise.all([
          Promise.all(ids.map((id) => outagesApi.list({ neighborhood_id: id, upcoming: true }))),
          outagesApi.active(),
        ]);
        const merged = results
          .flat()
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        setOutages(merged);
        setActive(active);
      }
    } catch (e: any) {
      setError(e?.message ?? "error");
    } finally {
      setLoading(false);
    }
  }, [selectedNeighborhoods]);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, 60_000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { outages, activeOutages, loading, error, refetch: fetch_ };
}
