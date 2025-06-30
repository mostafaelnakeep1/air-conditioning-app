import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";

// صور محلية للبراندات
const vendors = [
  {
    id: 1,
    name: "سامسونج",
    image: require("../../imags/samsung.png"),
  },
  {
    id: 2,
    name: "ال جي",
    image: require("../../imags/lg.png"),
  },
  {
    id: 3,
    name: "شارب",
    image: require("../../imags/Sharp.png"),
  },
  {
    id: 4,
    name: "توشيبا",
    image: require("../../imags/toshiba.png"),
  },
  {
    id: 5,
    name: "كارير",
    image: require("../../imags/carrier.png"),
  },
  {
    id: 6,
    name: "كارير",
    image: require("../../imags/gree.png"),
  },
];

export default function BrandsSection() {
  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <View style={styles.circle}>
              <Image source={item.image} style={styles.logo} />
            </View>            
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const circleSize = Layout.width(30);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.width(3),
    marginVertical: Layout.height(2),
  },
  list: {
    gap: Layout.width(2),
  },
  item: {
    alignItems: "center",
    marginHorizontal: Layout.width(1),
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  logo: {
    width: circleSize * 0.7,
    height: circleSize * 0.7,
    resizeMode: "contain",
  },
  name: {
    fontSize: Layout.font(1.8),
    color: colors.black,
    writingDirection: "rtl",
  },
});
