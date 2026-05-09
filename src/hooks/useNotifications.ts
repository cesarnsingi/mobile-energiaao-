import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { notificationsApi } from "../api";
import { useAppStore } from "../store/useAppStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

export function useNotifications() {
  const { notificationsEnabled, selectedNeighborhoods, language, setPushToken } = useAppStore();

  useEffect(() => {
    if (!notificationsEnabled) return;
    register();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsEnabled, selectedNeighborhoods.length]);

  async function register() {
    // Expo Go on simulator won't have a real device token — handle gracefully
    if (!Device.isDevice) {
      console.info("[Notifications] Skipped — not a physical device");
      return;
    }

    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.info("[Notifications] Permission denied");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("energiaao", {
          name: "EnergiaAO Outages",
          importance:       Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor:       "#F5A623",
        });
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token     = tokenData.data;
      await setPushToken(token);

      await notificationsApi.register({
        token,
        neighborhood_ids: selectedNeighborhoods.map((n) => n.id),
        language,
      });
    } catch (e) {
      // Never crash the app over notification errors
      console.warn("[Notifications] Registration failed:", e);
    }
  }
}
