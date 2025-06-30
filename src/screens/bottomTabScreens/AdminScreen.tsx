// src/screens/admin/AdminHomeScreen.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation } from "@react-navigation/native";
import AdminSendNotificationScreen from "../adminScreens/AdminSendNotificationScreen";

export default function AdminHomeScreen() {
  const navigation = useNavigation();

  const menuItems = [
    { title: "العملاء", screen: "ManageClients" },
    { title: "الشركات", screen: "ManageCompanies" },
    { title: "المنتجات", screen: "ManageProducts" },
    { title: "الطلبات", screen: "ManageOrders" },
    { title: "الإعلانات", screen: "AdsManagementScreen" },
    { title: "ترقية مستخدم", screen: "PromoteUser" },
    { title: "إنشاء إشعار", screen: "AdminSendNotificationScreen" },
    { title: "الشركات المعلقة", screen: "PendingCompaniesScreen" },
    { title: "تقارير التطبيق", screen: "AdminReports" },
  ];

  const iconMap: Record<string, React.ComponentProps<typeof Icon>["name"]> = {
    ManageClients: "account-multiple",
    ManageCompanies: "office-building",
    ManageProducts: "package-variant-closed",
    ManageOrders: "clipboard-list-outline",
    PromoteUser: "account-arrow-up",
    AdminReports: "chart-bar",
    AdminSendNotificationScreen: "bell-plus",
    AdsManagementScreen: "bullhorn-variant",
    PendingCompaniesScreen: "timer-sand",
  };

  const scalesRef = useRef(menuItems.map(() => new Animated.Value(1)));

  const handlePressIn = (index: number) => {
    Animated.spring(scalesRef.current[index], {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scalesRef.current[index], {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* <Text style={styles.header}>🛠️ لوحة تحكم الأدمن</Text> */}

          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              onPress={() => navigation.navigate(item.screen as never)}
            >
              <Animated.View
                style={[styles.card, { transform: [{ scale: scalesRef.current[index] }] }]}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <Icon
                      name={iconMap[item.screen]}
                      size={Layout.font(2.5)}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              </Animated.View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ICON_SIZE = Layout.font(2.5);
const ICON_RADIUS = ICON_SIZE + Layout.width(2.5);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: Layout.width(5),
    backgroundColor: colors.background,
    paddingVertical: Layout.height(8),
  },
  header: {
    fontSize: Layout.font(3.8),
    fontWeight: "bold",
    marginBottom: Layout.height(4),
    alignSelf: "center",
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(4),
    marginBottom: Layout.height(1.2),
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Layout.height(0.8) },
    shadowOpacity: 0.1,
    shadowRadius: Layout.width(1.5),
  },
  cardContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: colors.primary + "20",
    padding: Layout.width(2),
    borderRadius: ICON_RADIUS,
    marginLeft: Layout.width(3),
  },
  cardText: {
    fontSize: Layout.font(2.3),
    color: colors.black,
    fontWeight: "500",
  },
});
