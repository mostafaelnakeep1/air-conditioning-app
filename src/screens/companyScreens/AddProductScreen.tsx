// src/screens/company/AddProductScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";

const AC_TYPES = ["سبليت", "شباك"];
const BRANDS = ["جري", "دايكن", "ميراج", "الجيزة", "توشيبا"];

export default function AddProductScreen() {
  const { user } = useAuth();
  console.log("🔍 USER FROM AUTH:", user);

  const companyId = user?._id || user?.id;

  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(AC_TYPES[0]);
  const [capacity, setCapacity] = useState("");
  const [brand, setBrand] = useState(BRANDS[0]);
  const [loading, setLoading] = useState(false);
  const [installDuration, setInstallDuration] = useState("");

  const handleSave = async () => {
    if (!price || !description || !capacity || !type || !brand || !installDuration) {
      Alert.alert("خطأ", "برجاء ملء جميع الخانات الفاضية");
      return;
    }

    if (!companyId) {
      Alert.alert("خطأ", "تعذر تحديد حساب الشركة");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        price: Number(price),
        description,
        capacity: Number(capacity),
        type,
        brand,
        installDuration,
        companyId: user._id,
      };

      const response = await apiClient.post("/products", productData);

      Alert.alert("نجاح", "تم حفظ المنتج بنجاح");
      setPrice("");
      setDescription("");
      setCapacity("");
      setInstallDuration("");
      setType(AC_TYPES[0]);
      setBrand(BRANDS[0]);
    } catch (error: any) {
      console.log("Error saving product:", error?.response?.data || error.message);
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ المنتج");
    } finally {
      setLoading(false);
    }
  };

  // دالة لرسم الـ Radio Buttons
  const renderRadioGroup = (
    options: string[],
    selected: string,
    onSelect: (val: string) => void
  ) => (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioButton}
          onPress={() => onSelect(option)}
        >
          <View style={styles.radioOuter}>
            {selected === option && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>إضافة منتج جديد</Text>

        <Text style={styles.label}>نوع التكييف</Text>
        {renderRadioGroup(AC_TYPES, type, setType)}

        <Text style={styles.label}>القدرة</Text>
        <TextInput
          style={styles.input}
          value={capacity}
          onChangeText={setCapacity}
          placeholder="أدخل القدرة"
          placeholderTextColor={colors.gray}
          keyboardType="numeric"
          textAlign="right"
        />

        <Text style={styles.label}>البراند</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={brand}
            onValueChange={(itemValue) => setBrand(itemValue)}
            mode="dropdown"
            style={styles.picker}
            dropdownIconColor={colors.primary}
          >
            {BRANDS.map((b) => (
              <Picker.Item key={b} label={b} value={b} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>السعر</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="أدخل السعر"
          keyboardType="numeric"
          placeholderTextColor={colors.gray}
          textAlign="right"
        />

        <Text style={styles.label}>الوصف</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="أدخل وصف المنتج"
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.gray}
          textAlignVertical="top"
        />

        <Text style={styles.label}>مدة التركيب (دقائق)</Text>
        <TextInput
          style={styles.input}
          value={installDuration}
          onChangeText={setInstallDuration}
          placeholder="مثال: 60"
          keyboardType="numeric"
          placeholderTextColor={colors.gray}
          textAlign="right"
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>حفظ المنتج</Text>
          )}
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
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: Layout.width(4),
    marginBottom: Layout.height(2),
    borderWidth: 1,
    borderColor: colors.primary + "40",
    justifyContent: "center",
    height: Layout.height(5),
  },
  picker: {
    width: "100%",
  },
  radioGroup: {
    flexDirection: "row-reverse",
    marginBottom: Layout.height(2),
    gap: Layout.width(4),
  },
  radioButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  radioOuter: {
    height: Layout.width(5),
    width: Layout.width(5),
    borderRadius: Layout.width(2.5),
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Layout.width(1),
  },
  radioInner: {
    height: Layout.width(2.5),
    width: Layout.width(2.5),
    borderRadius: Layout.width(1.25),
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: Layout.font(2),
    color: colors.black,
  },
});
