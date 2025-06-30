import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

const AdminSendNotificationScreen = () => {
  const { userToken } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetGroup, setTargetGroup] = useState<"all" | "client" | "company" | "admin" | "">("");
  

  const handleSend = async () => {
    if (!title || !message || !targetGroup) {
      return Alert.alert("خطأ", "كل الحقول مطلوبة");
    }

    try {
      console.log("🛡️ Token before request:", userToken);

      await axios.post(
        `${BASE_URL}/admin/notifications`,
        { title, message, targetGroup },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      Alert.alert("تم", "تم إرسال الإشعار بنجاح");
      setTitle("");
      setMessage("");
      setTargetGroup("");
    } catch (err) {
      console.error("خطأ أثناء الإرسال:", err);
      Alert.alert("خطأ", "حصل مشكلة أثناء إرسال الإشعار");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>عنوان الإشعار</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="مثال: عرض خاص"
      />

      <Text style={styles.label}>نص الإشعار</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={message}
        onChangeText={setMessage}
        placeholder="اكتب محتوى الإشعار هنا"
        multiline
      />

      <Text style={styles.label}>اختر الفئة المستهدفة</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            targetGroup === "all" && styles.selected,
          ]}
          onPress={() => setTargetGroup("all")}
        >
          <Text style={styles.selectText}>الكل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectButton,
            targetGroup === "client" && styles.selected,
          ]}
          onPress={() => setTargetGroup("client")}
        >
          <Text style={styles.selectText}>العملاء</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectButton,
            targetGroup === "company" && styles.selected,
          ]}
          onPress={() => setTargetGroup("company")}
        >
          <Text style={styles.selectText}>الشركات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectButton,
            targetGroup === "admin" && styles.selected,
          ]}
          onPress={() => setTargetGroup("admin")}
        >
          <Text style={styles.selectText}>الأدمنز</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.buttonText}>إرسال الإشعار</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdminSendNotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlign: "right",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectButton: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectText: {
    color: "#000",
    fontWeight: "bold",
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
