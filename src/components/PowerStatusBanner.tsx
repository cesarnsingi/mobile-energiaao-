import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../utils/theme";
import { Outage } from "../types";
import { useTranslation } from "../hooks/useTranslation";
import { formatTime } from "../utils/dateHelpers";

interface Props { activeOutages: Outage[] }

export function PowerStatusBanner({ activeOutages }: Props) {
  const { t, language } = useTranslation();
  const hasOutage = activeOutages.length > 0;
  const borderColor = hasOutage ? colors.danger  : colors.success;
  const bgColor     = hasOutage ? colors.dangerBg : colors.successBg;
  const iconName    = hasOutage ? "flash-off" : "flash" as const;
  const iconBg      = hasOutage ? colors.danger : colors.success;
  const statusText  = hasOutage ? t("powerOff") : t("powerOn");

  return (
    <View style={[s.banner, { backgroundColor: bgColor, borderColor }]}>
      <View style={[s.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={22} color="#fff" />
      </View>
      <View style={s.info}>
        <Text style={[s.status, { color: iconBg }]}>{statusText}</Text>
        {hasOutage ? (
          <Text style={s.detail}>
            {activeOutages
              .map((o) =>
                `${language === "pt" ? o.neighborhood.name_pt : o.neighborhood.name_en} · ${t("endsIn")} ${formatTime(o.end_time)}`
              )
              .join("\n")}
          </Text>
        ) : (
          <Text style={s.detail}>{t("currentStatus")}</Text>
        )}
      </View>
      <View style={[s.pulse, { backgroundColor: iconBg }]} />
    </View>
  );
}

const s = StyleSheet.create({
  banner:   { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md },
  iconWrap: { width: 44, height: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center" },
  info:     { flex: 1 },
  status:   { fontSize: 16, fontWeight: "700" },
  detail:   { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  pulse:    { width: 8, height: 8, borderRadius: 4 },
});
