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
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../../config/config";
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
  [key: string]: any; // لو في بيانات إضافية
};

export default function PendingCompaniesScreen() {
  const { userToken } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPendingCompanies = async () => {
    if (!userToken) {
    console.warn("⛔ لا يوجد توكن");
    return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/admin/companies/pending`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCompanies(res.data.companies);
    } catch (error) {
      console.error("فشل جلب الشركات:", error);
      Alert.alert("خطأ", "فشل جلب الشركات المعلقة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken) {
    console.warn("⛔ لا يوجد توكن، لم يتم تنفيذ الطلب");
    return;
  }
    setLoading(true);
    fetchPendingCompanies();
  }, [userToken]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      await axios.put(
        `${BASE_URL}/admin/companies/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      Alert.alert(
        "نجاح",
        `تم ${action === "approve" ? "قبول" : "رفض"} الشركة`
      );
      setModalVisible(false);
      setSelectedCompany(null);
      fetchPendingCompanies();
    } catch (error) {
      Alert.alert(
        "خطأ",
        `فشل ${action === "approve" ? "قبول" : "رفض"} الشركة`
      );
    }
  };

  const openDetails = (company: Company) => {
    setSelectedCompany(company);
    setModalVisible(true);
  };

  const closeDetails = () => {
    setModalVisible(false);
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {companies.length === 0 ? (
        <Text style={styles.noDataText}>لا توجد شركات معلقة</Text>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openDetails(item)}
            >
              <Text style={styles.companyName}>{item.name}</Text>
              <Text style={styles.text}>{item.email}</Text>
              <Text style={styles.text}>{item.phone}</Text>
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => handleAction(item._id, "approve")}
                >
                  <Text style={styles.buttonText}>قبول</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleAction(item._id, "reject")}
                >
                  <Text style={styles.buttonText}>رفض</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* مودال تفاصيل الشركة */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeDetails}
      >
        <TouchableWithoutFeedback onPress={closeDetails}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ScrollView>
                  <Text style={styles.detailsTitle}>تفاصيل الشركة</Text>
                  {selectedCompany && (
                    <>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>الاسم: </Text>
                        {selectedCompany.name}
                      </Text>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>البريد الإلكتروني: </Text>
                        {selectedCompany.email}
                      </Text>
                      <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>رقم التليفون: </Text>
                        {selectedCompany.phone}
                      </Text>
                      {selectedCompany.address && (
                        <Text style={styles.detailItem}>
                          <Text style={styles.detailLabel}>العنوان: </Text>
                          {selectedCompany.address}
                        </Text>
                      )}
                      {selectedCompany.description && (
                        <Text style={styles.detailItem}>
                          <Text style={styles.detailLabel}>الوصف: </Text>
                          {selectedCompany.description}
                        </Text>
                      )}
                      {selectedCompany.createdAt && (
                        <Text style={styles.detailItem}>
                          <Text style={styles.detailLabel}>تاريخ التسجيل: </Text>
                          {new Date(selectedCompany.createdAt).toLocaleDateString()}
                        </Text>
                      )}
                      {/* لو في بيانات إضافية تقدر تضيفها هنا بنفس الأسلوب */}
                    </>
                  )}

                  <View style={styles.buttonsRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.approveButton]}
                      onPress={() =>
                        selectedCompany &&
                        handleAction(selectedCompany._id, "approve")
                      }
                    >
                      <Text style={styles.buttonText}>قبول</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.rejectButton]}
                      onPress={() =>
                        selectedCompany &&
                        handleAction(selectedCompany._id, "reject")
                      }
                    >
                      <Text style={styles.buttonText}>رفض</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeDetails}
                  >
                    <Text style={styles.closeButtonText}>إغلاق</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataText: {
    textAlign: "right",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: "flex-end",
  },
  companyName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
    textAlign: "right",
  },
  text: {
    textAlign: "right",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  approveButton: { backgroundColor: "#34d399" },
  rejectButton: { backgroundColor: "#f87171" },
  buttonText: { color: "#fff", fontWeight: "bold" },

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
  detailsTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 15,
    textAlign: "center",
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "right",
  },
  detailLabel: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#f87171",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
