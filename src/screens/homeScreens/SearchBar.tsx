import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="ابحث عن التكييف أو الشركة..."
        placeholderTextColor={colors.black}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.height(2),
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(2),
    borderWidth: Layout.width(0.1),
    paddingHorizontal: Layout.width(4),
    height: Layout.height(6),
    fontSize: Layout.font(2),
    textAlign: "right",
    writingDirection: "rtl",
  },
});
