import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../utils/theme";

interface Props {
  icon?:      string;
  message:    string;
  subMessage?: string;
  actionLabel?: string;
  onAction?:  () => void;
}

export function EmptyState({ icon = "information-circle-outline", message, subMessage, actionLabel, onAction }: Props) {
  return (
    <View style={s.wrap}>
      <Ionicons name={icon as any} size={44} color={colors.textMuted} />
      <Text style={s.msg}>{message}</Text>
      {subMessage ? <Text style={s.sub}>{subMessage}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity style={s.btn} onPress={onAction}>
          <Text style={s.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { alignItems: "center", padding: spacing.xxl, gap: spacing.md },
  msg:     { fontSize: 15, fontWeight: "600", color: colors.textSecondary, textAlign: "center" },
  sub:     { fontSize: 13, color: colors.textMuted, textAlign: "center", lineHeight: 20 },
  btn:     { marginTop: spacing.sm, backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8 },
  btnText: { fontSize: 14, fontWeight: "700", color: "#000" },
});
