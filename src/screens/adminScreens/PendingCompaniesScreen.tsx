import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Video, ResizeMode } from "expo-av";

import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";
import colors from "../../constants/colors";
import { BASE_URL } from "../../config/config";// ✅ عدل ده حسب عنوان السيرفر بتاعك

type Company = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  description?: string;
  createdAt?: string;
};

type Offer = {
  _id: string;
  title: string;
  type: "image" | "video";
  company?: { name: string };
  mediaUrl?: string;
  status: string;
};

export default function PendingItemsScreen() {
  const { userToken } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerModalVisible, setOfferModalVisible] = useState(false);

  const fetchPendingCompanies = async () => {
    try {
      const res = await apiClient.get("/admin/companies/pending", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCompanies(res.data.companies);
    } catch (error) {
      Alert.alert("خطأ", "فشل جلب الشركات المعلقة");
    }
  };

  const fetchPendingOffers = async () => {
    try {
      const res = await apiClient.get("/admin/offers/pending", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setOffers(res.data.offers);
    } catch (error) {
      Alert.alert("خطأ", "فشل جلب العروض");
    }
  };

  useEffect(() => {
    if (!userToken) return;
    setLoading(true);
    Promise.all([fetchPendingCompanies(), fetchPendingOffers()]).finally(() =>
      setLoading(false)
    );
  }, [userToken]);


const handleCompanyAction = async (id: string, action: "approve" | "reject") => {
  try {
    await apiClient.put(`/admin/companies/${id}/${action}`, {}, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    Alert.alert("تم", `تم ${action === "approve" ? "قبول" : "رفض"} الشركة`);
    setCompanyModalVisible(false);
    fetchPendingCompanies();

    // لو الشركة تم قبولها، ابعت واتساب
    if (action === "approve" && selectedCompany?.phone) {
      const phone = selectedCompany.phone.replace(/\D/g, ""); // شيل الرموز
      const message = `أهلاً ${selectedCompany.name} 👋

    تم تفعيل حساب شركتكم على تطبيق "تكييفات".
    بيانات الدخول:
    📧 الإيميل: ${selectedCompany.email}
    🔐 كلمة المرور: password123

    ننصحكم بتغيير كلمة المرور بعد أول تسجيل دخول.

    رابط الدخول متاح الآن ✅
    تحياتنا 🌟`;

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url);
    }

  } catch {
    Alert.alert("خطأ", "فشل العملية");
  }
};


  const handleOfferAction = async (id: string, action: "approve" | "reject") => {
    try {
      await apiClient.put(`/admin/offers/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      Alert.alert("تم", `تم ${action === "approve" ? "قبول" : "رفض"} العرض`);
      setOfferModalVisible(false);
      fetchPendingOffers();
    } catch {
      Alert.alert("خطأ", "فشل العملية");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* الشركات */}
      <Text style={styles.sectionTitle}>الشركات المعلقة</Text>
      {companies.length === 0 ? (
        <Text style={styles.noDataText}>لا توجد شركات معلقة</Text>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedCompany(item);
                setCompanyModalVisible(true);
              }}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.text}>{item.email}</Text>
              <Text style={styles.text}>{item.phone}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* العروض */}
      <Text style={styles.sectionTitle}>العروض المعلقة</Text>
      {offers.length === 0 ? (
        <Text style={styles.noDataText}>لا توجد عروض معلقة</Text>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedOffer(item);
                setOfferModalVisible(true);
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>النوع: {item.type === "image" ? "صورة" : "فيديو"}</Text>
              {item.company?.name && (
                <Text style={styles.text}>الشركة: {item.company.name}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* مودال الشركة */}
      <Modal visible={companyModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setCompanyModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ScrollView>
                  {selectedCompany && (
                    <>
                      <Text style={styles.modalTitle}>تفاصيل الشركة</Text>
                      <Text style={styles.text}>الاسم: {selectedCompany.name}</Text>
                      <Text style={styles.text}>البريد: {selectedCompany.email}</Text>
                      <Text style={styles.text}>الهاتف: {selectedCompany.phone}</Text>
                      {selectedCompany.address && (
                        <Text style={styles.text}>العنوان: {selectedCompany.address}</Text>
                      )}
                      {selectedCompany.description && (
                        <Text style={styles.text}>الوصف: {selectedCompany.description}</Text>
                      )}
                      <View style={styles.buttonsRow}>
                        <TouchableOpacity
                          style={[styles.button, styles.approveButton]}
                          onPress={() => handleCompanyAction(selectedCompany._id, "approve")}
                        >
                          <Text style={styles.buttonText}>قبول</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.rejectButton]}
                          onPress={() => handleCompanyAction(selectedCompany._id, "reject")}
                        >
                          <Text style={styles.buttonText}>رفض</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  <TouchableOpacity onPress={() => setCompanyModalVisible(false)}>
                    <Text style={styles.closeText}>إغلاق</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* مودال العرض */}
      <Modal visible={offerModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setOfferModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ScrollView>
                  {selectedOffer && (
                    <>
                      <Text style={styles.modalTitle}>{selectedOffer.title}</Text>
                      <Text style={styles.text}>
                        النوع: {selectedOffer.type === "image" ? "صورة" : "فيديو"}
                      </Text>

                      {/* صورة */}
                      {selectedOffer?.type === "image" &&  (
                        <Image
                          source={{ uri: selectedOffer.mediaUrl
                          ? `${BASE_URL}${selectedOffer.mediaUrl}`
                          : "https://via.placeholder.com/300x200",  }}
                          style={{ width: "100%", height: 200, marginVertical: 10 }}
                          resizeMode="cover"
                        />
                      )}

                      {/* فيديو */}
                      {selectedOffer?.type === "video" && (
                        <Video
                          source={{ uri: selectedOffer.mediaUrl
                          ? `${BASE_URL}${selectedOffer.mediaUrl}`
                          : "https://via.placeholder.com/300x200", }}
                          style={{ width: "100%", height: 200, marginVertical: 10 }}
                          useNativeControls={true}

                          resizeMode={ResizeMode.COVER}
                        />
                      )}

                      <View style={styles.buttonsRow}>
                        <TouchableOpacity
                          style={[styles.button, styles.approveButton]}
                          onPress={() => handleOfferAction(selectedOffer._id, "approve")}
                        >
                          <Text style={styles.buttonText}>قبول</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.rejectButton]}
                          onPress={() => handleOfferAction(selectedOffer._id, "reject")}
                        >
                          <Text style={styles.buttonText}>رفض</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  <TouchableOpacity onPress={() => setOfferModalVisible(false)}>
                    <Text style={styles.closeText}>إغلاق</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10, textAlign: "right" },
  noDataText: { textAlign: "center", color: colors.gray, marginVertical: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "flex-end",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  text: { fontSize: 14, textAlign: "right", color: colors.gray },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    minWidth: 100,
  },
  approveButton: { backgroundColor: "#34d399" },
  rejectButton: { backgroundColor: "#f87171" },
  viewButton: { backgroundColor: colors.primary },
  buttonText: { color: "#fff", fontWeight: "bold" },
  closeText: {
    color: colors.primary,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
  },
});
