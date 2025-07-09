import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../src/config/config"; // غيّر حسب مكان الملف
//import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";



export const sendNotification = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.log("🚫 مفيش توكن");
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/admin/notifications`, {
      title: "خصم جديد",
      message: "اشترِ الآن واحصل على 30%",
      targetGroup: "client",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ الإشعار تم إرساله:", res.data);
  } catch (error) {
    console.error("❌ فشل في الإرسال:", error);
  }
};


// export async function registerForPushNotificationsAsync(): Promise<string | null> {
//   if (!Device.isDevice) {
//     console.log("Must use physical device for Push Notifications");
//     return null;
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") {
//     console.log("Failed to get push token for push notification!");
//     return null;
//   }

//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log("📱 Expo Push Token:", token);
//   return token;
// }