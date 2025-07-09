import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  I18nManager
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";

type RootStackParamList = {
  Register: undefined;
  MainTabs: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen({
  navigation,
}: {
  navigation: RegisterScreenNavigationProp;
}) {
  const { login } = useAuth();
  const [userType, setUserType] = useState<"client" | "company">("client");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationOption, setLocationOption] = useState<"current" | "link" | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLink, setLocationLink] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyImage, setCompanyImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setCompanyImage(result.assets[0].uri);
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("خطأ", "يرجى تفعيل إذن الوصول للموقع");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const handleRegister = async () => {
    if (!name || !email) {
      Alert.alert("تنبيه", "من فضلك املأ جميع الحقول الأساسية");
      return;
    }

    if (userType === "company") {
      if (!phone || !/^01[0-9]{9}$/.test(phone)) {
        Alert.alert("تنبيه", "رقم الهاتف غير صالح أو مفقود");
        return;
      }

      if (!locationOption) {
        Alert.alert("تنبيه", "يرجى اختيار طريقة تحديد الموقع الجغرافي");
        return;
      }

      if (locationOption === "current" && !location) {
        Alert.alert("تنبيه", "يرجى تحديد الموقع من الخريطة");
        return;
      }

      if (locationOption === "link" && !locationLink.trim()) {
        Alert.alert("تنبيه", "يرجى إدخال رابط موقع صالح");
        return;
      }

      if (!companyImage) {
        Alert.alert("تنبيه", "يرجى اختيار صورة للشركة");
        return;
      }
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", userType);

    if (userType === "client") {
      formData.append("password", password);
    }

    if (userType === "company") {
      formData.append("phone", phone);

      if (locationOption === "current") {
        formData.append("location", JSON.stringify({
          latitude: location!.latitude,
          longitude: location!.longitude,
        }));
      } else if (locationOption === "link") {
        formData.append("location", JSON.stringify({ link: locationLink }));
      }

      const fileName = companyImage!.split("/").pop()!;
      const ext = fileName.split(".").pop();
      formData.append("image", {
        uri: companyImage!,
        name: `company_logo.${ext}`,
        type: `image/${ext}`,
      } as any);
    }

    try {
      setLoading(true);
      const endpoint = userType === "company" ? "/auth/company/register" : "/auth/register";

      const res = await apiClient.post(endpoint, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      console.log("📥 Server response:", res.status, data);

      if (userType === "company") {
        Alert.alert("تم إرسال الطلب", "تم تسجيل الشركة بنجاح، بانتظار موافقة الإدارة.");
      } else {
        Alert.alert("تم التسجيل", "تم إنشاء الحساب بنجاح");
      }

      navigation.navigate("LoginScreen" as never);
    } catch (err: any) {
      console.log("❌ Error:", err.response?.data || err.message);
      Alert.alert("خطأ", err.response?.data?.message || "تعذر الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ padding: Layout.width(5), flexGrow: 1,  flexDirection: I18nManager.isRTL ? "column-reverse" : "column", }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.header}>إنشاء حساب جديد</Text>

            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  userType === "client" && styles.activeButton,
                ]}
                onPress={() => setUserType("client")}
              >
                <Text
                  style={[
                    styles.switchText,
                    userType === "client" && styles.activeText,
                  ]}
                >
                  عميل
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  userType === "company" && styles.activeButton,
                ]}
                onPress={() => setUserType("company")}
              >
                <Text
                  style={[
                    styles.switchText,
                    userType === "company" && styles.activeText,
                  ]}
                >
                  شركة
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>الاسم</Text>
            <TextInput
              style={styles.input}
              placeholder="الاسم الكامل"
              value={name}
              onChangeText={setName}
              textAlign="right"
            />

            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              textAlign="right"
              autoCapitalize="none"
            />

            {userType === "client" && (
              <>
                <Text style={styles.label}>كلمة المرور</Text>
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  textAlign="right"
                />
              </>
            )}

            {userType === "company" && (
              <>
                <Text style={styles.label}>رقم الهاتف</Text>
                <TextInput
                  style={styles.input}
                  placeholder="01012345678"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  textAlign="right"
                />

                <Text style={styles.label}>صورة الشركة</Text>
                <TouchableOpacity style={styles.input} onPress={pickImage}>
                  <Text>
                    {companyImage ? "✅ تم اختيار صورة" : "اختر صورة من المعرض"}
                  </Text>
                </TouchableOpacity>

                {companyImage && (
                  <Image
                    source={{ uri: companyImage }}
                    style={{ height: 100, marginBottom: 10, borderRadius: 10 }}
                  />
                )}

                <Text style={styles.label}>الموقع الجغرافي</Text>

                <TouchableOpacity
                  style={[
                    styles.input,
                    locationOption === "current" && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                  onPress={async () => {
                    setLocationOption("current");
                    setLocationLink("");
                    await getCurrentLocation();
                  }}
                >
                  <Text style={{ textAlign: "right" }}>
                    {location ? "✅ تم تحديد الموقع الحالي" : "📍 استخدام موقعي الحالي"}
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.label, { marginTop: 10 }]}>أو أدخل رابط الموقع</Text>
                <TextInput
                  style={[
                    styles.input,
                    locationOption === "link" && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                  placeholder="https://maps.app.goo.gl/..."
                  value={locationLink}
                  onChangeText={(text) => {
                    setLocationLink(text);
                    setLocationOption("link");
                    setLocation(null);
                  }}
                  textAlign="right"
                />

                {location && (
                  <MapView
                    style={{ height: 150, marginVertical: 10 }}
                    region={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker coordinate={location} />
                  </MapView>
                )}
              </>
            )}

            <View style={styles.rememberMeContainer}>
              <Switch value={rememberMe} onValueChange={setRememberMe} />
              <Text style={styles.rememberMeText}>تذكرني</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? "جاري التسجيل..." : "تسجيل"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: Layout.font(3.6),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(3),
    color: colors.black,
  },
  switchContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginBottom: Layout.height(3),
  },
  switchButton: {
    paddingVertical: Layout.height(1.2),
    paddingHorizontal: Layout.width(6),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: Layout.width(3),
    marginHorizontal: Layout.width(1),
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  switchText: {
    fontSize: Layout.font(2.2),
    color: colors.primary,
    fontWeight: "500",
  },
  activeText: {
    color: colors.white,
  },
  label: {
    fontSize: Layout.font(2),
    fontWeight: "500",
    marginBottom: Layout.height(0.5),
    textAlign: "right",
    color: colors.black,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(2),
    padding: Layout.height(1.5),
    marginBottom: Layout.height(2),
    fontSize: Layout.font(2),
    textAlign: "right",
  },
  rememberMeContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Layout.height(3),
    paddingHorizontal: Layout.width(2),
  },
  rememberMeText: {
    fontSize: Layout.font(2),
    color: colors.black,
    marginRight: Layout.width(2),
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.8),
    borderRadius: Layout.width(3),
    alignItems: "center",
  },
  submitText: {
    color: colors.white,
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
  },
});
