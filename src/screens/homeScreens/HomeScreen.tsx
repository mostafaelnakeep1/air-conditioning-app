import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { differenceInDays } from "date-fns";
import apiClient from "../../api/apiClient";
import axios from "axios";
import SearchBar from "./SearchBar";
import BrandsSection from "./BrandsSection";
import AdBanner from "./AdBanner";
import VendorsSection, { Vendor } from "./VendorsSection";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";

type Company = {
  _id: string;
  name: string;
  image: string;
  subscriptionEnd: string;
};

export default function HomeScreen() {
  const [topVendors, setTopVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiClient.get("/companies/top");
        const companies: Company[] = res.data;

        const top = companies
          .filter((item) => differenceInDays(new Date(item.subscriptionEnd), new Date()) > 0)
          .slice(0, 10)
          .map((item) => ({
            id: item._id,
            name: item.name,
            image: item.image || "https://picsum.photos/600/400",
            location: "الموقع غير محدد",
            rating: 4,
            address: "العنوان غير متوفر",
            phone: "0500000000",
            clientsCount: Math.floor(Math.random() * 100) + 50,
          }));

        setTopVendors(res.data);
      } catch (error) {
        console.error("فشل تحميل الشركات:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <SearchBar />
        <BrandsSection />
        <AdBanner />
        <VendorsSection vendors={topVendors} />
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
    direction: "rtl",
  },
});
