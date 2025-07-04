import axios from "axios";
import { BASE_URL } from "../config/config";

// أنشئ الكلاينت مرة واحدة
const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const setClientToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("✅ Token set in axios:", token);
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
    console.log("🚫 Token removed from axios");
  }
};

apiClient.interceptors.request.use((config) => {
  console.log("📤 API REQUEST TO:", config.url);
  console.log("📤 AUTHORIZATION:", config.headers.Authorization);
  return config;
});


export default apiClient;
