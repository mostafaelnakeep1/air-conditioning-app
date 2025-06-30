import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 الرئيسية</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: Layout.font(3),
    color: colors.primary,
    writingDirection: "rtl",
  },
});
