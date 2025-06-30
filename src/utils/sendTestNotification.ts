// src/utils/sendTestNotification.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/config";

export const sendTestNotification = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("🛡️ Token before request:", token);

  if (!token) {
    console.log("🚫 مفيش توكن");
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/admin/notifications`, {
      title: "خصم جديد",
      message: "اشترِ الآن واحصل على 30%",
      targetGroup: "client", // أو all
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ الإشعار اتبعت:", res.data);
  } catch (error) {
    console.error("❌ فشل في الإرسال:", error);
  }
};
