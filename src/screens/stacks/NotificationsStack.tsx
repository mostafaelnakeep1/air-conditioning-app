// src/navigation/stacks/NotificationsStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// شاشة الإشعارات
import NotificationsScreen from "../../screens/bottomTabScreens/NotificationsScreen";

// ممكن تضيف شاشات فرعية لاحقًا

const Stack = createNativeStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
