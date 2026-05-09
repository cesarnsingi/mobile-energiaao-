import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Outage } from "../types";
import { colors, spacing, radius } from "../utils/theme";
import { StatusBadge } from "./StatusBadge";
import { formatTime, formatDate, getDurationMinutes, getRelativeTime, isOngoing } from "../utils/dateHelpers";
import { useTranslation } from "../hooks/useTranslation";

interface Props {
  outage:  Outage;
  onPress?: () => void;
  style?:  ViewStyle;
}

export function OutageCard({ outage, onPress, style }: Props) {
  const { t, language } = useTranslation();
  const ongoing   = isOngoing(outage.start_time, outage.end_time);
  const durationM = getDurationMinutes(outage.start_time, outage.end_time);
  const durationH = (durationM / 60).toFixed(1);
  const reason    = language === "pt" ? outage.reason_pt : outage.reason_en;
  const name      = language === "pt" ? outage.neighborhood.name_pt : outage.neighborhood.name_en;
  const accent    = ongoing ? colors.danger : colors.primary;

  return (
    <TouchableOpacity onPress={onPress} style={[s.card, style]} activeOpacity={0.85}>
      <View style={[s.bar, { backgroundColor: accent }]} />
      <View style={s.body}>
        {/* Header */}
        <View style={s.row}>
          <View style={s.rowLeft}>
            <Ionicons name={ongoing ? "flash" : "flash-outline"} size={13} color={accent} />
            <Text style={s.name} numberOfLines={1}>{name}</Text>
          </View>
          <StatusBadge type="status" value={outage.status} label={t(outage.status as any)} />
        </View>

        {/* Time row */}
        <View style={[s.row, { marginTop: spacing.sm }]}>
          <View>
            <Text style={s.dateLabel}>{formatDate(outage.start_time, language)}</Text>
            <Text style={s.time}>{formatTime(outage.start_time)} – {formatTime(outage.end_time)}</Text>
          </View>
          <View style={s.durationBox}>
            <Text style={[s.durationVal, { color: accent }]}>{durationH}</Text>
            <Text style={s.durationUnit}>{t("hours")}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[s.row, { marginTop: spacing.xs }]}>
          <Text style={s.relative}>
            {ongoing
              ? `${t("endsIn")} ${getRelativeTime(outage.end_time, language)}`
              : `${t("startsIn")} ${getRelativeTime(outage.start_time, language)}`}
          </Text>
          <StatusBadge type="outageType" value={outage.outage_type} label={t(outage.outage_type as any)} />
        </View>

        {/* Reason */}
        {reason ? (
          <Text style={s.reason} numberOfLines={2}>{reason}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:         { backgroundColor: colors.surface, borderRadius: radius.md, flexDirection: "row", overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  bar:          { width: 4 },
  body:         { flex: 1, padding: spacing.md },
  row:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowLeft:      { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  name:         { fontSize: 15, fontWeight: "700", color: colors.textPrimary, flex: 1 },
  dateLabel:    { fontSize: 10, fontWeight: "600", color: colors.textMuted, letterSpacing: 0.5, textTransform: "uppercase" },
  time:         { fontSize: 17, fontWeight: "700", color: colors.textPrimary, marginTop: 2 },
  durationBox:  { alignItems: "flex-end" },
  durationVal:  { fontSize: 26, fontWeight: "800", lineHeight: 28 },
  durationUnit: { fontSize: 10, color: colors.textSecondary },
  relative:     { fontSize: 11, color: colors.textSecondary },
  reason:       { fontSize: 11, color: colors.textMuted, fontStyle: "italic", marginTop: spacing.sm },
});
