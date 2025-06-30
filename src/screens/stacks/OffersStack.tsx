// src/navigation/stacks/OffersStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// شاشة العروض
import OffersScreen from "../../screens/bottomTabScreens/OffersScreen";

// لو هتضيف شاشات فرعية للعروض حطها هنا

const Stack = createNativeStackNavigator();

export default function OffersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OffersMain" component={OffersScreen} />
      {/* <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} /> */}
    </Stack.Navigator>
  );
}
