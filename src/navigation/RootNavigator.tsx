// src/navigation/RootNavigator.tsx
import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

import SplashScreen from "../screens/loginScreens/SplashScreen";
import LoginScreen from "../screens/loginScreens/LoginScreen";
import RegisterScreen from "../screens/loginScreens/RegisterScreen";

import BottomTabNavigator from "./BottomTabNavigator";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

function TemporarySplash() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20 }}>جارٍ التحميل...</Text>
    </View>
  );
}


export default function RootNavigator() {
  const { isLoggedIn, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <SplashScreen   />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
         <Stack.Screen name="SplashScreen" component={SplashScreen} />
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
