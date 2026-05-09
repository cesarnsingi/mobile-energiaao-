import { translations, TKey } from "../i18n/translations";
import { useAppStore } from "../store/useAppStore";

export function useTranslation() {
  const language = useAppStore((s) => s.language);
  const t = (key: TKey): string => translations[language][key] ?? key;
  return { t, language };
}
