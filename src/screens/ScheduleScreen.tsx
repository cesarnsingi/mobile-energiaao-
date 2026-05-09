import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { outagesApi } from "../api";
import { Outage } from "../types";
import { OutageCard } from "../components/OutageCard";
import { NeighborhoodPicker } from "../components/NeighborhoodPicker";
import { EmptyState } from "../components/EmptyState";
import { colors, spacing, radius } from "../utils/theme";
import { useTranslation } from "../hooks/useTranslation";
import { useAppStore } from "../store/useAppStore";
import { formatDate } from "../utils/dateHelpers";

type Filter = "upcoming" | "ongoing" | "completed";

export default function ScheduleScreen() {
  const { t, language }                             = useTranslation();
  const { selectedNeighborhoods, addNeighborhood, removeNeighborhood } = useAppStore();
  const [outages, setOutages]                       = useState<Outage[]>([]);
  const [loading, setLoading]                       = useState(true);
  const [filter, setFilter]                         = useState<Filter>("upcoming");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    outagesApi.list().then((data) => {
      if (!cancelled) { setOutages(data); setLoading(false); }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = outages.filter((o) => {
    const now   = Date.now();
    const start = new Date(o.start_time).getTime();
    const end   = new Date(o.end_time).getTime();
    if (filter === "upcoming")  return start > now;
    if (filter === "ongoing")   return start <= now && end >= now;
    if (filter === "completed") return end < now || o.status === "completed";
    return true;
  });

  // Group by date
  const grouped: Record<string, Outage[]> = {};
  filtered.forEach((o) => {
    const key = formatDate(o.start_time, language);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(o);
  });
  const sections = Object.entries(grouped);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "upcoming",  label: t("upcoming")  },
    { key: "ongoing",   label: t("ongoing")   },
    { key: "completed", label: t("completed") },
  ];

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>{t("scheduleTitle")}</Text>
      </View>

      <View style={s.pickerWrap}>
        <NeighborhoodPicker
          selected={selectedNeighborhoods}
          onSelect={addNeighborhood}
          onRemove={removeNeighborhood}
        />
      </View>

      {/* Filter tabs */}
      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterTab, filter === f.key && s.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : sections.length === 0 ? (
        <EmptyState icon="calendar-outline" message={t("noUpcomingOutages")} />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={([date]) => date}
          contentContainerStyle={s.list}
          renderItem={({ item: [date, items] }) => (
            <View style={s.section}>
              <Text style={s.dateHeader}>{date}</Text>
              <View style={s.cards}>
                {items.map((o) => <OutageCard key={o.id} outage={o} />)}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: colors.background },
  header:          { padding: spacing.md, paddingBottom: 0 },
  title:           { fontSize: 24, fontWeight: "800", color: colors.textPrimary },
  pickerWrap:      { padding: spacing.md, paddingBottom: 0 },
  filterRow:       { flexDirection: "row", padding: spacing.md, gap: spacing.sm },
  filterTab:       { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:      { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
  filterTextActive:{ color: "#000", fontWeight: "700" },
  list:            { padding: spacing.md, gap: spacing.lg },
  section:         { gap: spacing.sm },
  dateHeader:      { fontSize: 11, fontWeight: "700", color: colors.primary, letterSpacing: 0.8, textTransform: "uppercase" },
  cards:           { gap: spacing.sm },
  center:          { flex: 1, alignItems: "center", justifyContent: "center" },
});
