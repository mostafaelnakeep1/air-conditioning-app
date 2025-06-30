import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";


const screenWidth = Dimensions.get("window").width;



type Vendor = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
};

const vendors: Vendor[] = new Array(10).fill(null).map((_, i) => ({
  id: (i + 1).toString(),
  name: `شركة التكييف ${i + 1}`,
  image: "https://picsum.photos/600/400?random=" + (i + 10),
  location: "الرياض - السعودية",
  rating: Math.floor(Math.random() * 3) + 3,
}));

const groupItemsInPairs = (items: Vendor[]): (Vendor | undefined)[][] => {
  const grouped: (Vendor | undefined)[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    grouped.push([items[i], items[i + 1]]);
  }
  return grouped;
};

const groupedVendors = groupItemsInPairs(vendors);

const cardWidth = screenWidth * 0.6; // صغرناها شوية
const cardHeight = Layout.height(15); // أقل من السابق

export default function VendorsSection() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("AllVendorsScreen")}>
          <Text style={styles.viewAll}>عرض الكل</Text>
        </TouchableOpacity>
        <Text style={styles.title}>شركات التكييف المميزة</Text>
      </View>

      <FlatList
        data={groupedVendors}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        snapToInterval={cardWidth + Layout.width(6)} // العرض + المسافة بين الأعمدة
  decelerationRate="fast"
  snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Layout.width(3) }}
        inverted 
        renderItem={({ item }) => (
          <View style={styles.column}>
            {item.map(
              (vendor, i) =>
                vendor && (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.9}
                    style={styles.card}
                  >
                    <ImageBackground
                      source={{ uri: vendor.image }}
                      style={styles.imageBackground}
                      imageStyle={{ borderRadius: Layout.width(4) }}
                    >
                      <View style={styles.overlay} />
                      <View style={styles.content}>
                        <Text style={styles.name}>{vendor.name}</Text>
                        <Text style={styles.location}>{vendor.location}</Text>
                        <View style={styles.ratingRow}>
                          {[...Array(5)].map((_, idx) => (
                            <Text
                              key={idx}
                              style={{
                                color:
                                  idx < vendor.rating
                                    ? colors.gold
                                    : colors.white,
                                fontSize: Layout.font(1.8),
                              }}
                            >
                              ★
                            </Text>
                          ))}
                        </View>
                        <View style={styles.buttonsRow}>
                          <TouchableOpacity style={styles.buttonContact}>
                            <Text style={styles.buttonText}>تواصل</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.buttonDetails}>
                            <Text style={styles.buttonText}>التفاصيل</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.height(2),
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.height(1.5),
    paddingHorizontal: Layout.width(3),
  },
  title: {
    fontSize: Layout.font(2.6),
    fontWeight: "bold",
    color: colors.primary,
    writingDirection: "rtl",
    textAlign: "right",
  },
  viewAll: {
    fontSize: Layout.font(2),
    color: colors.gray,
    fontWeight: "500",
    writingDirection: "rtl",
    textAlign: "right",
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: cardHeight * 2 + Layout.height(2),
    marginHorizontal: Layout.width(1.5),
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: colors.black,
    borderRadius: Layout.width(4),
    overflow: "hidden",
    marginBottom: Layout.height(2),
    elevation: 6,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  content: {
    paddingHorizontal: Layout.width(4),
    paddingVertical: Layout.height(1),
  },
  name: {
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
    color: colors.white,
    marginBottom: Layout.height(0.3),
  },
  location: {
    fontSize: Layout.font(1.6),
    color: colors.white,
    marginBottom: Layout.height(0.5),
  },
  ratingRow: {
    flexDirection: "row-reverse",
  },
  buttonsRow: {
    flexDirection: "row-reverse",
    marginTop: Layout.height(1),
    gap: Layout.width(2),
  },
  buttonContact: {
    backgroundColor: colors.gold,
    paddingVertical: Layout.height(0.8),
    paddingHorizontal: Layout.width(5),
    borderRadius: Layout.width(20),
    marginLeft: Layout.width(3),
  },
  buttonDetails: {
    borderColor: colors.gold,
    borderWidth: 1,
    paddingVertical: Layout.height(0.8),
    paddingHorizontal: Layout.width(5),
    borderRadius: Layout.width(20),
  },
  buttonText: {
    fontSize: Layout.font(1.8),
    fontWeight: "bold",
    color: colors.white,
  },
});
