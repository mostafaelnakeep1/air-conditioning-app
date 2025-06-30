// src/screens/company/CompanyOrdersScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

const dummyOrders = [
  {
    id: "1",
    clientName: "أحمد محمد",
    product: "تكييف سبليت 1.5 حصان",
    date: "2025-06-15",
    status: "جديد",
  },
  {
    id: "2",
    clientName: "سارة علي",
    product: "تكييف شباك 2 حصان",
    date: "2025-06-14",
    status: "جارى التنفيذ",
  },
  {
    id: "3",
    clientName: "محمد حسن",
    product: "تكييف سبليت 2.5 حصان",
    date: "2025-06-13",
    status: "مكتمل",
  },
];

export default function CompanyOrdersScreen() {
  const renderItem = ({ item }: { item: typeof dummyOrders[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => {}}>
      <View style={styles.cardContent}>
        <View style={styles.info}>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.product}>{item.product}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // لون الحالة
  function getStatusStyle(status: string) {
    switch (status) {
      case "جديد":
        return { backgroundColor: "#e0f7fa" };
      case "جارى التنفيذ":
        return { backgroundColor: "#fff9c4" };
      case "مكتمل":
        return { backgroundColor: "#c8e6c9" };
      default:
        return { backgroundColor: "#eee" };
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={dummyOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListHeaderComponent={<Text style={styles.header}>الطلبات الواردة</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: Layout.width(5),
    backgroundColor: colors.background,
    paddingBottom: Layout.height(5),
  },
  header: {
    fontSize: Layout.font(3.2),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    textAlign: "right",
    color: colors.black,
  },
  card: {
    backgroundColor: "#fff",
    padding: Layout.height(2),
    borderRadius: Layout.width(4),
    marginBottom: Layout.height(1.5),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Layout.height(0.8) },
    shadowOpacity: 0.1,
    shadowRadius: Layout.width(1.5),
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginRight: Layout.width(3),
  },
  clientName: {
    fontSize: Layout.font(2),
    fontWeight: "600",
    color: colors.black,
    textAlign: "right",
  },
  product: {
    fontSize: Layout.font(1.8),
    color: colors.gray,
    marginTop: Layout.height(0.5),
    textAlign: "right",
  },
  date: {
    fontSize: Layout.font(1.5),
    color: colors.gray,
    marginTop: Layout.height(0.5),
    textAlign: "right",
  },
  statusBadge: {
    borderRadius: Layout.width(4),
    paddingHorizontal: Layout.width(3),
    paddingVertical: Layout.height(0.8),
  },
  statusText: {
    fontSize: Layout.font(1.8),
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
});
