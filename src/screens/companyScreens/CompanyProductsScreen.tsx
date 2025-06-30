// src/screens/company/CompanyProductsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  isHidden: boolean;
  isSuspended: boolean;
  type: string;
  capacity: number;
  brand: string;
  installDuration: number;
}

export default function CompanyProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);

  // للمودال تعديل المنتج
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // حقول التعديل
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editInstallDuration, setEditInstallDuration] = useState("");

  useEffect(() => {
    getCompanyId();
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchCompanyProducts();
    }
  }, [companyId, brandFilter, capacityFilter]);

  // جلب companyId من التخزين
  const getCompanyId = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      console.log("AsyncStorage userData:", userDataStr);

      if (!userDataStr) throw new Error("No user data found");
      const userData = JSON.parse(userDataStr);
      console.log("Parsed userData:", userData);
      if (userData && userData.id) {
        setCompanyId(userData.id);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error: any) {
      console.log(
        "Error fetching company data:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("خطأ", "تعذر الحصول على بيانات الشركة");
    }
  };

  const fetchCompanyProducts = async () => {
    setLoading(true);
    try {
      // بناء باراميترات الفلترة بشكل ديناميكي
      const params: Record<string, any> = { companyId };
      if (brandFilter) {
        params.brand = brandFilter;
      }
      if (capacityFilter) {
        params.capacity = capacityFilter;
      }

      const response = await apiClient.get("/products", {
        params,
      });
      setProducts(response.data.data);
    } catch (error) {
      Alert.alert("خطأ", "فشل في جلب المنتجات");
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // فتح مودال تعديل مع تعبئة الحقول
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditPrice(product.price.toString());
    setEditDescription(product.description || "");
    setEditType(product.type);
    setEditCapacity(product.capacity.toString());
    setEditBrand(product.brand);
    setEditInstallDuration(product.installDuration.toString());
    setEditModalVisible(true);
  };

  // إرسال تحديث المنتج
  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    if (
      !editPrice ||
      !editType ||
      !editCapacity ||
      !editBrand ||
      !editInstallDuration
    ) {
      Alert.alert("خطأ", "برجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        price: Number(editPrice),
        description: editDescription,
        type: editType,
        capacity: Number(editCapacity),
        brand: editBrand,
        installDuration: Number(editInstallDuration),
      };
      await apiClient.put(`/products/${selectedProduct._id}`, updateData);
      Alert.alert("نجاح", "تم تحديث المنتج");
      setEditModalVisible(false);
      fetchCompanyProducts();
    } catch (error) {
      Alert.alert("خطأ", "فشل تحديث المنتج");
      console.log("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // تعليق / إخفاء المنتج (تغيير isHidden)
  const toggleHideProduct = async (product: Product) => {
    try {
      setLoading(true);
      await apiClient.put(`/products/${product._id}`, {
        isHidden: !product.isHidden,
      });
      Alert.alert(
        "نجاح",
        product.isHidden ? "تم إظهار المنتج" : "تم إخفاء المنتج"
      );
      fetchCompanyProducts();
    } catch (error) {
      Alert.alert("خطأ", "فشل تغيير حالة المنتج");
      console.log("Error toggling hide:", error);
    } finally {
      setLoading(false);
    }
  };

  // حذف المنتج
  const handleDeleteProduct = async (productId: string) => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/products/${productId}`);
              Alert.alert("نجاح", "تم حذف المنتج");
              fetchCompanyProducts();
            } catch (error) {
              Alert.alert("خطأ", "فشل حذف المنتج");
              console.log("Error deleting product:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} جنيه</Text>
          <Text style={styles.productDesc}>{item.description || "-"}</Text>
          <Text style={styles.productInfo}>
            {item.type} {item.capacity} حصان {item.brand}
          </Text>
          <Text style={styles.productInfo}>
            مدة التركيب: {item.installDuration} دقيقة
          </Text>
          <Text style={{ color: item.isHidden ? "red" : "green" }}>
            {item.isHidden ? "معلق" : "مفعل"}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={styles.actionBtn}
          >
            <Icon name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleHideProduct(item)}
            style={styles.actionBtn}
          >
            <Icon
              name={item.isHidden ? "eye" : "eye-off"}
              size={24}
              color={item.isHidden ? "green" : "red"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteProduct(item._id)}
            style={styles.actionBtn}
          >
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>منتجاتي</Text>

            <View style={styles.filtersContainer}>
              <View style={styles.pickerWrapper}>
                <Text style={styles.label}>اختر البراند:</Text>
                <Picker
                  selectedValue={brandFilter}
                  onValueChange={(itemValue) =>
                    setBrandFilter(itemValue === "all" ? null : itemValue)
                  }
                  mode="dropdown"
                  style={styles.picker}
                >
                  <Picker.Item label="الكل" value="all" />
                  <Picker.Item label="جري" value="جري" />
                  <Picker.Item label="توشيبا" value="توشيبا" />
                  <Picker.Item label="كاريير" value="كاريير" />
                  {/* أضف البراندات حسب متطلباتك */}
                </Picker>
              </View>

              <View style={styles.pickerWrapper}>
                <Text style={styles.label}>اختر القدرة:</Text>
                <Picker
                  selectedValue={capacityFilter}
                  onValueChange={(itemValue) =>
                    setCapacityFilter(itemValue === 0 ? null : itemValue)
                  }
                  mode="dropdown"
                  style={styles.picker}
                >
                  <Picker.Item label="الكل" value={0} />
                  <Picker.Item label="1 حصان" value={1} />
                  <Picker.Item label="1.5 حصان" value={1.5} />
                  <Picker.Item label="2 حصان" value={2} />
                  <Picker.Item label="3 حصان" value={3} />
                  <Picker.Item label="5 حصان" value={5} />
                  <Picker.Item label="6 حصان" value={6} />
                  {/* أضف قدرات حسب الحاجة */}
                </Picker>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>لا توجد منتجات حالياً</Text>
          ) : null
        }
      />

      {/* مودال التعديل */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalHeader}>تعديل المنتج</Text>

              <Text style={styles.label}>السعر</Text>
              <TextInput
                style={styles.input}
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                placeholder="السعر"
                textAlign="right"
              />

              <Text style={styles.label}>الوصف</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={4}
                placeholder="الوصف"
                textAlignVertical="top"
              />

              <Text style={styles.label}>النوع</Text>
              <TextInput
                style={styles.input}
                value={editType}
                onChangeText={setEditType}
                placeholder="النوع"
                textAlign="right"
              />

              <Text style={styles.label}>القدرة</Text>
              <TextInput
                style={styles.input}
                value={editCapacity}
                onChangeText={setEditCapacity}
                keyboardType="numeric"
                placeholder="القدرة"
                textAlign="right"
              />

              <Text style={styles.label}>البراند</Text>
              <TextInput
                style={styles.input}
                value={editBrand}
                onChangeText={setEditBrand}
                placeholder="البراند"
                textAlign="right"
              />

              <Text style={styles.label}>مدة التركيب (دقائق)</Text>
              <TextInput
                style={styles.input}
                value={editInstallDuration}
                onChangeText={setEditInstallDuration}
                keyboardType="numeric"
                placeholder="مدة التركيب"
                textAlign="right"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.saveButton, { flex: 1, marginRight: 5 }]}
                  onPress={handleSaveEdit}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelButton, { flex: 1, marginLeft: 5 }]}
                  onPress={() => setEditModalVisible(false)}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>إلغاء</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: Layout.height(1),
    textAlign: "right",
    color: colors.black,
  },
  filtersContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: Layout.height(3),
    backgroundColor: colors.white,    
    padding: Layout.height(2),
    borderRadius: Layout.width(4),
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: Layout.width(5),
  },
  picker: {
    height: Layout.height(8),
    width: "100%",
    color: colors.black,
    textAlign: "right",
  },
  label: {
    fontSize: Layout.font(1.8),
    fontWeight: "600",
    marginBottom: Layout.height(0.5),
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
  },
  cardContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: Layout.font(2),
    fontWeight: "600",
    color: colors.black,
    flex: 1,
    textAlign: "right",
  },
  productPrice: {
    fontSize: Layout.font(1.8),
    color: colors.primary,
    marginVertical: 2,
  },
  productDesc: {
    fontSize: Layout.font(1.6),
    color: colors.gray,
    marginBottom: 4,
    textAlign: "right",
  },
  productInfo: {
    fontSize: Layout.font(1.6),
    color: colors.black,
    textAlign: "right",
  },
  actions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    gap: 15,
  },
  actionBtn: {
    padding: 6,
  },
  emptyText: {
    textAlign: "center",
    marginTop: Layout.height(5),
    fontSize: Layout.font(2),
    color: colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    paddingHorizontal: Layout.width(5),
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: Layout.width(4),
    padding: Layout.width(5),
    maxHeight: "90%",
  },
  modalHeader: {
    fontSize: Layout.font(3),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "right",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: Layout.width(2),
    paddingHorizontal: Layout.width(3),
    paddingVertical: Layout.height(1),
    marginBottom: Layout.height(1.5),
    fontSize: Layout.font(1.8),
    color: colors.black,
    textAlign: "right",
  },
  multiline: {
    height: Layout.height(12),
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Layout.height(2),
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.5),
    borderRadius: Layout.width(3),
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: Layout.font(2),
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#aaa",
    paddingVertical: Layout.height(1.5),
    borderRadius: Layout.width(3),
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: Layout.font(2),
    fontWeight: "bold",
  },
});
