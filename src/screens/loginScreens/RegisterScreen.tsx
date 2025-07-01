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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MultiSelect from "react-native-multiple-select";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { BASE_URL } from "../../config/config";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [coverageAreas, setCoverageAreas] = useState<string[]>([]);
  const [companyImage, setCompanyImage] = useState<string | null>(null);

  const governorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "الدقهلية",
    "الشرقية",
    "الغربية",
    "المنوفية",
    "البحيرة",
    "الفيوم",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "بورسعيد",
    "السويس",
    "دمياط",
    "الإسماعيلية",
    "بني سويف",
    "مطروح",
    "الوادي الجديد",
    "شمال سيناء",
    "جنوب سيناء",
    "كفر الشيخ",
    "البحر الأحمر",
  ];

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
  if (!name || !email || !password) {
    Alert.alert("تنبيه", "من فضلك املأ جميع الحقول الأساسية");
    return;
  }

  if (userType === "company") {
    if (!phone || !/^01[0-9]{9}$/.test(phone)) {
      Alert.alert("تنبيه", "رقم الهاتف غير صالح أو مفقود");
      return;
    }
    if (!location) {
      Alert.alert("تنبيه", "يرجى تحديد الموقع الجغرافي من الخريطة");
      return;
    }
    if (!address) {
      Alert.alert("تنبيه", "يرجى إدخال عنوان الشركة");
      return;
    }
    if (coverageAreas.length === 0) {
      Alert.alert("تنبيه", "يرجى اختيار المحافظات المغطاة");
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
  formData.append("password", password);
  formData.append("role", userType);

  if (userType === "company") {
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverageAreas", JSON.stringify(coverageAreas));
    formData.append("location", JSON.stringify(location));

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

    const res = await apiClient.post("/register-company", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    const data = res.data;
    console.log("📥 Server response:", res.status, data);

    if (userType === "company") {
      Alert.alert("تم إرسال الطلب", "تم تسجيل الشركة بنجاح، بانتظار موافقة الإدارة.");
      navigation.replace("MainTabs");
      return;
    }

    
    navigation.replace("MainTabs");
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* ScrollView بيغلف المحتوى بس مش FlatList */}
        <ScrollView
          contentContainerStyle={{ padding: Layout.width(5) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ direction: "rtl" }}
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

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            textAlign="right"
          />

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
                <Text>{companyImage ? "✅ تم اختيار صورة" : "اختر صورة من المعرض"}</Text>
              </TouchableOpacity>
              
              {companyImage && (
                <Image
                  source={{ uri: companyImage }}
                  style={{ height: 100, marginBottom: 10, borderRadius: 10 }}
                />
              )}
              <Text style={styles.label}>عنوان الشركة</Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: شارع التحرير، الدقي، الجيزة"
                value={address}
                onChangeText={setAddress}
                textAlign="right"
              />
              <Text style={styles.label}>الموقع الجغرافي</Text>
              <TouchableOpacity style={styles.input} onPress={getCurrentLocation}>
                <Text>{location ? "✅ تم تحديد الموقع" : "استخدام موقعي الحالي"}</Text>
              </TouchableOpacity>
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

              <Text style={styles.label}>المحافظات التي تغطيها</Text>

              {/* أهم تعديل هنا: حددت ارتفاع ثابت للمكون MultiSelect عشان مايحصلش تعارض */}
              <View style={{ height: 220 }}>
                <MultiSelect
                  items={governorates.map((g) => ({ id: g, name: g }))}
                  uniqueKey="id"
                  onSelectedItemsChange={setCoverageAreas}
                  selectedItems={coverageAreas}
                  selectText="اختر المحافظات"
                  searchInputPlaceholderText="بحث..."
                  tagRemoveIconColor={colors.primary}
                  tagBorderColor={colors.primary}
                  tagTextColor={colors.primary}
                  selectedItemTextColor={colors.white}
                  selectedItemIconColor={colors.white}
                  itemTextColor={colors.black}
                  displayKey="name"
                  submitButtonText="تم"
                  styleDropdownMenu={{ backgroundColor: colors.white, marginBottom: 20 }}
                  searchInputStyle={{ textAlign: "right", color: colors.black }}
                  hideSubmitButton={false}
                />
              </View>
            </>
          )}

          <View style={styles.rememberMeContainer}>
            <Switch value={rememberMe} onValueChange={setRememberMe} />
            <Text style={styles.rememberMeText}>تذكرني</Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.submitText}>{loading ? "جاري التسجيل..." : "تسجيل"}</Text>
          </TouchableOpacity>
        </ScrollView>
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
