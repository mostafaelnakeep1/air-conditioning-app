import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";

// ثابت لكل البراندات
const categories = [
  { id: "1", name: "1.5 حصان", image: require("../../imags/lg.png"), priceFrom: 6000, priceTo: 8000 },
  { id: "2", name: "2.25 حصان", image: require("../../imags/lg.png"), priceFrom: 8000, priceTo: 10000 },
  { id: "3", name: "3 حصان", image: require("../../imags/lg.png"), priceFrom: 10000, priceTo: 12000 },
  { id: "4", name: "5 حصان", image: require("../../imags/lg.png"), priceFrom: 13000, priceTo: 16000 },
  { id: "5", name: "7 حصان", image: require("../../imags/lg.png"), priceFrom: 18000, priceTo: 22000 },
];

export default function BrandCategoriesScreen() {
  const route = useRoute<RouteProp<{ params: { brandName: string } }, "params">>();
  const { brandName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>فئات {brandName}</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>السعر: من {item.priceFrom} إلى {item.priceTo} ج</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.width(4),
    backgroundColor: colors.background,
  },
  title: {
    fontSize: Layout.font(3.2),
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: Layout.height(2),
    textAlign: "right",
  },
  list: {
    gap: Layout.height(2),
  },
  card: {
    flexDirection: "row-reverse",
    backgroundColor: "#fff",
    borderRadius: Layout.width(2),
    padding: Layout.width(3),
    alignItems: "center",
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: Layout.width(20),
    height: Layout.width(20),
    resizeMode: "contain",
    marginLeft: Layout.width(3),
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: Layout.height(0.5),
    textAlign: "right",
  },
  price: {
    fontSize: Layout.font(2),
    color: colors.gray,
    textAlign: "right",
  },
});
