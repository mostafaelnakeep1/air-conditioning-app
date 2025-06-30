import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";

export default function CompanyProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const res = await apiClient.get("/company/profile");
      setCompanyData(res.data);
    } catch (error: any) {
      console.log("Error fetching company data:", error?.response || error);
      Alert.alert("خطأ", "فشل في جلب بيانات الشركة");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setCompanyData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      try {
        await apiClient.patch("/company/profile", companyData);
        Alert.alert("تم", "تم حفظ التعديلات بنجاح");
      } catch (err) {
        Alert.alert("خطأ", "فشل في حفظ التعديلات");
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  if (!companyData) {
    return (
      <View style={styles.container}>
        <Text>لا توجد بيانات لعرضها</Text>
      </View>
    );
  }

  const {
    name,
    email,
    phone,
    address,
    installDuration,
    coverageAreas = [],
    rating = 0,
    reviewers = 0,
    soldThisMonth = 0,
    soldTotal = 0,
    location = { coordinates: [30.0444, 31.2357] },
  } = companyData;

  const latitude =
    location && Array.isArray(location.coordinates) && location.coordinates.length >= 2
      ? location.coordinates[1]
      : 30.0444;

  const longitude =
    location && Array.isArray(location.coordinates) && location.coordinates.length >= 2
      ? location.coordinates[0]
      : 31.2357;

  const hasValidLocation =
    location && Array.isArray(location.coordinates) && location.coordinates.length >= 2;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>بيانات الشركة</Text>

      <View style={styles.card}>
        <Text style={styles.companyName}>{name}</Text>
        <Text style={styles.rating}>
          ⭐ {rating.toFixed(1)} ({reviewers} عميل)
        </Text>
      </View>

      <View style={styles.card}>
        <InfoField
          label="البريد الإلكتروني"
          value={email || ""}
          onChange={(val: string) => handleChange("email", val)}
          editable={isEditing}
        />
        <InfoField
          label="رقم الهاتف"
          value={phone || ""}
          onChange={(val: string) => handleChange("phone", val)}
          editable={isEditing}
        />
        <InfoField
          label="العنوان"
          value={address || ""}
          onChange={(val: string) => handleChange("address", val)}
          editable={isEditing}
        />
        <InfoField
          label="مدة التركيب"
          value={installDuration || ""}
          onChange={(val: string) => handleChange("installDuration", val)}
          editable={isEditing}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>المناطق المغطاة</Text>
        <View style={styles.coverageList}>
          {coverageAreas.map((area: string, index: number) => (
            <View key={index} style={styles.areaBadge}>
              <Text style={styles.areaText}>{area}</Text>
            </View>
          ))}
        </View>
      </View>

      {hasValidLocation ? (
        <TouchableWithoutFeedback
          onPress={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url);
          }}
        >
          <View style={[styles.card, { padding: 0, overflow: "hidden" }]}>
            <MapView
              style={{ width: "100%", height: Layout.height(20) }}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              pointerEvents="none"
            >
              <Marker coordinate={{ latitude, longitude }} title={name} description="موقع الشركة" />
            </MapView>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.card}>
          <Text style={{ textAlign: "center", color: colors.gray }}>موقع الشركة غير محدد</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>إحصائيات</Text>
        <Text style={styles.statText}>
          🗓️ عدد الأجهزة المباعة هذا الشهر: <Text style={styles.bold}>{soldThisMonth}</Text>
        </Text>
        <Text style={styles.statText}>
          📦 إجمالي الأجهزة المباعة: <Text style={styles.bold}>{soldTotal}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleToggleEdit}>
        <Text style={styles.buttonText}>{isEditing ? "حفظ التعديلات" : "تعديل البيانات"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoField({ label, value, onChange, editable }: any) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.readOnly]}
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={label === "العنوان"}
        textAlign="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.width(5),
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  header: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    textAlign: "center",
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(3),
    padding: Layout.height(2),
    marginBottom: Layout.height(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  companyName: {
    fontSize: Layout.font(2.8),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(1),
    color: colors.black,
  },
  rating: {
    fontSize: Layout.font(2.2),
    textAlign: "center",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: Layout.font(2.3),
    fontWeight: "600",
    marginBottom: Layout.height(1),
    color: colors.black,
    textAlign: "right",
  },
  fieldContainer: {
    marginBottom: Layout.height(1.5),
  },
  label: {
    fontSize: Layout.font(2),
    color: colors.black,
    marginBottom: Layout.height(0.5),
    textAlign: "right",
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(2),
    padding: Layout.height(1.2),
    fontSize: Layout.font(2.1),
    borderWidth: 1,
    borderColor: colors.primary + "40",
    color: colors.black,
  },
  readOnly: {
    backgroundColor: colors.background + "40",
    color: "#777",
  },
  coverageList: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: Layout.width(2),
  },
  areaBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: Layout.width(3),
    paddingVertical: Layout.height(0.8),
    borderRadius: Layout.width(2),
    marginBottom: Layout.height(1),
  },
  areaText: {
    fontSize: Layout.font(1.9),
    color: colors.primary,
  },
  statText: {
    fontSize: Layout.font(2.1),
    marginBottom: Layout.height(1),
    textAlign: "right",
    color: colors.black,
  },
  bold: {
    fontWeight: "bold",
    color: colors.primary,
  },
  button: {
    marginTop: Layout.height(3),
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.6),
    borderRadius: Layout.width(3),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
  },
});
