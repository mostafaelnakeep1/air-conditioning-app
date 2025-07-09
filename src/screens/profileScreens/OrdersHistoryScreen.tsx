import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  I18nManager,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { BASE_URL } from "../../config/config";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Order } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext"; // ✅
import apiClient from "../../api/apiClient";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OrdersHistoryScreen">;

const OrdersHistoryScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();
  const { userToken } = useAuth(); // ✅

  const fetchOrders = async () => {
    if (!userToken) {
      Alert.alert("خطأ", "لم يتم العثور على التوكن");
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.get("/orders");

      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("خطأ", "حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <Text style={styles.header}>طلباتي السابقة</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : orders.length === 0 ? (
            <Text style={[styles.row, { textAlign: "center", marginTop: 20 }]}>
              لا توجد طلبات سابقة
            </Text>
          ) : (
            orders.map((order) => (
              <TouchableOpacity
                key={order._id}
                onPress={() =>
                  navigation.navigate("OrderDetailsScreen", { order })
                }
                style={styles.card}
              >
                <Text style={styles.row}>
                  رقم الطلب: #{order._id.slice(-6)}
                </Text>
                <Text style={styles.row}>
                  التاريخ:{" "}
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                <Text style={styles.row}>الحالة: {order.status}</Text>
                <Text style={styles.row}>
                  الإجمالي: {order.totalPrice.toLocaleString("ar-EG")} جنيه
                </Text>
              </TouchableOpacity>
            ))
          )}
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
    paddingVertical: Layout.height(4),
    paddingHorizontal: Layout.width(5),
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(4),
    padding: Layout.width(5),
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  header: {
    fontSize: Layout.font(3.8),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    color: colors.black,
    textAlign: "center",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(2),
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  row: {
    fontSize: Layout.font(2.3),
    color: colors.black,
    marginBottom: Layout.height(0.8),
    textAlign: "right",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
});

export default OrdersHistoryScreen;
