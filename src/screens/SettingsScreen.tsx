import React from "react";
import {
  View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";
import { NeighborhoodPicker } from "../components/NeighborhoodPicker";
import { colors, spacing, radius } from "../utils/theme";
import { useTranslation } from "../hooks/useTranslation";
import { Language } from "../types";
import Constants from "expo-constants";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export default function SettingsScreen() {
  const { t, language }  = useTranslation();
  const {
    selectedNeighborhoods, addNeighborhood, removeNeighborhood,
    setLanguage, notificationsEnabled, setNotificationsEnabled,
  } = useAppStore();

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>{t("settingsTitle")}</Text>

        {/* Neighborhood */}
        <SectionLabel label={t("myNeighborhoods")} icon="location" />
        <NeighborhoodPicker
          selected={selectedNeighborhoods}
          onSelect={addNeighborhood}
          onRemove={removeNeighborhood}
        />

        {/* Language */}
        <SectionLabel label={t("language")} icon="language" />
        <View style={s.langRow}>
          {(["pt", "en"] as Language[]).map((l) => (
            <TouchableOpacity
              key={l}
              style={[s.langBtn, language === l && s.langBtnActive]}
              onPress={() => setLanguage(l)}
            >
              <Text style={[s.langText, language === l && s.langTextActive]}>
                {l === "pt" ? `🇵🇹  ${t("portuguese")}` : `🇬🇧  ${t("english")}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <SectionLabel label={t("notifications")} icon="notifications" />
        <View style={s.card}>
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={s.rowLabel}>{t("enableNotifications")}</Text>
              <Text style={s.rowDesc}>{t("notifDescription")}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? "#fff" : colors.textMuted}
            />
          </View>
        </View>

        {/* About */}
        <SectionLabel label={t("about")} icon="information-circle" />
        <View style={s.card}>
          <View style={[s.row, { justifyContent: "space-between" }]}>
            <Text style={s.rowLabel}>{t("version")}</Text>
            <Text style={s.rowValue}>{APP_VERSION}</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Ionicons name="flash" size={18} color={colors.primary} />
          <Text style={s.footerText}>EnergiaAO · Luanda, Angola 🇦🇴</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label, icon }: { label: string; icon: string }) {
  return (
    <View style={s.sectionLabel}>
      <Ionicons name={icon as any} size={13} color={colors.primary} />
      <Text style={s.sectionLabelText}>{label.toUpperCase()}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.background },
  content:        { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  title:          { fontSize: 26, fontWeight: "800", color: colors.textPrimary, marginBottom: spacing.sm },
  sectionLabel:   { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.sm },
  sectionLabelText:{ fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.2, textTransform: "uppercase" },
  card:           { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  row:            { flexDirection: "row", alignItems: "center", padding: spacing.md },
  rowLabel:       { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  rowDesc:        { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  rowValue:       { fontSize: 13, color: colors.primary, fontWeight: "600" },
  langRow:        { flexDirection: "row", gap: spacing.sm },
  langBtn:        { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  langBtnActive:  { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
  langText:       { fontSize: 14, color: colors.textSecondary },
  langTextActive: { color: colors.primary, fontWeight: "700" },
  footer:         { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.xl },
  footerText:     { fontSize: 12, color: colors.textMuted },
});
