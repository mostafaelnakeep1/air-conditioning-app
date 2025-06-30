import { I18nManager } from "react-native";

// نفعّل RTL مرة واحدة
export function enableRTL() {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
}
