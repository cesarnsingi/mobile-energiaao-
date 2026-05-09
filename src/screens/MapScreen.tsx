import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Platform, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { outagesApi } from "../api";
import { Outage } from "../types";
import { colors, spacing, radius } from "../utils/theme";
import { useTranslation } from "../hooks/useTranslation";
import { formatTime, isOngoing, isUpcoming } from "../utils/dateHelpers";

// Luanda center
const LUANDA = { latitude: -8.8368, longitude: 13.2343, latitudeDelta: 0.15, longitudeDelta: 0.15 };

function getMarkerColor(o: Outage) {
  if (isOngoing(o.start_time, o.end_time)) return colors.danger;
  if (isUpcoming(o.start_time))            return colors.primary;
  return colors.textMuted;
}

export default function MapScreen() {
  const { t, language }             = useTranslation();
  const [outages, setOutages]       = useState<Outage[]>([]);
  const [selected, setSelected]     = useState<Outage | null>(null);
  const [loading, setLoading]       = useState(true);
  const [mapAvailable, setMapAvail] = useState(true);
  const MapView = useRef<any>(null);
  const Marker  = useRef<any>(null);
  const Circle  = useRef<any>(null);

  useEffect(() => {
    // Try to import react-native-maps; it may not work in Expo Go on all platforms
    import("react-native-maps")
      .then((mod) => {
        MapView.current = mod.default;
        Marker.current  = mod.Marker;
        Circle.current  = mod.Circle;
      })
      .catch(() => setMapAvail(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([outagesApi.active(), outagesApi.list({ upcoming: true })])
      .then(([active, upcoming]) => {
        if (cancelled) return;
        const ids = new Set(active.map((o: Outage) => o.id));
        const all = [...active, ...upcoming.filter((o: Outage) => !ids.has(o.id))];
        setOutages(all);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Fallback list view when map is not available (Expo Go simulator)
  if (!mapAvailable) {
    return (
      <SafeAreaView style={s.safe} edges={["top"]}>
        <View style={s.header}>
          <Text style={s.title}>{t("mapTitle")}</Text>
          <Text style={s.sub}>{outages.length} {t("affectedAreas")}</Text>
        </View>
        {loading ? (
          <View style={s.center}><ActivityIndicator color={colors.primary} size="large" /></View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}>
            {outages.map((o) => {
              const name  = language === "pt" ? o.neighborhood.name_pt : o.neighborhood.name_en;
              const color = getMarkerColor(o);
              return (
                <View key={o.id} style={[s.listCard, { borderLeftColor: color }]}>
                  <View style={s.listRow}>
                    <Ionicons name="location" size={14} color={color} />
                    <Text style={s.listName}>{name}</Text>
                    <View style={[s.dot, { backgroundColor: color }]} />
                  </View>
                  <Text style={s.listTime}>
                    {formatTime(o.start_time)} – {formatTime(o.end_time)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  const RNMapView = MapView.current;
  const RNMarker  = Marker.current;
  const RNCircle  = Circle.current;

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>{t("mapTitle")}</Text>
        <Text style={s.sub}>{outages.length} {t("affectedAreas")}</Text>
      </View>

      {loading && (
        <View style={s.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {!loading && RNMapView ? (
        <RNMapView
          style={s.map}
          initialRegion={LUANDA}
          mapType="dark"
        >
          {outages.map((o) => {
            const color = getMarkerColor(o);
            const name  = language === "pt" ? o.neighborhood.name_pt : o.neighborhood.name_en;
            return (
              <React.Fragment key={o.id}>
                {RNCircle && (
                  <RNCircle
                    center={{ latitude: o.neighborhood.latitude, longitude: o.neighborhood.longitude }}
                    radius={600}
                    fillColor={`${color}30`}
                    strokeColor={`${color}80`}
                    strokeWidth={1}
                  />
                )}
                {RNMarker && (
                  <RNMarker
                    coordinate={{ latitude: o.neighborhood.latitude, longitude: o.neighborhood.longitude }}
                    title={name}
                    description={`${formatTime(o.start_time)} – ${formatTime(o.end_time)}`}
                    pinColor={color}
                    onPress={() => setSelected(o)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </RNMapView>
      ) : null}

      {/* Legend */}
      <View style={s.legend}>
        {[{ label: t("ongoing"), color: colors.danger }, { label: t("upcoming"), color: colors.primary }].map((l) => (
          <View key={l.label} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: l.color }]} />
            <Text style={s.legendText}>{l.label}</Text>
          </View>
        ))}
      </View>

      {/* Detail sheet */}
      {selected && (
        <View style={s.sheet}>
          <TouchableOpacity style={s.sheetClose} onPress={() => setSelected(null)}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={s.sheetName}>
            {language === "pt" ? selected.neighborhood.name_pt : selected.neighborhood.name_en}
          </Text>
          <Text style={s.sheetTime}>
            {formatTime(selected.start_time)} → {formatTime(selected.end_time)}
          </Text>
          {selected.reason_pt ? (
            <Text style={s.sheetReason}>
              {language === "pt" ? selected.reason_pt : selected.reason_en}
            </Text>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.background },
  header:     { padding: spacing.md, paddingBottom: spacing.sm },
  title:      { fontSize: 24, fontWeight: "800", color: colors.textPrimary },
  sub:        { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  map:        { flex: 1 },
  center:     { flex: 1, alignItems: "center", justifyContent: "center" },
  legend:     { position: "absolute", top: 100, right: spacing.md, backgroundColor: `${colors.surface}F2`, borderRadius: radius.md, padding: spacing.sm, gap: spacing.xs, borderWidth: 1, borderColor: colors.border },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: colors.textSecondary, fontWeight: "600" },
  sheet:      { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, paddingBottom: spacing.xxl, borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  sheetClose: { alignSelf: "flex-end", padding: spacing.xs },
  sheetName:  { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  sheetTime:  { fontSize: 16, fontWeight: "600", color: colors.primary },
  sheetReason:{ fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  // Fallback list styles
  listCard:   { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderLeftWidth: 4, borderWidth: 1, borderColor: colors.border },
  listRow:    { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  listName:   { fontSize: 15, fontWeight: "700", color: colors.textPrimary, flex: 1 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  listTime:   { fontSize: 13, color: colors.textSecondary },
});
