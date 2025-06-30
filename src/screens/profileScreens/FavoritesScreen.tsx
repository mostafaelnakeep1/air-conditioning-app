// src/screens/profileScreens/FavoritesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import { Trash2 } from "lucide-react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useFavorites } from "../../context/FavoritesContext";

const FavoritesScreen = () => {
  const { favorites, removeFavorite } = useFavorites();

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      alert(message);
    }
  };

  const handleRemove = (id: string) => {
    removeFavorite(id);
    showToast("تمت إزالة المنتج من المفضلة");
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>لا توجد منتجات مضافة للمفضلة بعد</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>المفضلة</Text>

      {favorites.map((item) => (
        <View key={item._id} style={styles.card}>
          <TouchableOpacity
            style={styles.removeIcon}
            onPress={() => handleRemove(item._id)}
          >
            <View style={styles.iconWrapper}>
              <Trash2 size={Layout.width(5)} color={colors.danger} />
            </View>
          </TouchableOpacity>

          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardCompany}>من: {item.company?.name || "غير محددة"}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: Layout.height(5),
  },
  content: {
    padding: Layout.width(4),
  },
  title: {
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "right",
    color: colors.primary,
  },
  card: {
    position: "relative",
    flexDirection: "row-reverse",
    backgroundColor: colors.white,
    padding: Layout.width(3),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(2),
    borderWidth: 0.1,
    borderColor: colors.black,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  removeIcon: {
    position: "absolute",
    bottom: Layout.height(1.5),
    left: Layout.width(2),
    zIndex: 1,
  },
  iconWrapper: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(6),
    borderColor: colors.black,
    borderWidth: 0.2,
    padding: Layout.width(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: Layout.width(24),
    height: Layout.width(24),
    borderRadius: Layout.width(2),
    marginLeft: Layout.width(3),
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Layout.font(2.2),
    fontWeight: "700",
    color: colors.black,
    marginBottom: Layout.height(0.5),
    textAlign: "right",
  },
  cardCompany: {
    fontSize: Layout.font(1.8),
    color: colors.black,
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  emptyText: {
    fontSize: Layout.font(2.2),
    color: colors.DarkBlue,
    textAlign: "center",
  },
});
