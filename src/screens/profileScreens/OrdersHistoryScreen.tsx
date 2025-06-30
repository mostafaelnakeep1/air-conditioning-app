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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/config";

// استيراد الأنواع وتعريف نوع التنقل
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Order } from "../../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OrdersHistoryScreen">;

const OrdersHistoryScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token from AsyncStorage:", token);
      return token;
    } catch (error) {
      console.log("فشل في جلب التوكن", error);
      return null;
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const token = await getToken();

    if (!token) {
      Alert.alert("خطأ", "لم يتم العثور على التوكن");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("خطأ", data.message || "فشل في تحميل الطلبات");
        return;
      }

      setOrders(data.data || []);
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
    backgroundColor: "#fff",
    borderRadius: Layout.width(4),
    padding: Layout.width(5),
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
    color: colors.black,
    textAlign: "center",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
  card: {
    backgroundColor: "#f7f7f7",
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(2),
    elevation: 2,
    shadowColor: "#000",
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
