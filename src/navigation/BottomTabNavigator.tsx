// src/navigation/BottomTabNavigator.tsx
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Tag, Grid3X3 , Bell, User, Settings2, Shield } from "lucide-react-native"; // أضفنا Shield
import colors from "../constants/colors";
import { Layout } from "../constants/layout";
import { useAuth } from "../context/AuthContext";

// استيراد الـ Stacks
import HomeStack from "../screens/stacks/HomeStack";
import OffersStack from "../screens/stacks/OffersStack";
import CategoriesStack from "../screens/stacks/CategoriesStack";
import NotificationsStack from "../screens/stacks/NotificationsStack";
import ProfileStack from "../screens/stacks/ProfileStack";
import CompanyStack from "../screens/stacks/CompanyStack";
import AdminStack from "../screens/stacks/AdminStack"; // استيراد الستاك الجديد

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isAdmin, isCompany, isClient, isLoggedIn } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "HomeStack":
              return <Home color={color} size={size} />;
            case "OffersStack":
              return <Tag color={color} size={size} />;
            case "CategoriesStack":
              return <Grid3X3  color={color} size={size} />;
            case "CompanyStack":
              return <Settings2 color={color} size={size} />;
            case "NotificationsStack":
              return <Bell color={color} size={size} />;
            case "ProfileStack":
              return <User color={color} size={size} />;
            case "AdminStack":
              return <Shield color={color} size={size} />; // أيقونة الإدارة
            default:
              return null;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.DarkBlue,
          height: Layout.height(8),
          paddingBottom: Layout.height(0.8),
          paddingTop: Layout.height(0.8),
          direction: "rtl",
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: Layout.font(1.6),
          fontWeight: "600",
          textAlign: "center",
          writingDirection: "rtl",
        },
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: "الرئيسية" }} />
      <Tab.Screen name="OffersStack" component={OffersStack} options={{ title: "العروض" }} />
      <Tab.Screen name="CategoriesStack" component={CategoriesStack} options={{ title: "الفئات" }} />
      {isCompany && (
      <Tab.Screen name="CompanyStack" component={CompanyStack} options={{ title: "مميز" }} />
      )}
      <Tab.Screen name="NotificationsStack" component={NotificationsStack} options={{ title: "الإشعارات" }} />
      {!isCompany && (
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: "حسابي" }} />
      )}
      {isAdmin && (
      <Tab.Screen name="AdminStack" component={AdminStack} options={{ title: "الإدارة" }} />
      )}
    </Tab.Navigator>
  );
}
