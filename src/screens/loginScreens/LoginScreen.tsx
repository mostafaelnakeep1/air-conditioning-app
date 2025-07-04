import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/config";
import apiClient from "../../api/apiClient";


export default function LoginScreen({ navigation }: { navigation: any }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"client" | "company">("client");

  
  // لو مخزن بيانات مستخدم سابق في AsyncStorage، نعبيهم
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setEmail(parsedUser.email || "");
          setRememberMe(true);
        }
      } catch (e) {
        // ممكن تتجاهل أو تكتب لوج
      }
    };
    loadStoredUser();
  }, []);

const handleLogin = async () => {


  if (!email || !password) {
    Alert.alert("خطأ", "من فضلك أدخل البريد الإلكتروني وكلمة المرور");
    return;
  }

  setLoading(true);

  try {
    // ✅ تحديد المسار حسب نوع المستخدم
    const endpoint = userType === "company" ? "/auth/company/login" : "/auth/login";

    const res = await apiClient.post(endpoint, { email, password });

    const data = res.data;

    // ✅ لو المستخدم شركة، افحص حالة الحساب
    if (userType === "company") {
      if (data.user?.status !== "active") {
        if (data.user.status === "pending") {
          Alert.alert("طلب تحت المراجعة", "طلبك قيد المراجعة من الإدارة، وسيتم إعلامك بعد القبول أو الرفض");
          setLoading(false);
          return;
        }

        if (data.user.status === "rejected") {
          Alert.alert("طلب مرفوض", "تم رفض طلب انضمامك، لمزيد من التفاصيل تواصل مع الدعم");
          setLoading(false);
          return;
        }
      }
    }

    // ✅ حفظ البيانات والتوكن
    login(data.user, data.token);
    console.log("🚨 USER DATA:", data.user);

    await AsyncStorage.setItem("userData", JSON.stringify(data.user));
    await AsyncStorage.setItem("token", data.token);

    if (rememberMe) {
      await AsyncStorage.setItem("rememberMe", "true");
    } else {
      await AsyncStorage.removeItem("rememberMe");
    }

    navigation.replace("MainTabs");
  } catch (error: any) {
    console.log("❌ Login error:", error.response?.data || error.message);
    Alert.alert("خطأ", error.response?.data?.message || "تعذر الاتصال بالسيرفر");
  } finally {
    setLoading(false);
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>

      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder="البريد الإلكتروني"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder="كلمة المرور"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
        <Text style={styles.forgotText}>نسيت كلمة المرور؟</Text>
      </TouchableOpacity>



      <View style={styles.rememberContainer}>
        <Text style={styles.rememberText}>تذكرني</Text>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          trackColor={{ false: "#ccc", true: colors.primary }}
          thumbColor={rememberMe ? "#fff" : "#888"}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>
          {loading ? "جاري..." : "تسجيل الدخول"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.registerText}>ليس لديك حساب؟ سجل الآن</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.width(8),
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    marginBottom: Layout.height(4),
    color: colors.primary,
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    paddingVertical: Layout.height(1.5),
    paddingHorizontal: Layout.width(3),
    borderRadius: Layout.width(2),
    fontSize: Layout.font(2),
    marginBottom: Layout.height(2),
    color: "#000",
  },
  forgotText: {
    color: colors.primary,
    fontSize: Layout.font(1.8),
    textDecorationLine: "underline",
    alignSelf: "flex-end",
    marginBottom: Layout.height(1),
  },

  rememberContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    marginBottom: Layout.height(2),
  },
  rememberText: {
    marginHorizontal: 8,
    fontSize: Layout.font(1.8),
    color: "#333",
  },
  loginButton: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: Layout.height(1.7),
    borderRadius: Layout.width(2),
    alignItems: "center",
    marginBottom: Layout.height(2),
  },
  loginButtonText: {
    color: "#fff",
    fontSize: Layout.font(2.2),
    fontWeight: "bold",
  },
  registerText: {
    color: colors.primary,
    fontSize: Layout.font(1.8),
    textDecorationLine: "underline",
    marginTop: Layout.height(1),
  },
});
