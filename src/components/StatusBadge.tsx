import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "../utils/theme";
import { OutageStatus, OutageType } from "../types";

type BadgeType = "status" | "outageType";

interface Props {
  type:  BadgeType;
  value: OutageStatus | OutageType;
  label: string;
}

const STATUS_PALETTE: Record<OutageStatus, { bg: string; text: string }> = {
  scheduled: { bg: colors.warningBg, text: colors.warning },
  ongoing:   { bg: colors.dangerBg,  text: colors.danger  },
  completed: { bg: "#1a1a2e",        text: colors.textMuted },
  cancelled: { bg: "#1a1a2e",        text: colors.textMuted },
};

const TYPE_PALETTE: Record<OutageType, { bg: string; text: string }> = {
  planned:     { bg: colors.infoBg,    text: colors.info    },
  unplanned:   { bg: colors.dangerBg,  text: colors.danger  },
  maintenance: { bg: colors.warningBg, text: colors.warning },
};

export function StatusBadge({ type, value, label }: Props) {
  const palette =
    type === "status"
      ? STATUS_PALETTE[value as OutageStatus]
      : TYPE_PALETTE[value as OutageType];

  return (
    <View style={[s.badge, { backgroundColor: palette.bg }]}>
      <Text style={[s.text, { color: palette.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full, alignSelf: "flex-start" },
  text:  { fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
});
