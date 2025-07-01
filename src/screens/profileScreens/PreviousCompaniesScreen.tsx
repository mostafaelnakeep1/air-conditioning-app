import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  I18nManager,
  TextInput,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../config/config";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList, Company } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../../api/apiClient";


type PreviousCompaniesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PreviousCompaniesScreen"
>;

const PreviousCompaniesScreen = () => {
  const navigation = useNavigation<PreviousCompaniesScreenNavigationProp>();
  const { userToken } = useAuth(); // جلب التوكن من الـ Context

  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const fetchCompanies = async () => {
  try {
    const res = await apiClient.get("/profile/previous-companies");

    const data = res.data;

    const sorted = data.data.sort(
      (a: Company, b: Company) =>
        new Date(b.lastInteraction || "").getTime() - new Date(a.lastInteraction || "").getTime()
    );

    setCompanies(sorted);
    setFilteredCompanies(sorted);
  } catch (error: any) {
    console.error("❌ Fetch companies error:", error.response?.data || error.message);
  }
};

  const loadFavorites = async () => {
    try {
      const fav = await AsyncStorage.getItem("favoriteCompanies");
      if (fav) setFavoriteIds(JSON.parse(fav));
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
  };

  const toggleFavorite = async (companyId: string) => {
    let updated = [...favoriteIds];
    if (updated.includes(companyId)) {
      updated = updated.filter((id) => id !== companyId);
    } else {
      updated.push(companyId);
    }
    setFavoriteIds(updated);
    await AsyncStorage.setItem("favoriteCompanies", JSON.stringify(updated));
  };

  useEffect(() => {
    fetchCompanies();
    loadFavorites();
  }, [userToken]); // نعيد الجلب لما يتغير userToken

  useEffect(() => {
    let result = [...companies];

    if (selectedCity !== "الكل") {
      result = result.filter((c) => c.city === selectedCity);
    }

    if (searchTerm.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }

    setFilteredCompanies(result);
  }, [searchTerm, selectedCity, companies]);

  const uniqueCities = ["الكل", ...Array.from(new Set(companies.map((c) => c.city).filter(Boolean)))];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث باسم الشركة"
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text ?? "")}
          textAlign="right"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityFilter}
        >
          {uniqueCities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
              onPress={() => setSelectedCity(city ?? "الكل")}
            >
              <Text
                style={{
                  color: selectedCity === city ? "#fff" : colors.black,
                  fontSize: Layout.font(1.8),
                }}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <Text style={styles.header}>شركات تم التعامل معها</Text>

          {filteredCompanies.length === 0 ? (
            <Text style={styles.noCompaniesText}>
              لم يتم التعامل مع أي شركة حتى الآن، سيتم عرض الشركات بعد أول عملية شراء
            </Text>
          ) : (
            filteredCompanies.map((company) => (
              <TouchableOpacity
                key={company._id}
                style={styles.card}
                onPress={() => navigation.navigate("CompanyDetailsScreen", { companyId: company._id })}
              >
                <Image source={{ uri: company.logo }} style={styles.logo} />
                <View style={styles.companyInfo}>
                  <View
                    style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}
                  >
                    <Text style={styles.name}>{company.name}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(company._id)}>
                      <Text style={{ fontSize: Layout.font(2.4) }}>
                        {favoriteIds.includes(company._id) ? "❤️" : "🤍"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {company.address && (
                    <Text style={styles.details}>العنوان: {company.address}</Text>
                  )}
                  {company.phone && <Text style={styles.details}>الهاتف: {company.phone}</Text>}
                  <Text style={styles.details}>
                    آخر تعامل: {company.lastInteraction ? new Date(company.lastInteraction).toLocaleDateString("ar-EG") : "-"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: Layout.width(5),
    paddingTop: Layout.height(3),
    backgroundColor: colors.background,
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: Layout.width(3),
    paddingVertical: Layout.height(1.5),
    paddingHorizontal: Layout.width(4),
    fontSize: Layout.font(2.4),
    textAlign: "right",
    color: colors.black,
  },
  cityFilter: {
    marginTop: Layout.height(1.5),
    flexDirection: "row-reverse",
  },
  cityChip: {
    paddingHorizontal: Layout.width(4),
    paddingVertical: Layout.height(1),
    backgroundColor: "#eee",
    borderRadius: Layout.width(5),
    marginRight: Layout.width(2),
  },
  cityChipActive: {
    backgroundColor: colors.primary,
  },
  scrollContainer: {
    paddingVertical: Layout.height(3),
    paddingHorizontal: Layout.width(5),
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: Layout.width(4),
    padding: Layout.width(4),
    width: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
  header: {
    fontSize: Layout.font(3.6),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    color: colors.black,
    alignSelf: "center",
    textAlign: "center",
  },
  noCompaniesText: {
    textAlign: "center",
    marginTop: Layout.height(2),
    fontSize: Layout.font(2.2),
    color: "#999",
    fontWeight: "600",
  },
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    paddingVertical: Layout.height(1),
    paddingHorizontal: Layout.width(3),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
  },
  logo: {
    width: Layout.width(14),
    height: Layout.width(14),
    borderRadius: Layout.width(2),
    marginLeft: Layout.width(3),
  },
  companyInfo: {
    flex: 1,
  },
  name: {
    fontSize: Layout.font(2.4),
    color: colors.black,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
  details: {
    fontSize: Layout.font(1.8),
    color: "#555",
    textAlign: "right",
  },
});

export default PreviousCompaniesScreen;
