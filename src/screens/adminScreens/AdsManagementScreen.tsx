import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";

import { AdsContext } from "../../context/AdsContext";

interface Ad {
  _id: string;
  videoUrl: string;
  position: number;
  durationDays: number;
  status: "active" | "paused";
  expiryDate: string;
}

export default function AdsManagementScreen() {
  const { ads, fetchAds, setAds } = useContext(AdsContext);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAd, setEditAd] = useState<Ad | null>(null);

  const [videoFile, setVideoFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [position, setPosition] = useState<string>("");
  const [durationDays, setDurationDays] = useState<string>("10");
  const [extendDays, setExtendDays] = useState<string>("");

  const DEFAULT_DURATION = 10;

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    try {
      await fetchAds();
    } catch {
      Alert.alert("خطأ", "فشل في جلب الإعلانات");
    } finally {
      setLoading(false);
    }
  };

  // اختيار فيديو من المعرض
  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("أذن مرفوض", "نحتاج إذن للوصول للمعرض");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setVideoFile(result.assets[0]);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setPosition("");
    setDurationDays(DEFAULT_DURATION.toString());
    setExtendDays("");
    setEditAd(null);
  };

  // رفع أو تعديل الإعلان
  const submitAd = async () => {
    if (!editAd && !videoFile) {
      Alert.alert("خطأ", "اختر فيديو للإعلان");
      return;
    }
    if (!position || isNaN(Number(position))) {
      Alert.alert("خطأ", "ادخل موضع صحيح");
      return;
    }
    if (!durationDays || isNaN(Number(durationDays)) || Number(durationDays) <= 0) {
      Alert.alert("خطأ", "ادخل مدة إعلان صحيحة");
      return;
    }

    try {
      let res;
      if (editAd) {
        // تعديل إعلان
        const body: any = {
          position: Number(position),
        };
        if (extendDays && !isNaN(Number(extendDays)) && Number(extendDays) > 0) {
          body.extendDays = Number(extendDays);
        }
        res = await apiClient.patch(`/ads/${editAd._id}`, body);
      } else {
        // إضافة إعلان جديد
        const formData = new FormData();
        formData.append("position", position);
        formData.append("durationDays", durationDays);
        if (videoFile) {
          formData.append("video", {
            uri: Platform.OS === "android" ? videoFile.uri : videoFile.uri.replace("file://", ""),
            name: videoFile.fileName || `video_${Date.now()}.mp4`,
            type: "video/mp4",
          } as any);
        }

        res = await apiClient.post("/ads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.status === 200 || res.status === 201) {
        Alert.alert("نجاح", res.data.message || "تمت العملية بنجاح");
        resetForm();
        setModalVisible(false);
        await fetchAds();
      } else {
        Alert.alert("خطأ", "فشل في العملية");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("خطأ", error.response?.data?.message || "حدث خطأ");
    }
  };

  // تغيير حالة الإعلان (تعليق/تفعيل)
  const toggleStatus = async (ad: Ad) => {
    const newStatus = ad.status === "active" ? "paused" : "active";
    try {
      const res = await apiClient.patch(`/ads/${ad._id}`, { status: newStatus });
      if (res.status === 200) {
        Alert.alert("نجاح", `تم تغيير الحالة إلى ${newStatus}`);
        await fetchAds();
      } else {
        Alert.alert("خطأ", "فشل في تغيير الحالة");
      }
    } catch (error) {
      Alert.alert("خطأ", "فشل في الاتصال بالخادم");
    }
  };

  // حذف إعلان
  const deleteAd = async (adId: string) => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await apiClient.delete(`/ads/${adId}`);
              if (res.status === 200) {
                Alert.alert("نجاح", "تم حذف الإعلان بنجاح");
                await fetchAds();
              } else {
                Alert.alert("خطأ", "فشل في حذف الإعلان");
              }
            } catch (error) {
              Alert.alert("خطأ", "فشل في الاتصال بالخادم");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (ad: Ad) => {
    setEditAd(ad);
    setPosition(ad.position.toString());
    setDurationDays(ad.durationDays.toString());
    setExtendDays("");
    setVideoFile(null);
    setModalVisible(true);
  };

  const renderAdItem = ({ item }: { item: Ad }) => {
    const expiryDate = new Date(item.expiryDate);
    const now = new Date();
    const remainingDays = Math.max(
      0,
      Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return (
      <View style={styles.adCard}>
        <Text style={styles.adTitle}>موضع: {item.position}</Text>
        <Video
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          isLooping
        />
        <Text>الحالة: {item.status === "active" ? "نشط" : "معلق"}</Text>
        <Text>مدة الإعلان (أيام): {item.durationDays}</Text>
        <Text>متبقي (أيام): {remainingDays}</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={() => toggleStatus(item)}>
            <Text style={styles.buttonText}>{item.status === "active" ? "علق" : "فعّل"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => openEditModal(item)}>
            <Text style={styles.buttonText}>تعديل</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.danger }]}
            onPress={() => deleteAd(item._id)}
          >
            <Text style={styles.buttonText}>حذف</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 إدارة الإعلانات</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : ads.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>لا توجد إعلانات حالياً</Text>
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item._id}
          renderItem={renderAdItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>إضافة إعلان جديد</Text>
      </TouchableOpacity>

      {/* المودال */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editAd ? "تعديل إعلان" : "إضافة إعلان جديد"}</Text>

          {!editAd && (
            <>
              <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
                <Text style={styles.pickButtonText}>
                  {videoFile ? "تم اختيار فيديو" : "اختر فيديو"}
                </Text>
              </TouchableOpacity>
              {videoFile && (
                <Text style={{ marginBottom: 10 }}>
                  اسم الملف: {videoFile.fileName || videoFile.uri}
                </Text>
              )}
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="الموضع (رقم)"
            keyboardType="numeric"
            value={position}
            onChangeText={setPosition}
          />

          {!editAd && (
            <TextInput
              style={styles.input}
              placeholder={`مدة الإعلان بالأيام (افتراضي ${DEFAULT_DURATION})`}
              keyboardType="numeric"
              value={durationDays}
              onChangeText={setDurationDays}
            />
          )}

          {editAd && (
            <TextInput
              style={styles.input}
              placeholder="تمديد مدة الإعلان (أيام)"
              keyboardType="numeric"
              value={extendDays}
              onChangeText={setExtendDays}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={submitAd}>
              <Text style={styles.buttonText}>{editAd ? "تحديث" : "إضافة"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.width(4),
    backgroundColor: colors.background,
  },
  title: {
    fontSize: Layout.font(4),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "center",
    color: colors.black,
  },
  adCard: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(3),
    padding: Layout.height(2),
    marginBottom: Layout.height(2),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adTitle: {
    fontWeight: "bold",
    marginBottom: Layout.height(1),
    fontSize: Layout.font(2.5),
    color: colors.primary,
  },
  video: {
    width: "100%",
    height: Layout.height(20),
    borderRadius: Layout.width(2),
    backgroundColor: "#000",
    marginBottom: Layout.height(1),
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1),
    paddingHorizontal: Layout.width(5),
    borderRadius: Layout.width(2),
    marginTop: Layout.height(1),
    minWidth: Layout.width(25),
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: colors.success,
    paddingVertical: Layout.height(1.5),
    borderRadius: Layout.width(3),
    alignItems: "center",
    position: "absolute",
    bottom: Layout.height(4),
    left: Layout.width(4),
    right: Layout.width(4),
  },
  addButtonText: {
    color: colors.white,
    fontSize: Layout.font(3),
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: Layout.width(5),
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: Layout.font(4),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "center",
    color: colors.primary,
  },
  pickButton: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(1.5),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1),
    alignItems: "center",
  },
  pickButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: Layout.font(2.5),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: Layout.width(2),
    paddingVertical: Layout.height(1.2),
    paddingHorizontal: Layout.width(3),
    fontSize: Layout.font(2.5),
    marginBottom: Layout.height(1.5),
    textAlign: "right",
    backgroundColor: colors.white,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Layout.height(3),
  },
  confirmButton: {
    backgroundColor: colors.success,
    minWidth: Layout.width(30),
  },
  cancelButton: {
    backgroundColor: colors.danger,
    minWidth: Layout.width(30),
  },
});
