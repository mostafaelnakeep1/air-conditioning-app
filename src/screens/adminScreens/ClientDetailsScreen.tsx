// src/screens/admin/ClientDetailsScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../config/config";
import apiClient from "../../api/apiClient";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  ordersCount: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
}

type RouteParams = {
  ClientDetailsScreen: { clientId: string };
};

export default function ClientDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, "ClientDetailsScreen">>();
  const { clientId } = route.params;

  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

const fetchDetails = async () => {
  try {
    const resUser = await apiClient.get(`/users/${clientId}`);
    const userData = resUser.data;
    setClient(userData.user || userData);

    const resOrders = await apiClient.get(`/orders?userId=${clientId}`);
    const ordersData = resOrders.data;
    setOrders(ordersData.orders || []);
  } catch (err) {
    console.error("Error fetching client details", err);
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

  if (!client) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>فشل في تحميل بيانات العميل</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 تفاصيل العميل</Text>

      <View style={styles.card}>
        <Text style={styles.label}>👤 الاسم: <Text style={styles.value}>{client.name}</Text></Text>
        <Text style={styles.label}>📧 الإيميل: <Text style={styles.value}>{client.email}</Text></Text>
        <Text style={styles.label}>📱 رقم الهاتف: <Text style={styles.value}>{client.phone}</Text></Text>
        <Text style={styles.label}>🗓 تاريخ التسجيل: <Text style={styles.value}>{new Date(client.createdAt).toLocaleDateString()}</Text></Text>
        <Text style={styles.label}>🛒 عدد الطلبات: <Text style={styles.value}>{orders.length}</Text></Text>
      </View>

      <Text style={styles.sectionTitle}>🗂 الطلبات السابقة:</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrders}>لا توجد طلبات مسجلة</Text>
      ) : (
        orders.map((order, index) => (
          <View key={order._id} style={styles.orderItem}>
            <Text style={styles.orderText}>#{index + 1} | 📅 {new Date(order.createdAt).toLocaleDateString()} | 📦 الحالة: {order.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: Layout.width(4) },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: Layout.font(2.5) },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(3),
    padding: Layout.height(2),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: Layout.height(3),
  },
  label: {
    fontSize: Layout.font(2.2),
    color: colors.black,
    marginBottom: Layout.height(1),
     textAlign: "right",
  },
  value: {
    fontWeight: "600",
    color: colors.primary,
     textAlign: "right",
  },
  sectionTitle: {
    fontSize: Layout.font(2.6),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: Layout.height(1),
    textAlign: "right",
  },
  noOrders: {
    textAlign: "center",
    color: colors.gray,
    fontSize: Layout.font(2),
     
  },
  orderItem: {
    backgroundColor: colors.white,
    padding: Layout.height(1.5),
    borderRadius: Layout.width(2),
    marginBottom: Layout.height(1),
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  orderText: {
    fontSize: Layout.font(2),
    color: colors.black,
     textAlign: "right",
  },
});
