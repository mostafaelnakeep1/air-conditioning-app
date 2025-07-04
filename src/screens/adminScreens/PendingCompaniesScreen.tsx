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
} from "react-native";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";
import colors from "../../constants/colors";

type Company = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  description?: string;
  createdAt?: string;
  [key: string]: any;
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
      console.error("❌ فشل جلب الشركات:", error);
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
      console.error("❌ فشل في جلب العروض:", error);
      Alert.alert("خطأ", "فشل في جلب العروض");
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
      Alert.alert("نجاح", `تم ${action === "approve" ? "قبول" : "رفض"} الشركة`);
      setCompanyModalVisible(false);
      setSelectedCompany(null);
      fetchPendingCompanies();
    } catch (error) {
      Alert.alert("خطأ", `فشل ${action === "approve" ? "قبول" : "رفض"} الشركة`);
    }
  };

  const handleOfferAction = async (id: string, action: "approve" | "reject") => {
    try {
      await apiClient.put(`/admin/offers/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      Alert.alert("تم", `تم ${action === "approve" ? "قبول" : "رفض"} العرض`);
      setOfferModalVisible(false);
      setSelectedOffer(null);
      fetchPendingOffers();
    } catch (error) {
      Alert.alert("خطأ", `فشل ${action === "approve" ? "قبول" : "رفض"} العرض`);
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
                      {selectedOffer.mediaUrl && selectedOffer.type === "image" && (
                        <Image
                          source={{ uri: selectedOffer.mediaUrl }}
                          style={{ width: "100%", height: 200, marginVertical: 10 }}
                          resizeMode="cover"
                        />
                      )}
                      {selectedOffer.mediaUrl && selectedOffer.type === "video" && (
                        <Text style={styles.text}>📹 رابط الفيديو: {selectedOffer.mediaUrl}</Text>
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
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10, textAlign: "right" },
  noDataText: { textAlign: "center", color: colors.gray, marginVertical: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    elevation: 1,
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
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
  buttonText: { color: "#fff", fontWeight: "bold" },
  closeText: {
    color: colors.primary,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
  },
});
