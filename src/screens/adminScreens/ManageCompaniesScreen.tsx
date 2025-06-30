import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import apiClient from "../../api/apiClient";

import { differenceInDays, format } from "date-fns";
import { ar } from "date-fns/locale";

type NavigationProp = StackNavigationProp<RootStackParamList, "ManageCompaniesScreen">;

interface Company {
  _id: string;
  name: string;
  createdAt: string;
  subscriptionEnd: string; // تاريخ نهاية الاشتراك
}

export default function ManageCompaniesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await apiClient.get("/admin/companies");
      setCompanies(res.data);
    } catch (error) {
      console.error("Fetch companies error:", error);
      Alert.alert("خطأ", "حدث خطأ في جلب بيانات الشركات");
    }
  };

  const handleExtend = async (companyId: string) => {
    try {
      await apiClient.post(`/admin/companies/${companyId}/extend`);
      Alert.alert("✅", "تم تمديد الاشتراك 30 يوم إضافية");
      fetchCompanies();
    } catch (error) {
      console.error("Extend error:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تمديد الاشتراك");
    }
  };

  const renderCompany = ({ item }: { item: Company }) => {
    const remainingDays = differenceInDays(new Date(item.subscriptionEnd), new Date());
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("CompanyDetailsScreen", { companyId: item._id })}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>
          انضم بتاريخ: {format(new Date(item.createdAt), "PPP")}
        </Text>
        <Text style={styles.remainingDays}>
          باقي {remainingDays} يوم من أصل 30 يوم
        </Text>
        <TouchableOpacity
          style={styles.extendButton}
          onPress={() => handleExtend(item._id)}
        >
          <Text style={styles.extendButtonText}>تمديد 30 يوم إضافية</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏢 إدارة الشركات</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item._id}
        renderItem={renderCompany}
        contentContainerStyle={{ paddingBottom: 20, direction: "rtl" }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Layout.width(4),
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: Layout.font(2.5),
    fontWeight: "600",
    color: colors.black,
  },
  date: {
    fontSize: Layout.font(2),
    color: colors.gray,
    marginTop: 5,
  },
  remainingDays: {
    fontSize: Layout.font(2),
    color: colors.primary,
    marginTop: 5,
  },
  extendButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.2),
    borderRadius: Layout.width(2),
    alignItems: "center",
  },
  extendButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: Layout.font(2),
  },
});
