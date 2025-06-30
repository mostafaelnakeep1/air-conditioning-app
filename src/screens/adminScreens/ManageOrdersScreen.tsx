// src/screens/adminScreens/ManageOrdersScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Order } from "../../navigation/types";

export default function ManageOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get("/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📑 إدارة الطلبات</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>لا توجد طلبات حالياً</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ direction: "rtl" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("OrderDetailsScreen", { order: item })}
            >
              <Text style={styles.name}>🚚 الطلب #{item._id.slice(-4)}</Text>
              <Text style={styles.status}>
                🧍 {item.user?.name || "مجهول"} - 🧊 {item.product?.name || "منتج غير معروف"}
              </Text>
              <Text style={styles.date}>
                📅 {new Date(item.createdAt).toLocaleDateString()} - الحالة: {item.status}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: Layout.width(4) },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontSize: Layout.font(2.3), fontWeight: "600", color: colors.black },
  status: { fontSize: Layout.font(2), color: colors.gray, marginTop: 5 },
  date: { fontSize: Layout.font(1.9), color: colors.gray, marginTop: 3 },
  emptyBox: {
    backgroundColor: colors.white,
    padding: Layout.height(3),
    borderRadius: Layout.width(3),
    alignItems: "center",
    marginTop: Layout.height(5),
    elevation: 2,
  },
  emptyText: {
    fontSize: Layout.font(2.3),
    color: colors.gray,
  },
});
