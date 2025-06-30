import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../config/config"; // عدل المسار حسب مشروعك

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// إضافة توكن المصادقة لكل طلب بشكل تلقائي
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    console.log("🔐 Sending token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
