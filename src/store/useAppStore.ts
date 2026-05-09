import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Neighborhood, Language } from "../types";

interface AppState {
  selectedNeighborhoods: Neighborhood[];
  language: Language;
  notificationsEnabled: boolean;
  pushToken: string | null;
  isHydrated: boolean;

  // Actions
  addNeighborhood:        (n: Neighborhood) => Promise<void>;
  removeNeighborhood:     (id: number)      => Promise<void>;
  setLanguage:            (l: Language)     => Promise<void>;
  setNotificationsEnabled:(v: boolean)      => Promise<void>;
  setPushToken:           (t: string)       => Promise<void>;
  hydrate:                ()                => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedNeighborhoods: [],
  language:              "pt",
  notificationsEnabled:  true,
  pushToken:             null,
  isHydrated:            false,

  addNeighborhood: async (n) => {
    if (get().selectedNeighborhoods.find((x) => x.id === n.id)) return;
    const updated = [...get().selectedNeighborhoods, n];
    set({ selectedNeighborhoods: updated });
    await AsyncStorage.setItem("neighborhoods", JSON.stringify(updated));
  },

  removeNeighborhood: async (id) => {
    const updated = get().selectedNeighborhoods.filter((x) => x.id !== id);
    set({ selectedNeighborhoods: updated });
    await AsyncStorage.setItem("neighborhoods", JSON.stringify(updated));
  },

  setLanguage: async (l) => {
    set({ language: l });
    await AsyncStorage.setItem("language", l);
  },

  setNotificationsEnabled: async (v) => {
    set({ notificationsEnabled: v });
    await AsyncStorage.setItem("notificationsEnabled", String(v));
  },

  setPushToken: async (t) => {
    set({ pushToken: t });
    await AsyncStorage.setItem("pushToken", t);
  },

  hydrate: async () => {
    try {
      const [neighborhoods, lang, notifs, token] = await Promise.all([
        AsyncStorage.getItem("neighborhoods"),
        AsyncStorage.getItem("language"),
        AsyncStorage.getItem("notificationsEnabled"),
        AsyncStorage.getItem("pushToken"),
      ]);
      set({
        selectedNeighborhoods: neighborhoods ? JSON.parse(neighborhoods) : [],
        language:              (lang as Language) ?? "pt",
        notificationsEnabled:  notifs !== "false",
        pushToken:             token ?? null,
        isHydrated:            true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },
}));
