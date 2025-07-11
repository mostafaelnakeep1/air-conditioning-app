import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";
import apiClient from "../../api/apiClient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPasswordScreen">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendCode = async () => {
    if (!phone || !email)
      return Alert.alert("تنبيه", "من فضلك أدخل الإيميل ورقم الهاتف");

    try {
      await apiClient.post("/auth/send-reset-code", { phone, email });
      setCodeSent(true);
      Alert.alert("تم", "تم إرسال كود إلى رقم الهاتف");
    } catch (err: any) {
      Alert.alert("خطأ", err.response?.data?.message || "حدث خطأ أثناء إرسال الكود");
    }
  };

  const handleVerifyCode = async () => {
    if (!code || !phone || !email)
      return Alert.alert("تنبيه", "من فضلك أدخل الكود والإيميل ورقم الهاتف");

    try {
      await apiClient.post("/auth/verify-reset-code", { phone, email, code });
      setCodeVerified(true);
    } catch (err: any) {
      Alert.alert("خطأ", err.response?.data?.message || "الكود غير صحيح");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return Alert.alert("تنبيه", "من فضلك املأ كل الحقول");
    if (newPassword !== confirmPassword)
      return Alert.alert("خطأ", "كلمة المرور غير متطابقة");

    try {
      await apiClient.post("/auth/reset-password", {
        phone,
        email,
        code,
        newPassword,
      });
      Alert.alert("تم", "تم تحديث كلمة المرور بنجاح");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("خطأ", err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>استعادة كلمة المرور</Text>

      {!codeSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="الإيميل"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="رقم الهاتف"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>إرسال الكود</Text>
          </TouchableOpacity>
        </>
      )}

      {codeSent && !codeVerified && (
        <>
          <TextInput
            style={styles.input}
            placeholder="أدخل الكود المكون من 6 أرقام"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>تأكيد الكود</Text>
          </TouchableOpacity>
        </>
      )}

      {codeVerified && (
        <>
          <TextInput
            style={styles.input}
            placeholder="كلمة مرور جديدة"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>تحديث كلمة المرور</Text>
          </TouchableOpacity>
        </>
      )}
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
    fontSize: Layout.font(3),
    fontWeight: "bold",
    marginBottom: Layout.height(4),
    color: colors.primary,
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: Layout.height(1.5),
    borderRadius: Layout.width(2),
    fontSize: Layout.font(2),
    marginBottom: Layout.height(2),
    color: "#000",
    textAlign: "right",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.7),
    borderRadius: Layout.width(2),
    width: "100%",
    alignItems: "center",
    marginTop: Layout.height(1.5),
  },
  buttonText: {
    color: "#fff",
    fontSize: Layout.font(2.2),
    fontWeight: "bold",
  },
});
