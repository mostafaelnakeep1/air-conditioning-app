// src/navigation/stacks/ProfileStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// الشاشات الخاصة بـ "حسابي"
import ProfileScreen from "../../screens/bottomTabScreens/ProfileScreen";
import UserInfoScreen from "../../screens/profileScreens/UserInfoScreen";
import OrdersHistoryScreen from "../../screens/profileScreens/OrdersHistoryScreen";
import PreviousCompaniesScreen from "../../screens/profileScreens/PreviousCompaniesScreen";
import SavedAddressesScreen from "../../screens/profileScreens/SavedAddressesScreen";
import ContactUsScreen from "../../screens/profileScreens/ContactUsScreen";
import InviteFriendScreen from "../../screens/profileScreens/InviteFriendScreen";
import OrderDetailsScreen from "../profileScreens/OrderDetailsScreen";
import CompanyDetailsScreen from "../profileScreens/CompanyDetailsScreen";
import LoginScreen from "../loginScreens/LoginScreen";
import FavoritesScreen from "../profileScreens/FavoritesScreen";
import ForgotPasswordScreen from "../loginScreens/ForgotPasswordScreen";
import { ProfileStackParamList } from "../../navigation/types";


const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} options={{ title: "تفاصيل الطلب" }}/>
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
      <Stack.Screen name="PreviousCompanies" component={PreviousCompaniesScreen} />
      <Stack.Screen name="CompanyDetailsScreen" component={CompanyDetailsScreen} options={{ title: "تفاصيل الشركة" }}/>
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="InviteFriend" component={InviteFriendScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      

    </Stack.Navigator>
  );
}
