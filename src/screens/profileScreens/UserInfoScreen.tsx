import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  I18nManager,
  TextInput,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { useNavigation } from "@react-navigation/native";

const UserInfoScreen = () => {
  const { user, token, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const navigation = useNavigation();

  
  const handleSave = async () => {
    if (!user) {
      Alert.alert("خطأ", "المستخدم غير مسجل");
      return;
    }

    try {
      console.log("📤 Sending:", { name, email, phone, avatar });
      console.log("🔐 Token:", token);

      const response = await axios.put(
        `${BASE_URL}/users/${user._id}`,
        {
          name,
          email,
          phone,
          avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data?.user || response.data);
      setIsEditing(false);
      Alert.alert("تم الحفظ", "تم تحديث البيانات بنجاح");
      navigation.goBack();
    } catch (error: any) {
      console.log("🔥 error:", JSON.stringify(error?.response?.data || error.message, null, 2));
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث البيانات");
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("خطأ", "يجب السماح للوصول إلى الصور");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          لا يوجد مستخدم مسجل حالياً
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <TouchableOpacity onPress={isEditing ? pickImage : undefined}>
            <Image
              source={{ uri: avatar || "https://i.pravatar.cc/300" }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.label}>الاسم الكامل</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل الاسم"
              />
            ) : (
              <Text style={styles.value}>{user.name}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>رقم الهاتف</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="أدخل رقم الهاتف"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{user.phone}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="أدخل البريد الإلكتروني"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.value}>{user.email}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>نوع الحساب</Text>
            <Text style={styles.value}>
              {user.role === "company"
                ? "شركة"
                : user.role === "admin"
                ? "أدمن"
                : "عميل"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Text style={styles.buttonText}>
              {isEditing ? "حفظ البيانات" : "تعديل البيانات"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingVertical: Layout.height(6),
    paddingHorizontal: Layout.width(5),
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(4),
    padding: Layout.width(5),
    width: "100%",
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignItems: "flex-start",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
  avatar: {
    width: Layout.width(40),
    height: Layout.width(40),
    borderRadius: Layout.width(25),
    alignSelf: "center",
    marginBottom: Layout.height(4),
  },
  label: {
    fontSize: Layout.font(2),
    color: colors.gray,
    marginTop: Layout.height(2),
    marginBottom: Layout.height(0.5),
    textAlign: "right",
    width: "100%",
  },
  value: {
    fontSize: Layout.font(2.3),
    color: colors.black,
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "right",
    width: "100%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: Layout.width(2),
    paddingHorizontal: Layout.width(3),
    paddingVertical: Layout.height(1.5),
    fontSize: Layout.font(2.3),
    marginBottom: Layout.height(2),
    textAlign: "right",
    color: colors.black,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.5),
    borderRadius: Layout.width(3),
    marginTop: Layout.height(4),
    alignSelf: "center",
    minWidth: Layout.width(40),
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontSize: Layout.font(2.3),
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(3),
    paddingVertical: Layout.width(1),
    paddingHorizontal: Layout.width(4),
    marginBottom: Layout.height(0.5),
    width: "100%",
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default UserInfoScreen;
