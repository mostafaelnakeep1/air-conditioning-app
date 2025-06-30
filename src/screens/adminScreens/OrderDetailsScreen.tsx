// src/screens/adminScreens/OrderDetailsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { format } from "date-fns";

type OrderDetailsRouteProp = RouteProp<RootStackParamList, "OrderDetailsScreen">;

export default function OrderDetailsScreen() {
  const route = useRoute<OrderDetailsRouteProp>();
  const { order } = route.params;

  const formattedDate = format(new Date(order.createdAt), "dd/MM/yyyy");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: Layout.height(4) }}>
      <Text style={styles.title}>📄 تفاصيل الطلب</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🧊 المنتج:</Text>
        <Text style={styles.value}>{order.product?.name || "غير محدد"}</Text>

        <Text style={styles.label}>🏷️ البراند:</Text>
        <Text style={styles.value}>{order.product?.brand || "غير متوفر"}</Text>

        <Text style={styles.label}>🏢 الشركة:</Text>
        <Text style={styles.value}>{order.company?.name || "غير متوفر"}</Text>

        <Text style={styles.label}>📧 إيميل الشركة:</Text>
        <Text style={styles.value}>{order.company?.email || "غير متوفر"}</Text>

        <Text style={styles.label}>👤 العميل:</Text>
        <Text style={styles.value}>{order.user?.name || "غير متوفر"}</Text>

        <Text style={styles.label}>📱 رقم العميل:</Text>
        <Text style={styles.value}>{order.user?.phone || "غير متوفر"}</Text>

        <Text style={styles.label}>🗓 تاريخ الطلب:</Text>
        <Text style={styles.value}>{formattedDate}</Text>

        <Text style={styles.label}>📍 العنوان:</Text>
        <Text style={styles.value}>{order.address || "غير متوفر"}</Text>

        <Text style={styles.label}>📦 الحالة:</Text>
        <Text style={styles.value}>{order.status}</Text>

        {/* اقتراح إضافي لو حابب */}
        {order.code && (
          <>
            <Text style={styles.label}>🆔 كود الطلب:</Text>
            <Text style={styles.value}>{order.code}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Layout.width(4),
    direction: "rtl",
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: Layout.font(2.2),
    color: colors.gray,
    fontWeight: "600",
    marginTop: Layout.height(1.5),
  },
  value: {
    fontSize: Layout.font(2.4),
    color: colors.black,
    marginBottom: Layout.height(1),
  },
});
