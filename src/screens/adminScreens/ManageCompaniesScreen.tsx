import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import { differenceInDays } from "date-fns";

type NavigationProp = StackNavigationProp<RootStackParamList, "ManageCompaniesScreen">;

interface Company {
  _id: string;
  name: string;
  createdAt: string;
  subscriptionEnd: string;
  image?: string;
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
      console.log("✅ Response data:", res.data);
      setCompanies(res.data);
    } catch (error) {
      console.error("Fetch companies error:", error);
      
      Alert.alert("خطأ", "حدث خطأ في جلب بيانات الشركات");
    }
  };
const getTopVendors = () => {
  return companies
    .filter(item => differenceInDays(new Date(item.subscriptionEnd), new Date()) > 0) // شرط الاشتراك شغال
    .slice(0, 10) // أول 10 شركات كما هي
    .map(item => ({
      id: item._id,
      name: item.name,
      image: item.image || "https://picsum.photos/600/400",
      location: "الموقع غير محدد",
      rating: 4,
      address: "العنوان غير متوفر",
      phone: "0500000000",
      clientsCount: Math.floor(Math.random() * 100) + 50,
    }));
};



  const handlePause = async (companyId: string) => {
  try {
    await apiClient.post(`/admin/companies/${companyId}/pause`);
    Alert.alert("⏸️", "تم تعليق الشركة بنجاح");
    fetchCompanies();
    } catch (error) {
      console.error("Pause error:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تعليق الشركة");
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

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<Company>) => {
    const index = getIndex?.() ?? 0;
    const remainingDays = Math.max(0, differenceInDays(new Date(item.subscriptionEnd), new Date()));

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("CompanyDetailsScreen", { companyId: item._id })}
        onLongPress={drag}
        delayLongPress={100}
        style={[styles.card, isActive && { opacity: 0.85 }]}
      >
        <ImageBackground
          source={item.image ? { uri: item.image } : require("../../imags/R.webp")}
          style={styles.imageBackground}
          imageStyle={{ borderRadius: Layout.width(3) }}
        >
          <View style={styles.overlay}>
            <View style={styles.rowBetween}>
              <Text style={styles.serial}>{index + 1}.</Text>
              <TouchableOpacity onLongPress={drag}>
                <MaterialIcons name="drag-handle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.remainingDays}>باقي {remainingDays} يوم</Text>
            </View>

            <View style={[styles.rowBetween, { marginTop: Layout.height(1.5) }]}>
              
              <TouchableOpacity
                style={styles.extendButton}
                onPress={() => handleExtend(item._id)}
              >
                <Text style={styles.extendButtonText}>تمديد 30 يوم</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={() => handlePause(item._id)}
              >
                <Text style={styles.pauseButtonText}>تعليق الشركة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏢 إدارة الشركات</Text>
      <DraggableFlatList
        data={companies}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onDragEnd={({ data }) => setCompanies(data)}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    paddingVertical: Layout.height(6)
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  card: {
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
    overflow: "hidden",
    elevation: 2,
  },
  imageBackground: {
    width: "100%",
    height: Layout.height(13),
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(109, 108, 108, 0.4)",
    paddingVertical: Layout.height(0.5),
    paddingHorizontal: Layout.width(3),
  },
  serial: {
    fontSize: Layout.font(2.3),
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: Layout.font(2.5),
    fontWeight: "bold",
    color: "#fff",
  },
  remainingDays: {
    fontSize: Layout.font(2),
    color: "#fff",
  },
  extendButton: {
    backgroundColor: colors.primary,
    opacity: 0.9,
    paddingVertical: Layout.height(1),
    paddingHorizontal: Layout.width(4),
    borderRadius: Layout.width(2),
  },
  extendButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: Layout.font(2),
  },
  rowBetween: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pauseButton: {
  backgroundColor: "#D9534F", // أحمر
  
  paddingVertical: Layout.height(1),
  paddingHorizontal: Layout.width(4),
  borderRadius: Layout.width(2),
  },

  pauseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Layout.font(2),
  },
});
