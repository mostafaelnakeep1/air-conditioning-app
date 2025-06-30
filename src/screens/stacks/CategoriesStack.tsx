// src/screens/stacks/CategoriesStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../bottomTabScreens/CategoriesScreen"; // هنفترض دي الشاشة الرئيسية

const Stack = createNativeStackNavigator();

export default function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} />
    </Stack.Navigator>
  );
}
