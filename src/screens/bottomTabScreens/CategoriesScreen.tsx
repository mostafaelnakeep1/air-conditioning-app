import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Modal,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import { Product } from "../../navigation/types";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

const screenWidth = Dimensions.get("window").width;
const IMAGE_BASE_URL = "http://192.168.82.48:5001/uploads/";

const CategoriesScreen = () => {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [power, setPower] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"sold" | "rating" | "">("");
  const [isGrid, setIsGrid] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<"brand" | "power" | "price" | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    fetchProducts();
  }, [search, brand, power, minPrice, maxPrice, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Token:", token);
      const { data } = await apiClient.get("/products/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { search, brand, capacity: power, minPrice, maxPrice, sortBy },
      });
      setProducts(data.products);
    } catch (err) {
      console.log("Error fetching products", JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setBrand("");
    setPower("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      alert(message);
    }
  };

  const handleToggleFavorite = (product: Product) => {
    const isFav = favorites.some((p) => p._id === product._id);
    toggleFavorite(product);
    showToast(isFav ? "تم إزالة المنتج من المفضلة" : "تم إضافة المنتج للمفضلة");
  };

  const renderProduct = ({ item }: { item: Product }) => {
    if (!item || !item._id) return null;
    const isFavorite = favorites.some((f) => f._id === item._id);

    return (
      <ImageBackground
        source={{ uri: IMAGE_BASE_URL + item.image }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.15, borderRadius: 16 }}
        style={[styles.card, isGrid && styles.gridCard]}
      >
        <View style={styles.cardContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>القدرة: {item.capacity}</Text>
            <Text style={styles.details}>السعر: {item.price} ج</Text>
            <Text style={styles.details}>الشركة: {item.company?.name || "غير محددة"}</Text>
            {/* لو عندك مبيعات وتقييم تقدر تضيف هنا */}
            {/* <Text style={styles.details}>مبيعات: {item.sold} | تقييم: ⭐ {item.rating}</Text> */}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="cart-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleToggleFavorite(item)}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  };

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowScrollTop(y > 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="ابحث باسم المنتج، الشركة، البراند..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filtersContainer}>
        <TouchableOpacity onPress={() => setActiveFilter("brand")} style={styles.filterBtn}>
          <Text style={styles.filterText}>البراند</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveFilter("power")} style={styles.filterBtn}>
          <Text style={styles.filterText}>القدرة</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveFilter("price")} style={styles.filterBtn}>
          <Text style={styles.filterText}>السعر</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setSortBy(sortBy === "sold" ? "rating" : "sold")}
          style={styles.filterBtn}
        >
          <Text style={styles.filterText}>
            {sortBy === "sold" ? "الأعلى تقييمًا" : "الأكثر مبيعًا"}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => setIsGrid(!isGrid)} style={styles.filterBtn}>
          <Ionicons name={isGrid ? "list" : "grid"} size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetFilters} style={styles.filterBtn}>
          <Text style={{ color: colors.danger }}>إعادة تعيين</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={!!activeFilter} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActiveFilter(null)}
          activeOpacity={1}
        >
          <View style={styles.modalBox}>
            {activeFilter === "brand" && (
              <TextInput
                placeholder="ادخل البراند"
                style={styles.filterInput}
                value={brand}
                onChangeText={setBrand}
              />
            )}
            {activeFilter === "power" && (
              <TextInput
                placeholder="ادخل القدرة"
                style={styles.filterInput}
                value={power}
                onChangeText={setPower}
              />
            )}
            {activeFilter === "price" && (
              <View style={styles.filterBoxRow}>
                <TextInput
                  placeholder="من"
                  style={[styles.filterInput, { flex: 1 }]}
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
                <TextInput
                  placeholder="إلى"
                  style={[styles.filterInput, { flex: 1, marginStart: 8 }]}
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={products}
          key={isGrid ? "g" : "l"}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderProduct}
          numColumns={isGrid ? 2 : 1}
          contentContainerStyle={{ paddingBottom: 80 }}
          columnWrapperStyle={isGrid ? { gap: 10, justifyContent: "space-between" } : undefined}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
        />
      )}

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopBtn}
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Ionicons name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Layout.defaultPadding,
    paddingTop: Layout.height(7),
  },
  search: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    textAlign: "right",
  },
  filtersContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  filterBtn: {
    backgroundColor: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    minHeight: 35,
    justifyContent: "center",
  },
  filterText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "85%",
  },
  filterBoxRow: {
    flexDirection: "row-reverse",
    gap: 10,
  },
  filterInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "right",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    overflow: "hidden",
    flex: 1,
  },
  gridCard: {
    maxWidth: (screenWidth - Layout.defaultPadding * 2 - 10) / 2,
  },
  cardContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "right",
  },
  details: {
    fontSize: 13,
    color: colors.DarkBlue,
    marginTop: 2,
    textAlign: "right",
  },
  actions: {
    marginStart: 10,
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
    elevation: 2,
  },
  scrollTopBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 50,
    elevation: 5,
  },
});
