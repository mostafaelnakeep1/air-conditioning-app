// App.tsx
import "react-native-reanimated";
import React, { useEffect } from "react";
import { I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { enableRTL } from "./src/constants/rtlSetup";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth, useRegisterPushToken } from "./src/context/AuthContext";
import { LoadingProvider, useLoading } from "./src/context/LoadingContext";
import { AdsProvider } from "./src/context/AdsContext";
import RootNavigator from "./src/navigation/RootNavigator";
import LoadingOverlay from "./src/screens/LoadingOverlay";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FavoritesProvider } from "./src/context/FavoritesContext";


I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    enableRTL();
  }, []);

  const { userToken } = useAuth();

  useRegisterPushToken(userToken ?? "");

  return (
    <AuthProvider>
      <AdsProvider>
        <FavoritesProvider>
      <LoadingProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <LoadingOverlayWrapper />
        </SafeAreaProvider>
      </LoadingProvider>
      </FavoritesProvider>
      </AdsProvider>
    </AuthProvider>
  );
}


function LoadingOverlayWrapper() {
  const { isLoading } = useLoading();
  return <LoadingOverlay visible={isLoading} />;
}