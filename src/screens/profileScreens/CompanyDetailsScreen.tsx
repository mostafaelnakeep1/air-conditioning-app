import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  I18nManager,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Layout } from "../../constants/layout";
import colors from "../../constants/colors";
import { RootStackParamList } from "../../navigation/types";  // تأكد إنك معرف الـ types دي

interface Company {
  _id: string;
  name: string;
  logo: string;
  address?: string;
  phone?: string;
  lastInteraction?: string;
  description?: string;
  services?: string[];
  rating?: number;
  coverageAreas?: string[];
}

type CompanyDetailsRouteProp = RouteProp<
  { CompanyDetailsScreen: { company: Company } },
  "CompanyDetailsScreen"
>;

type CompanyDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CompanyDetailsScreen"
>;

const CompanyDetailsScreen = () => {
  const route = useRoute<CompanyDetailsRouteProp>();
  const navigation = useNavigation<CompanyDetailsNavigationProp>();

  const { company } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: company.logo }} style={styles.logo} />

      <Text style={styles.name}>{company.name}</Text>

      {company.address && <Text style={styles.detail}>العنوان: {company.address}</Text>}
      {company.phone && <Text style={styles.detail}>الهاتف: {company.phone}</Text>}
      {company.lastInteraction && (
        <Text style={styles.detail}>
          آخر تعامل: {new Date(company.lastInteraction).toLocaleDateString("ar-EG")}
        </Text>
      )}

      {company.description && (
        <>
          <Text style={styles.sectionTitle}>نبذة عن الشركة</Text>
          <Text style={styles.paragraph}>{company.description}</Text>
        </>
      )}

      {company.services && company.services.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
          {company.services.map((service, idx) => (
            <Text key={idx} style={styles.bullet}>
              • {service}
            </Text>
          ))}
        </>
      )}

      {company.coverageAreas && company.coverageAreas.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>مناطق التغطية</Text>
          {company.coverageAreas.map((area, idx) => (
            <Text key={idx} style={styles.bullet}>
              • {area}
            </Text>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Layout.width(5),
    backgroundColor: colors.background,
    flex: 1,
  },
  logo: {
    width: "100%",
    height: Layout.height(20),
    resizeMode: "contain",
    marginBottom: Layout.height(2),
    borderRadius: Layout.width(2),
  },
  name: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  detail: {
    fontSize: Layout.font(2.3),
    color: "#444",
    textAlign: "right",
    marginBottom: Layout.height(1),
  },
  sectionTitle: {
    fontSize: Layout.font(2.8),
    fontWeight: "bold",
    color: colors.primary,
    marginTop: Layout.height(3),
    marginBottom: Layout.height(1),
    textAlign: "right",
  },
  paragraph: {
    fontSize: Layout.font(2.2),
    color: colors.black,
    textAlign: "right",
    lineHeight: Layout.height(3.5),
  },
  bullet: {
    fontSize: Layout.font(2.1),
    color: colors.black,
    textAlign: "right",
    marginRight: Layout.width(2),
    marginBottom: Layout.height(0.5),
  },
});

export default CompanyDetailsScreen;
