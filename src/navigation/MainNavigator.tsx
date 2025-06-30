import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

// استيراد الشاشات الفرعية لحسابي
import UserInfoScreen from "../screens/profileScreens/UserInfoScreen";
import OrdersHistoryScreen from "../screens/profileScreens/OrdersHistoryScreen";
import PreviousCompaniesScreen from "../screens/profileScreens/PreviousCompaniesScreen";
import SavedAddressesScreen from "../screens/profileScreens/SavedAddressesScreen";
import ContactUsScreen from "../screens/profileScreens/ContactUsScreen";
import InviteFriendScreen from "../screens/profileScreens/InviteFriendScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    
    
    
      

      {/* 🧍‍♂️ شاشات حسابي */}
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
      <Stack.Screen name="PreviousCompanies" component={PreviousCompaniesScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="InviteFriend" component={InviteFriendScreen} />
    </Stack.Navigator>
  );
}
