// src/screens/company/CompanyHomeScreen.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";

export default function CompanyScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const menuItems = [
    { title: "منتجاتي", screen: "CompanyProducts" },
    { title: "إضافة منتج جديد", screen: "AddProduct" },
    { title: "الطلبات الواردة", screen: "CompanyOrders" },
    { title: "بيانات الشركة", screen: "CompanyProfile" },
    { title: "انضم للعروض", screen: "JoinOffers" },
    { title: "الرسوم البيانية", screen: "CompanyReports" },
  ];

  const iconMap: Record<string, React.ComponentProps<typeof Icon>["name"]> = {
    CompanyProducts: "air-conditioner",
    AddProduct: "plus-box",
    CompanyOrders: "clipboard-list",
    CompanyProfile: "store-settings",
    JoinOffers: "tag-plus",
    CompanyReports: "chart-bar",
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // امسح التوكن
      logout(); // حدث حالة الدخول في الكونتكست

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        })
      );
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج");
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>🏢 لوحة تحكم الشركة</Text>

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

          <Pressable onPress={handleLogout}>
            <Animated.View style={[styles.card, { backgroundColor: "#fff0f0" }]}>
              <View style={styles.cardContent}>
                <View style={styles.iconWrapperLogout}>
                  <Icon name="logout" size={Layout.font(2.5)} color="#d00" />
                </View>
                <Text style={[styles.cardText, { color: "#d00" }]}>تسجيل الخروج</Text>
              </View>
            </Animated.View>
          </Pressable>

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
    paddingVertical: Layout.height(5),
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
  iconWrapperLogout: {
    backgroundColor: "#ff000020",
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
