// src/screens/admin/AdminReportsScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

export default function AdminReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 تقارير التطبيق</Text>
      <Text style={styles.note}>سيتم عرض رسوم بيانية وإحصائيات حول عدد الطلبات، المبيعات، وعدد المستخدمين.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: Layout.width(5), justifyContent: "center" },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  note: {
    fontSize: Layout.font(2.2),
    color: colors.gray,
    textAlign: "center",
    lineHeight: Layout.height(3),
  },
});
