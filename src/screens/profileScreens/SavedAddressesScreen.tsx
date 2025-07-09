import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

const dummyAddresses = [
  { id: 1, title: "المنزل", details: "شارع النصر، المعادي، القاهرة" },
  { id: 2, title: "العمل", details: "شارع العليا، الرياض، السعودية" },
];

const SavedAddressesScreen = () => {
  const handleEditPress = (id: number) => {
    console.log("تعديل العنوان رقم:", id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.header}>العناوين المحفوظة</Text>

          {dummyAddresses.map((address) => (
            <View key={address.id} style={styles.card}>
              <Text style={styles.title}>{address.title}</Text>
              <Text style={styles.details}>{address.details}</Text>

              <TouchableOpacity
                style={styles.editButton}
                activeOpacity={0.7}
                onPress={() => handleEditPress(address.id)}
              >
                <Icon name="pencil" size={Layout.font(2.5)} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>إضافة عنوان جديد</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingVertical: Layout.height(4),
    paddingHorizontal: Layout.width(5),
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(4),
    padding: Layout.width(5),
    width: "100%",
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
  header: {
    fontSize: Layout.font(3.8),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    color: colors.black,
    alignSelf: "center",
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.width(4),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(2),
    position: "relative",
  },
  title: {
    fontSize: Layout.font(2.5),
    fontWeight: "bold",
    color: colors.black,
    textAlign: "right",
  },
  details: {
    fontSize: Layout.font(2),
    color: colors.gray,
    marginTop: Layout.height(0.5),
    textAlign: "right",
  },
  editButton: {
    position: "absolute",
    bottom: Layout.height(1),
    left: Layout.width(3),
    backgroundColor: colors.primary + "cc", // شفاف شوي
    padding: Layout.width(2),
    borderRadius: Layout.width(3),
  },
  button: {
    marginTop: Layout.height(3),
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.5),
    borderRadius: Layout.width(3),
    alignSelf: "center",
    minWidth: Layout.width(40),
  },
  buttonText: {
    color: colors.white,
    fontSize: Layout.font(2.3),
    fontWeight: "600",
    textAlign: "center",
  },
});

export default SavedAddressesScreen;
