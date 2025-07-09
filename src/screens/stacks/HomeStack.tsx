// src/navigation/stacks/HomeStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// شاشة الرئيسية
import HomeScreen from "../../screens/homeScreens/HomeScreen";
import AllVendorsScreen from "../homeScreens/AllVendorsScreen";
import { HomeStackParamList } from "../../navigation/types";
import BrandCategoriesScreen from "../homeScreens/BrandCategoriesScreen";
// لو عندك صفحات فرعية للرئيسية زي تفاصيل منتج مثلاً، ضيفها هنا
// import ProductDetailsScreen from "../../screens/homeScreens/ProductDetailsScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="AllVendorsScreen" component={AllVendorsScreen} />
      <Stack.Screen name="BrandCategoriesScreen" component={BrandCategoriesScreen} />
      {/* ممكن تضيف شاشات فرعية زي: */}
      {/* <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} /> */}
    </Stack.Navigator>
  );
}
