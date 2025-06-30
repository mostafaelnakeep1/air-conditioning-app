// src/navigation/stacks/CompanyStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// الشاشات الخاصة بالشركة
import CompanyScreen from "../bottomTabScreens/CompanyScreen";
import AddProductScreen from "../companyScreens/AddProductScreen";
import CompanyOrdersScreen from "../companyScreens/CompanyOrdersScreen";
import CompanyProductsScreen from "../companyScreens/CompanyProductsScreen";
import CompanyProfileScreen from "../companyScreens/CompanyProfileScreen";
import CompanyReportsScreen from "../companyScreens/CompanyReportsScreen";
import JoinOffersScreen from "../companyScreens/JoinOffersScreen";
// import CompanyDetailsScreen from "../companyScreens/CompanyDetailsScreen"; // مستقبلًا

export type CompanyStackParamList = {
  CompanyMain: undefined;
  CompanyOrders: undefined;
  AddProduct: undefined;
  CompanyProducts: undefined;
  CompanyProfile: undefined;
  CompanyReports: undefined;
  JoinOffers: undefined;
  // CompanyDetails: { companyId: string };
};

const Stack = createNativeStackNavigator<CompanyStackParamList>();

export default function CompanyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyMain" component={CompanyScreen} />
      <Stack.Screen name="CompanyOrders" component={CompanyOrdersScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="CompanyProducts" component={CompanyProductsScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Stack.Screen name="CompanyReports" component={CompanyReportsScreen} />
      <Stack.Screen name="JoinOffers" component={JoinOffersScreen} />
      {/* <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} /> */}
    </Stack.Navigator>
  );
}
