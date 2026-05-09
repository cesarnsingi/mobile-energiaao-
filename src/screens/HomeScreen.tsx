import React, { useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOutages } from "../hooks/useOutages";
import { useNotifications } from "../hooks/useNotifications";
import { useTranslation } from "../hooks/useTranslation";
import { useAppStore } from "../store/useAppStore";
import { reportsApi } from "../api";
import { OutageCard } from "../components/OutageCard";
import { PowerStatusBanner } from "../components/PowerStatusBanner";
import { EmptyState } from "../components/EmptyState";
import { colors, spacing } from "../utils/theme";
import { getGreeting } from "../utils/dateHelpers";

export default function HomeScreen() {
  const { t, language }                   = useTranslation();
  const { outages, activeOutages, loading, error, refetch } = useOutages();
  const { selectedNeighborhoods, pushToken } = useAppStore();
  const [reporting, setReporting]         = useState(false);

  // Register push notifications (safe — no-ops on simulator)
  useNotifications();

  async function handleReport() {
    if (selectedNeighborhoods.length === 0) {
      Alert.alert("", t("noNeighborhoodSelected"));
      return;
    }
    setReporting(true);
    try {
      await reportsApi.create({
        neighborhood_id: selectedNeighborhoods[0].id,
        reporter_token:  pushToken ?? undefined,
      });
      Alert.alert("✅", t("outageReported"));
    } catch (e: any) {
      Alert.alert(
        t("errorLoading"),
        e?.message === "network" ? t("networkError") : t("errorLoading")
      );
    } finally {
      setReporting(false);
    }
  }

  const upcoming = outages.slice(0, 5);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{getGreeting(language)}</Text>
            <Text style={s.appName}>EnergiaAO</Text>
          </View>
          <View style={s.logoWrap}>
            <Ionicons name="flash" size={24} color={colors.primary} />
          </View>
        </View>

        {/* Power status */}
        <PowerStatusBanner activeOutages={activeOutages} />

        {/* Upcoming section */}
        <Text style={s.sectionTitle}>{t("upcomingOutages")}</Text>

        {error ? (
          <EmptyState
            icon="cloud-offline-outline"
            message={t("networkError")}
            actionLabel={t("retry")}
            onAction={refetch}
          />
        ) : !loading && upcoming.length === 0 ? (
          <EmptyState
            icon="checkmark-circle-outline"
            message={t("noUpcomingOutages")}
          />
        ) : (
          <View style={s.list}>
            {upcoming.map((o) => (
              <OutageCard key={o.id} outage={o} />
            ))}
          </View>
        )}

        {/* Report button */}
        <TouchableOpacity
          style={[s.reportBtn, reporting && { opacity: 0.6 }]}
          onPress={handleReport}
          disabled={reporting}
          activeOpacity={0.85}
        >
          <Ionicons name="warning-outline" size={18} color="#000" />
          <Text style={s.reportText}>{t("reportOutage")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.background },
  scroll:      { flex: 1 },
  content:     { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting:    { fontSize: 12, color: colors.textSecondary },
  appName:     { fontSize: 26, fontWeight: "800", color: colors.primary },
  logoWrap:    { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceElevated, alignItems: "center", justifyContent: "center" },
  sectionTitle:{ fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  list:        { gap: spacing.sm },
  reportBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, padding: spacing.md, borderRadius: 14, gap: spacing.sm, marginTop: spacing.sm },
  reportText:  { fontSize: 16, fontWeight: "700", color: "#000" },
});
