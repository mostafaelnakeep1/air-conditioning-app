// OrderDetailsScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  I18nManager,
} from "react-native";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";

const OrderDetailsScreen = ({ route }: any) => {
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>تفاصيل الطلب</Text>

        <View style={styles.card}>
          <Text style={styles.row}>
            رقم الطلب: #{order._id.slice(-6)}
          </Text>
          <Text style={styles.row}>
            الحالة: {order.status}
          </Text>
          <Text style={styles.row}>
            التاريخ:{" "}
            {new Date(order.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.row}>
            الإجمالي: {order.totalPrice.toLocaleString("ar-EG")} جنيه
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: Layout.width(5),
  },
  header: {
    fontSize: Layout.font(3.6),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    color: colors.black,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: Layout.width(3),
    padding: Layout.height(3),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  row: {
    fontSize: Layout.font(2.4),
    color: colors.black,
    marginBottom: Layout.height(1),
    textAlign: "right",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
});

export default OrderDetailsScreen;
