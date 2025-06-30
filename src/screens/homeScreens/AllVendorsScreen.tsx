import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

const vendors = new Array(20).fill(null).map((_, i) => ({
  id: (i + 1).toString(),
  name: `شركة التكييف ${i + 1}`,
  image: "https://picsum.photos/600/400?random=" + (i + 30),
  location: "القاهرة - مصر",
  rating: Math.floor(Math.random() * 3) + 3,
  phone: "01001234567",
  address: "١٥ شارع الحرية، مدينة نصر، القاهرة",
  clientsCount: Math.floor(Math.random() * 200) + 50,
  whatsapp: "01001234567",
}));

export default function AllVendorsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const modalScale = useRef(new Animated.Value(0)).current;

  const showModal = (vendor: any) => {
    setSelectedVendor(vendor);
    Animated.spring(modalScale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedVendor(null));
  };

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openWhatsApp = (phone: string) => {
    const url = `whatsapp://send?phone=+20${phone.replace(/^0/, "")}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) Linking.openURL(url);
        else alert("تأكد من تثبيت واتساب");
      })
      .catch((err) => console.error("WhatsApp Error", err));
  };

  const renderVendorCard = (vendor: any) => (
    <TouchableOpacity
      key={vendor.id}
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => showModal(vendor)}
    >
      <ImageBackground
        source={{ uri: vendor.image }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.name}>{vendor.name}</Text>
          <Text style={styles.location}>{vendor.location}</Text>
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Text
                key={i}
                style={i < vendor.rating ? styles.star : styles.starInactive}
              >
                ★
              </Text>
            ))}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* شريط البحث */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="ابحث عن شركة..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* قائمة الشركات */}
      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderVendorCard(item)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* شاشة التفاصيل (Modal) */}
      <Modal visible={selectedVendor !== null} transparent animationType="none">
  {selectedVendor && (
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}>
                <ScrollView>
                  <ImageBackground
                    source={{ uri: selectedVendor?.image }}
                    style={styles.modalImage}
                    imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                  >
                    <View style={styles.detailsOverlay} />
                    <Text style={styles.detailsName}>{selectedVendor?.name}</Text>
                  </ImageBackground>

                  <View style={styles.detailsContent}>
                    <Text style={styles.detailsLabel}>العنوان:</Text>
                    <Text style={styles.detailsText}>{selectedVendor?.address}</Text>

                    <Text style={styles.detailsLabel}>رقم الهاتف:</Text>
                    <Text style={styles.detailsText}>{selectedVendor?.phone}</Text>

                    <Text style={styles.detailsLabel}>عدد العملاء:</Text>
                    <Text style={styles.detailsText}>{selectedVendor?.clientsCount}</Text>

                    <Text style={styles.detailsLabel}>التقييم:</Text>
                    <View style={styles.ratingRow}>
                      {[...Array(5)].map((_, i) => (
                        <Text
                          key={i}
                          style={
                            i < selectedVendor.rating ? styles.star : styles.starInactive
                          }
                        >
                          ★
                        </Text>
                      ))}
                    </View>

                    <View style={styles.buttonsRow}>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => callPhone(selectedVendor.phone)}
                      >
                        <Ionicons name="call" size={22} color="#fff" />
                        <Text style={styles.actionButtonText}>اتصال</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: "#25D366" }]}
                        onPress={() => openWhatsApp(selectedVendor.whatsapp)}
                      >
                        <Ionicons name="logo-whatsapp" size={22} color="#fff" />
                        <Text style={styles.actionButtonText}>واتساب</Text>
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
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Layout.height(5),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: Layout.width(4),
    marginBottom: Layout.height(2),
    paddingVertical: Layout.height(1),
    paddingHorizontal: Layout.width(4),
    borderRadius: Layout.width(3),
    elevation: 2,
  },
  searchIcon: {
    marginRight: Layout.width(2),
  },
  searchInput: {
    flex: 1,
    fontSize: Layout.font(2),
    textAlign: "right",
    writingDirection: "rtl",
    color: colors.black,
  },
  list: {
    paddingHorizontal: Layout.width(4),
  },
  card: {
    height: Layout.height(20),
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: colors.white,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  content: {
    padding: Layout.width(3),
  },
  name: {
    color: colors.white,
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
    textAlign: "right",
  },
  location: {
    color: colors.white,
    fontSize: Layout.font(1.6),
    marginTop: 2,
    textAlign: "right",
  },
  ratingRow: {
    flexDirection: "row-reverse",
    marginTop: 6,
  },
  star: {
    color: colors.gold,
    fontSize: Layout.font(1.8),
  },
  starInactive: {
    color: "#ccc",
    fontSize: Layout.font(1.8),
  },

  // Modal & تفاصيل
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
  },
  detailsText: {
    fontSize: Layout.font(1.9),
    color: colors.black,
    textAlign: "right",
  },
  buttonsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginTop: Layout.height(4),
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
