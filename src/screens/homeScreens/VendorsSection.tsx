import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { I18nManager } from "react-native";

I18nManager.forceRTL(true);
const screenWidth = Dimensions.get("window").width;

type Vendor = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  address?: string;
  phone?: string;
  clientsCount?: number;
};

const vendors: Vendor[] = new Array(10).fill(null).map((_, i) => ({
  id: (i + 1).toString(),
  name: `شركة التكييف ${i + 1}`,
  image: "https://picsum.photos/600/400?random=" + (i + 10),
  location: "الرياض - السعودية",
  rating: Math.floor(Math.random() * 3) + 3,
  address: "الرياض، شارع التبريد",
  phone: "0501234567",
  clientsCount: 120 + i,
}));

const groupItemsInPairs = (items: Vendor[]): (Vendor | undefined)[][] => {
  const grouped: (Vendor | undefined)[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    grouped.push([items[i], items[i + 1]]);
  }
  return grouped;
};

const groupedVendors = groupItemsInPairs(vendors);

const cardWidth = screenWidth * 0.6;
const cardHeight = Layout.height(15);

export default function VendorsSection() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const modalScale = useRef(new Animated.Value(0)).current;

  const showModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    Animated.spring(modalScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedVendor(null));
  };

  const callPhone = (phone: string) => {
  const phoneNumber = `tel:${phone}`;
  Linking.openURL(phoneNumber);
};

const openWhatsApp = (phone: string) => {
  const url = `https://wa.me/${phone.replace(/^0/, "966")}`; // كود السعودية
  Linking.openURL(url);
};


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
        snapToInterval={cardWidth + Layout.width(6)}
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
                        <View style={[styles.ratingRow, { justifyContent: "flex-end" }]}>
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
                          <TouchableOpacity
                            style={styles.buttonDetails}
                            onPress={() => showModal(vendor)}
                          >
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

      {/* مودال التفاصيل */}
      <Modal visible={selectedVendor !== null} transparent animationType="none" presentationStyle="overFullScreen">
        {selectedVendor && (
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={modalStyles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View style={[modalStyles.modalCard, { transform: [{ scale: modalScale }], direction: "rtl" }, ]}>
                  <ScrollView>
                    <ImageBackground
                      source={{ uri: selectedVendor?.image }}
                      style={modalStyles.modalImage}
                      imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                    >
                      <View style={modalStyles.detailsOverlay} />
                      <Text style={modalStyles.detailsName}>{selectedVendor?.name}</Text>
                    </ImageBackground>

                    <View style={modalStyles.detailsContent}>
                      <Text style={modalStyles.detailsLabel}>العنوان:</Text>
                      <Text style={modalStyles.detailsText}>{selectedVendor?.address}</Text>

                      <Text style={modalStyles.detailsLabel}>رقم الهاتف:</Text>
                      <Text style={modalStyles.detailsText}>{selectedVendor?.phone}</Text>

                      <Text style={modalStyles.detailsLabel}>عدد العملاء:</Text>
                      <Text style={modalStyles.detailsText}>{selectedVendor?.clientsCount}</Text>

                      <Text style={modalStyles.detailsLabel}>التقييم:</Text>
                      <View style={modalStyles.ratingRow}>
                        {[...Array(5)].map((_, i) => (
                          <Text
                            key={i}
                            style={
                              i < selectedVendor.rating
                                ? modalStyles.star
                                : modalStyles.starInactive
                            }
                          >
                            ★
                          </Text>
                        ))}
                      </View>
                      <View style={modalStyles.buttonsRow}>
                        <TouchableOpacity
                          style={[modalStyles.actionButton, { backgroundColor: colors.primary }, { direction: "rtl" }]}
                          onPress={() => callPhone(selectedVendor.phone!)}
                        >
                          <Text style={modalStyles.actionButtonText}>اتصال</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[modalStyles.actionButton, { backgroundColor: "#25D366" }]}
                          onPress={() => openWhatsApp(selectedVendor.phone!)}
                        >
                          <Text style={modalStyles.actionButtonText}>واتساب</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </ScrollView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Modal>
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

// التنسيقات الخاصة بالمودال
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    height: "65%",
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalImage: {
    height: Layout.height(20),
    justifyContent: "flex-end",
    padding: Layout.width(4),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  detailsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailsName: {
    fontSize: Layout.font(2.8),
    color: "#fff",
    fontWeight: "bold",
    textAlign: "right",
      writingDirection: "rtl",
  },
  detailsContent: {
    paddingHorizontal: Layout.width(5),
    paddingTop: Layout.height(2),
  },
  detailsLabel: {
    fontSize: Layout.font(2),
    fontWeight: "bold",
    marginTop: Layout.height(2),
    marginBottom: Layout.height(0.5),
    textAlign: "right",
    color: colors.primary,
      writingDirection: "rtl",
  },
  detailsText: {
    fontSize: Layout.font(1.9),
    color: colors.black,
    textAlign: "right",
      writingDirection: "rtl",
  },
  ratingRow: {
    flexDirection: "row-reverse",
    marginTop: Layout.height(1),
  },
  star: {
    color: colors.gold,
    fontSize: Layout.font(2.2),
  },
  starInactive: {
    color: "#ccc",
    fontSize: Layout.font(2.2),
  },
  buttonsRow: {
  flexDirection: "row-reverse",
  justifyContent: "space-around",
  marginTop: Layout.height(3),
  paddingBottom: Layout.height(2),
  },
  actionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: Layout.height(1.2),
    paddingHorizontal: Layout.width(6),
    borderRadius: 30,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: Layout.font(1.9),
    fontWeight: "bold",
    marginRight: Layout.width(2),
  },
});
