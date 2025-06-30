import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";

type Product = {
  _id: string;
  name: string;
  brand: string;
  description?: string;
  price?: number;
  createdAt?: string;
};

type RouteParams = {
  ProductDetailsScreen: { product: Product };
};

export default function ProductDetailsScreen() {
  const route = useRoute<RouteProp<RouteParams, "ProductDetailsScreen">>();
  const { product } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📄 تفاصيل المنتج</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🧊 الاسم:</Text>
        <Text style={styles.value}>{product.name}</Text>

        <Text style={styles.label}>🏷️ البراند:</Text>
        <Text style={styles.value}>{product.brand}</Text>

        {product.description && (
          <>
            <Text style={styles.label}>📝 الوصف:</Text>
            <Text style={styles.value}>{product.description}</Text>
          </>
        )}

        {product.price !== undefined && (
          <>
            <Text style={styles.label}>💰 السعر:</Text>
            <Text style={styles.value}>{product.price} ج.م</Text>
          </>
        )}

        {product.createdAt && (
          <>
            <Text style={styles.label}>📅 تاريخ الإضافة:</Text>
            <Text style={styles.value}>
              {new Date(product.createdAt).toLocaleDateString("ar-EG")}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.width(4),
    backgroundColor: colors.background,
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: Layout.font(2.2),
    color: colors.gray,
    marginTop: Layout.height(1),
  },
  value: {
    fontSize: Layout.font(2.4),
    color: colors.black,
    fontWeight: "600",
    marginBottom: Layout.height(1),
  },
});
