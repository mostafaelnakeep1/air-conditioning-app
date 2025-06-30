// src/screens/auth/ResetPasswordScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    // هنا هتضيف منطق إرسال رابط إعادة تعيين كلمة المرور
    Alert.alert("تم", "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>استعادة كلمة المرور</Text>

        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleReset}>
          <Text style={styles.submitText}>إرسال رابط الاستعادة</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: Layout.width(5),
    backgroundColor: colors.background,
    justifyContent: "center",
    flexGrow: 1,
  },
  header: {
    fontSize: Layout.font(3.6),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(3),
    color: colors.black,
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
    marginBottom: Layout.height(3),
    fontSize: Layout.font(2),
    textAlign: "right",
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
