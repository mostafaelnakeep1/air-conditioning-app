// src/screens/admin/ManageProductsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Product } from "../../navigation/types";

export default function ManageProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/products/all");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      Alert.alert("خطأ", "فشل في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (productId: string, currentVisibility: boolean) => {
    try {
      await apiClient.patch(`/products/${productId}/toggle-visibility`);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isHidden: !currentVisibility } : p
        )
      );
    } catch (error) {
      Alert.alert("خطأ", "فشل في تحديث حالة المنتج");
    }
  };

  const deleteProduct = async (productId: string) => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/products/${productId}`);
              setProducts((prev) => prev.filter((p) => p._id !== productId));
            } catch (error) {
              Alert.alert("خطأ", "فشل في حذف المنتج");
            }
          },
        },
      ],
      { cancelable: true }
    );
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
      <Text style={styles.title}>📦 إدارة المنتجات</Text>
      {products.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>لا توجد منتجات حالياً</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ direction: "rtl" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProductDetailsScreen", { product: item })
                  }
                >
                  <Text style={styles.name}>🧊 {item.name}</Text>
                  <Text style={styles.brand}>🏷️ {item.brand}</Text>
                  <Text style={styles.company}>🏢 {item.company?.name || "غير معروف"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    item.isHidden ? styles.showButton : styles.hideButton,
                  ]}
                  onPress={() => toggleVisibility(item._id, item.isHidden)}
                >
                  <Text style={styles.buttonText}>
                    {item.isHidden ? "إظهار" : "تعليق"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => deleteProduct(item._id)}
                >
                  <Text style={styles.buttonText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Layout.width(4),
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: Layout.height(1),
    paddingHorizontal: Layout.width(3),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: Layout.height(7), // ارتفاع أقل للكارد
  },
  infoContainer: {
    flex: 1,
    paddingRight: Layout.width(2),
  },
  name: {
    fontSize: Layout.font(2.3),
    fontWeight: "600",
    color: colors.black,
  },
  brand: {
    fontSize: Layout.font(2),
    color: colors.gray,
  },
  company: {
    fontSize: Layout.font(1.8),
    color: colors.gray,
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingVertical: Layout.height(0.6),
    paddingHorizontal: Layout.width(3),
    borderRadius: Layout.width(2),
    marginLeft: Layout.width(2),
  },
  hideButton: {
    backgroundColor: "#f39c12",
  },
  showButton: {
    backgroundColor: "#27ae60",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: Layout.font(1.8),
  },
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
