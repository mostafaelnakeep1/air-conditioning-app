import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminScreen from "../bottomTabScreens/AdminScreen";
import ManageClientsScreen from "../adminScreens/ManageClientsScreen";
import ManageCompaniesScreen from "../adminScreens/ManageCompaniesScreen";
import ManageProductsScreen from "../adminScreens/ManageProductsScreen";
import ManageOrdersScreen from "../adminScreens/ManageOrdersScreen";
import PromoteUserScreen from "../adminScreens/PromoteUserScreen";
import AdminReportsScreen from "../adminScreens/AdminReportsScreen";
import ClientDetailsScreen from "../adminScreens/ClientDetailsScreen";
import ProductDetailsScreen from "../adminScreens/ProductDetailsScreen";
import AdsManagementScreen from "../adminScreens/AdsManagementScreen";
import CompanyDetailsScreen from "../adminScreens/CompanyDetailsScreen";
import AdminSendNotificationScreen from "../adminScreens/AdminSendNotificationScreen";
import PendingCompaniesScreen from "../adminScreens/PendingCompaniesScreen";


const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminScreen} />
      <Stack.Screen name="ManageClients" component={ManageClientsScreen} />
      <Stack.Screen name="ManageCompanies" component={ManageCompaniesScreen} />
      <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
      <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
      <Stack.Screen name="PromoteUser" component={PromoteUserScreen} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
      <Stack.Screen name="ClientDetailsScreen" component={ClientDetailsScreen} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{ title: "تفاصيل المنتج" }}/>
      <Stack.Screen name="AdsManagementScreen" component={AdsManagementScreen} />
      <Stack.Screen name="CompanyDetailsScreen" component={CompanyDetailsScreen} />
      <Stack.Screen name="AdminSendNotificationScreen" component={AdminSendNotificationScreen} />
      <Stack.Screen name="PendingCompaniesScreen" component={PendingCompaniesScreen} />
    </Stack.Navigator>
  );
}
