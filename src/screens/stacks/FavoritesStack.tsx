// src/navigation/stacks/FavoritesStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// شاشة المفضلة
import FavoritesScreen from "../profileScreens/FavoritesScreen";

// لو فيه صفحات فرعية زي تفاصيل منتج مفضل

const Stack = createNativeStackNavigator();

export default function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      {/* <Stack.Screen name="FavoriteDetails" component={FavoriteDetailsScreen} /> */}
    </Stack.Navigator>
  );
}
