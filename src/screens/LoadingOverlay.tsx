// src/components/LoadingOverlay.tsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";
import colors from "../constants/colors";
import { Layout } from "../constants/layout";

type Props = {
  visible: boolean;
  message?: string;
};

export default function LoadingOverlay({ visible, message = "جارٍ التحميل..." }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "#fff",
    padding: Layout.width(6),
    borderRadius: Layout.width(4),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 10,
  },
  message: {
    marginTop: Layout.height(1.5),
    fontSize: Layout.font(2),
    color: "#333",
  },
});
