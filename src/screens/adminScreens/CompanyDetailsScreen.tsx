// src/screens/adminScreens/CompanyDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import axios from "axios";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { BASE_URL } from "../../config/config";
import { format } from "date-fns";
import { RootStackParamList } from "../../navigation/types";
import apiClient from "../../api/apiClient";

type CompanyDetailsRouteProp = RouteProp<RootStackParamList, "CompanyDetailsScreen">;

export default function CompanyDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "CompanyDetailsScreen">>();
  const { companyId } = route.params;

  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

const fetchCompanyDetails = async () => {
  try {
    const res = await apiClient.get(`/admin/companies/${companyId}`);
    setCompany(res.data);
  } catch (error) {
    console.error("Company details error:", error);
  }
};


  const toggleSuspend = async () => {
  try {
    await apiClient.patch(`/admin/companies/${companyId}/suspend`);
    Alert.alert("✅", company.isSuspended ? "تم إلغاء التعليق" : "تم تعليق الشركة");
    fetchCompanyDetails();
  } catch (error) {
    console.error("Suspend error:", error);
    Alert.alert("خطأ", "حدث خطأ أثناء تغيير حالة التعليق");
  }
};


  if (!company) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>تفاصيل الشركة</Text>

      <View style={styles.card}>
        <Text style={styles.label}>📛 الاسم:</Text>
        <Text style={styles.value}>{company.name}</Text>

        <Text style={styles.label}>📧 الإيميل:</Text>
        <Text style={styles.value}>{company.email || "غير متوفر"}</Text>

        <Text style={styles.label}>📞 التليفون:</Text>
        <Text style={styles.value}>{company.phone || "غير متوفر"}</Text>

        <Text style={styles.label}>📍 الموقع:</Text>
        <Text style={styles.value}>
           {company.location &&
            company.location.coordinates &&
            Array.isArray(company.location.coordinates) &&
            company.location.coordinates.length >= 2
              ? `خط العرض: ${company.location.coordinates[1]?.toFixed(4)}, خط الطول: ${company.location.coordinates[0]?.toFixed(4)}`
              : "غير محدد"}
        </Text>


        <Text style={styles.label}>🗺️ المحافظات المغطاة:</Text>
        <Text style={styles.value}>
          {company.coverageAreas?.length > 0 ? company.coverageAreas.join(" - ") : "غير محدد"}
        </Text>

        <Text style={styles.label}>📅 تاريخ الانضمام:</Text>
        <Text style={styles.value}>
          {format(new Date(company.createdAt), "dd/MM/yyyy")}
        </Text>

        <Text style={styles.label}>📦 عدد المنتجات:</Text>
        <Text style={styles.value}>{company.productsCount || 0}</Text>

        <Text style={styles.label}>🛒 عدد الطلبات:</Text>
        <Text style={styles.value}>{company.ordersCount || 0}</Text>

        <TouchableOpacity
          style={[
            styles.suspendBtn,
            { backgroundColor: company.isSuspended ? colors.success : colors.danger },
          ]}
          onPress={toggleSuspend}
        >
          <Text style={styles.btnText}>
            {company.isSuspended ? "🔓 إلغاء التعليق" : "🚫 تعليق الشركة"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.width(4),
    backgroundColor: colors.background,
    direction: "rtl",
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: Layout.font(2.2),
    color: colors.gray,
    fontWeight: "600",
    marginTop: Layout.height(1),
  },
  value: {
    fontSize: Layout.font(2.4),
    color: colors.black,
    marginBottom: Layout.height(1),
  },
  suspendBtn: {
    marginTop: Layout.height(2),
    paddingVertical: Layout.height(1),
    borderRadius: Layout.width(2),
    alignItems: "center",
  },
  btnText: {
    color: colors.white,
    fontSize: Layout.font(2.2),
    fontWeight: "bold",
  },
});
