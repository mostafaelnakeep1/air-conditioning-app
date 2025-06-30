// src/screens/company/CompanyReportsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

const screenWidth = Dimensions.get("window").width - Layout.width(10);

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // لو بتحب تستخدم اللون الأساسي
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForBackgroundLines: {
    stroke: "#eee",
  },
};

const data = {
  labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

export default function CompanyReportsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>تقارير الأداء</Text>
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: Layout.width(5),
    paddingTop: Layout.height(3),
  },
  header: {
    fontSize: Layout.font(3),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "right",
    color: colors.black,
  },
  chart: {
    borderRadius: Layout.width(4),
  },
});
