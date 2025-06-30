import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

const ContactUsScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const supportEmail = "support@example.com"; // حط إيميل الإدارة هنا
  const adminPhone = "01012345678"; // رقم إدارة التطبيق ثابت

  const handleSendEmail = () => {
    if (!name || !email || !message) {
      Alert.alert("تنبيه", "يرجى ملء الاسم، البريد الإلكتروني والرسالة");
      return;
    }

    const subject = `رسالة من ${name}`;
    const body = `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`;

    const mailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(mailUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert("خطأ", "تعذر فتح تطبيق البريد الإلكتروني");
        } else {
          return Linking.openURL(mailUrl);
        }
      })
      .catch(() => Alert.alert("خطأ", "حدث خطأ أثناء محاولة فتح البريد الإلكتروني"));
  };

  const handleCallAdmin = () => {
    const phoneUrl = `tel:${adminPhone}`;
    Linking.openURL(phoneUrl).catch(() => Alert.alert("خطأ", "تعذر إجراء المكالمة"));
  };

  const handleWhatsAppAdmin = () => {
    const whatsappUrl = `whatsapp://send?phone=${adminPhone}`;
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert("خطأ", "واتساب غير مثبت على الجهاز");
        } else {
          return Linking.openURL(whatsappUrl);
        }
      })
      .catch(() => Alert.alert("خطأ", "حدث خطأ أثناء محاولة فتح واتساب"));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.header}>تواصل معنا</Text>

            <TextInput
              placeholder="الاسم"
              style={styles.input}
              textAlign="right"
              placeholderTextColor={colors.black}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="البريد الإلكتروني"
              style={styles.input}
              textAlign="right"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.black}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="الرسالة"
              style={[styles.input, styles.textArea]}
              multiline
              textAlign="right"
              placeholderTextColor={colors.black}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleSendEmail}>
              <Text style={styles.buttonText}>إرسال</Text>
            </TouchableOpacity>

            {/* قسم رقم التليفون */}
            <View style={styles.adminContactContainer}>
              <Text style={styles.adminPhoneText}>أو تواصل بشكل مباشر</Text>
              <View style={styles.iconsRow}>
                <TouchableOpacity style={styles.iconButton} onPress={handleCallAdmin}>
                  <Icon name="phone" size={30} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleWhatsAppAdmin}>
                  <Icon name="whatsapp" size={30} color="#25D366" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingVertical: Layout.height(4),
    paddingHorizontal: Layout.width(2),
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: Layout.width(5),
    paddingVertical: Layout.height(4),
    backgroundColor: "#fff",
    borderRadius: Layout.width(4),
    marginHorizontal: Layout.width(5),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  header: {
    fontSize: Layout.font(3.8),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    alignSelf: "center",
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: Layout.width(3),
    paddingHorizontal: Layout.width(3),
    paddingVertical: Layout.height(1.8),
    marginBottom: Layout.height(2),
    fontSize: Layout.font(2.3),
    color: colors.black,
  },
  textArea: {
    height: Layout.height(15),
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(2.3),
    borderRadius: Layout.width(3),
    alignSelf: "center",
    minWidth: Layout.width(40),
    marginBottom: Layout.height(4),
  },
  buttonText: {
    color: "#fff",
    fontSize: Layout.font(2.7),
    textAlign: "center",
    fontWeight: "600",
  },
  adminContactContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: Layout.height(3),
    alignItems: "center",
  },
  adminPhoneText: {
    fontSize: Layout.font(2.5),
    color: colors.black,
    marginBottom: Layout.height(2),
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconButton: {
    marginHorizontal: Layout.width(4),
  },
});

export default ContactUsScreen;
