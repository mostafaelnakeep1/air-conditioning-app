import React, { useEffect } from "react";
import { SafeAreaView, Image, Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../navigation/types";

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "SplashScreen">;

export default function SplashScreen() {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: isLoggedIn ? "MainApp" : "LoginScreen" }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../imags/R.webp")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>أهلاً بك في تطبيق تكييفاتنا</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.width(10),
  },
  logo: {
    width: Layout.width(40),
    height: Layout.width(40),
    marginBottom: Layout.height(3),
    borderRadius: Layout.width(20),
  },
  welcomeText: {
    fontSize: Layout.font(3),
    color: colors.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
});
