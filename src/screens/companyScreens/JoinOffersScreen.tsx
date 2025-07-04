// src/screens/company/JoinOffersScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function JoinOffersScreen() {
  const { user, token } = useAuth();
  const [offerType, setOfferType] = useState<"image" | "video">("image");

  const [offerTitle, setOfferTitle] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const [details, setDetails] = useState("");

  const [media, setMedia] = useState<{ uri: string; type: string } | null>(null);

  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        offerType === "image"
         ? ImagePicker.MediaTypeOptions.Images
      : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setMedia({
        uri: result.assets[0].uri,
        type: offerType,
      });
    }
  };

const handleSubmit = async () => {
  if (!offerTitle ) {
    return Alert.alert("تنبيه", "برجاء ملء الحقول المطلوبة");
  }

  try {
    const userDataStr = await AsyncStorage.getItem("userData");
    if (!userDataStr) throw new Error("بيانات المستخدم غير موجودة");
    const userData = JSON.parse(userDataStr);

    const formData = new FormData();

    formData.append("title", offerTitle);
    formData.append("oldPrice", oldPrice);
    formData.append("newPrice", newPrice);
    formData.append("discount", discount);
    formData.append("duration", duration);
    formData.append("details", details);
    formData.append("type", offerType);


    if (media) {
      formData.append("media", {
        uri: media.uri,
        name: media.uri.split("/").pop(),
        type: offerType === "image" ? "image/jpeg" : "video/mp4",
      } as any);
    }

    await axios.post(`${BASE_URL}/company/offers`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    Alert.alert("تم", "تم إرسال العرض بنجاح");
    setOfferTitle("");
    setOldPrice("");
    setNewPrice("");
    setDiscount("");
    setDuration("");
    setDetails("");
    setMedia(null);
  } catch (error) {
    console.error(error);
    Alert.alert("خطأ", "حدث خطأ أثناء إرسال العرض");
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>انضم للعروض</Text>

        <View style={styles.offerTypeRow}>
          {["image", "video"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                offerType === type && styles.typeButtonSelected,
              ]}
              onPress={() => setOfferType(type as any)}
            >
              <Text style={styles.typeButtonText}>
                {type === "text" ? "نصي" : type === "image" ? "صورة" : "فيديو"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>عنوان العرض</Text>
        <TextInput
          style={styles.input}
          value={offerTitle}
          onChangeText={setOfferTitle}
          placeholder="مثال: خصم على التكييف السبليت"
          placeholderTextColor={colors.gray}
        />

        

        {(offerType === "image" || offerType === "video") && (
          <>
            <TouchableOpacity style={styles.pickButton} onPress={handleMediaPick}>
              <Text style={styles.pickButtonText}>
                {media ? "تغيير الملف" : "اختيار ملف"}
              </Text>
            </TouchableOpacity>
            {media && (
              <Text style={{ textAlign: "center", marginVertical: 10, color: colors.gray }}>
                تم اختيار ملف: {media.uri.split("/").pop()}
              </Text>
            )}
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>إرسال العرض</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: Layout.width(5),
    backgroundColor: colors.background,
    paddingBottom: Layout.height(5),
  },
  header: {
    fontSize: Layout.font(3.2),
    fontWeight: "bold",
    marginBottom: Layout.height(3),
    textAlign: "right",
    color: colors.black,
  },
  label: {
    fontSize: Layout.font(2),
    fontWeight: "600",
    marginBottom: Layout.height(0.5),
    textAlign: "right",
    color: colors.black,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: Layout.width(4),
    paddingHorizontal: Layout.width(3),
    paddingVertical: Layout.height(1.5),
    marginBottom: Layout.height(2),
    fontSize: Layout.font(1.8),
    color: colors.black,
    textAlign: "right",
  },
  multiline: {
    height: Layout.height(12),
    textAlignVertical: "top",
  },
  offerTypeRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: Layout.height(2),
  },
  typeButton: {
    paddingVertical: Layout.height(1),
    paddingHorizontal: Layout.width(3),
    borderRadius: Layout.width(3),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: colors.black,
    fontSize: Layout.font(1.8),
  },
  pickButton: {
    backgroundColor: colors.primary,
    padding: Layout.height(1.5),
    borderRadius: Layout.width(4),
    alignItems: "center",
    marginVertical: Layout.height(2),
  },
  pickButtonText: {
    color: "#fff",
    fontSize: Layout.font(2),
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(2),
    borderRadius: Layout.width(4),
    alignItems: "center",
    marginTop: Layout.height(2),
  },
  saveButtonText: {
    color: "#fff",
    fontSize: Layout.font(2.2),
    fontWeight: "bold",
  },
});
