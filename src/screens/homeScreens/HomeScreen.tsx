import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBar from "./SearchBar";
import BrandsSection from "./BrandsSection";
import AdBanner from "./AdBanner";
import VendorsSection from "./VendorsSection";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <SearchBar />
        <BrandsSection />
        <AdBanner />
        <VendorsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: Layout.height(3),
    direction: "rtl", // خلي اتجاه الصفحة كلها من اليمين لليسار
  },
});
