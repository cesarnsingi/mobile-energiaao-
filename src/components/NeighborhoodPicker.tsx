import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Neighborhood } from "../types";
import { neighborhoodsApi } from "../api";
import { colors, spacing, radius } from "../utils/theme";
import { useTranslation } from "../hooks/useTranslation";

interface Props {
  selected:    Neighborhood[];
  onSelect:    (n: Neighborhood) => void;
  onRemove:    (id: number)      => void;
}

export function NeighborhoodPicker({ selected, onSelect, onRemove }: Props) {
  const { t, language } = useTranslation();
  const [visible, setVisible]           = useState(false);
  const [all, setAll]                   = useState<Neighborhood[]>([]);
  const [filtered, setFiltered]         = useState<Neighborhood[]>([]);
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    neighborhoodsApi.list().then((data) => {
      setAll(data);
      setFiltered(data);
    }).finally(() => setLoading(false));
  }, [visible]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(all.filter((n) =>
      n.name_pt.toLowerCase().includes(q) || n.municipality.toLowerCase().includes(q)
    ));
  }, [search, all]);

  const isSelected = (id: number) => selected.some((n) => n.id === id);

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity style={s.trigger} onPress={() => setVisible(true)}>
        <Ionicons name="location-outline" size={18} color={colors.primary} />
        <Text style={s.triggerText} numberOfLines={1}>
          {selected.length === 0
            ? t("selectNeighborhood")
            : selected.map((n) => language === "pt" ? n.name_pt : n.name_en).join(", ")}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.sheet}>
            {/* Header */}
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>{t("selectNeighborhood")}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={s.searchWrap}>
              <Ionicons name="search" size={15} color={colors.textMuted} />
              <TextInput
                style={s.searchInput}
                placeholder={t("search")}
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>

            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                  const sel = isSelected(item.id);
                  return (
                    <TouchableOpacity
                      style={[s.item, sel && s.itemSelected]}
                      onPress={() => sel ? onRemove(item.id) : onSelect(item)}
                    >
                      <View>
                        <Text style={s.itemName}>{language === "pt" ? item.name_pt : item.name_en}</Text>
                        <Text style={s.itemMuni}>{item.municipality}</Text>
                      </View>
                      {sel && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={s.sep} />}
              />
            )}

            <TouchableOpacity style={s.done} onPress={() => setVisible(false)}>
              <Text style={s.doneText}>{t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  trigger:     { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  triggerText: { flex: 1, fontSize: 14, color: colors.textPrimary },
  overlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  sheet:       { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, maxHeight: "82%", paddingBottom: spacing.xl },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetTitle:  { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  searchWrap:  { flexDirection: "row", alignItems: "center", margin: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.md, paddingHorizontal: spacing.md, gap: spacing.sm },
  searchInput: { flex: 1, paddingVertical: spacing.sm + 2, color: colors.textPrimary, fontSize: 14 },
  item:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4 },
  itemSelected:{ backgroundColor: colors.surfaceElevated },
  itemName:    { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  itemMuni:    { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sep:         { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  done:        { backgroundColor: colors.primary, margin: spacing.md, borderRadius: radius.md, padding: spacing.md, alignItems: "center", marginTop: spacing.lg },
  doneText:    { fontSize: 16, fontWeight: "700", color: "#000" },
});
