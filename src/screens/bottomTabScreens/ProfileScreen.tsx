// import React, { useRef, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   Animated,
//   Pressable,
//   Alert,
// } from "react-native";
// import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
// import colors from "../../constants/colors";
// import { Layout } from "../../constants/layout";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import type { StackNavigationProp } from "@react-navigation/stack";
// import { CommonActions } from '@react-navigation/native';
// import { useAuth } from "../../context/AuthContext";
// import { ProfileStackParamList } from "../../navigation/types";
// import { sendNotification } from "../../utils/notifications";


// type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;


// export default function ProfileScreen() {
//   const navigation = useNavigation<ProfileScreenNavigationProp>();
//   const { logout } = useAuth();

//   type MenuItem = {
//   title: string;
//   screen: keyof ProfileStackParamList;
//   };

//   const menuItems: { title: string; screen: keyof ProfileStackParamList }[] = [
//     { title: "البيانات الشخصية", screen: "UserInfo" },
//     { title: "طلباتي", screen: "OrdersHistory" },
//     { title: "المفضلة", screen: "FavoritesScreen" },    
//     { title: "شركات تم التعامل معها", screen: "PreviousCompanies" },
//     { title: "العناوين المحفوظة", screen: "SavedAddresses" },
//     { title: "تواصل معنا", screen: "ContactUs" },
//     { title: "دعوة صديق", screen: "InviteFriend" },
//   ];

//   const iconMap: Record<keyof ProfileStackParamList | "Logout", React.ComponentProps<typeof Icon>["name"]> = {
//     UserInfo: "account",
//     OrdersHistory: "history",
//     FavoritesScreen: "heart",
//     PreviousCompanies: "office-building",
//     SavedAddresses: "map-marker",
//     ContactUs: "chat",
//     InviteFriend: "account-multiple-plus",
//     LoginScreen: "logout", // مش مستخدمة بس نحطها عشان الأنواع
//     Logout: "logout",
//     SplashScreen: "account-multiple-plus",
//     ProfileMain: "account",
//     OrderDetailsScreen: "clipboard-text",
//     CompanyDetailsScreen: "domain",
//   };

//   const scalesRef = useRef(menuItems.map(() => new Animated.Value(1)));

//   const handlePressIn = (index: number) => {
//     Animated.spring(scalesRef.current[index], {
//       toValue: 0.96,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = (index: number) => {
//     Animated.spring(scalesRef.current[index], {
//       toValue: 1,
//       friction: 4,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("token"); // حذف التوكن من التخزين
//       logout(); // تصفير الحالة من الكونتكست

//        navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{ name: "LoginScreen" }],
//       })
//     );
//     } catch (error) {
//       Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج");
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.container}>
//           <Text style={styles.header}>👤 حسابي</Text>

//           {menuItems.map((item, index) => (
//             <Pressable
//               key={index}
//               onPressIn={() => handlePressIn(index)}
//               onPressOut={() => handlePressOut(index)}
//               onPress={() => {
//   switch (item.screen) {
//     case "UserInfo":
//     case "OrdersHistory":
//     case "FavoritesScreen":
//     case "PreviousCompanies":
//     case "SavedAddresses":
//     case "ContactUs":
//     case "InviteFriend":
//       navigation.navigate(item.screen);
//       break;
//   }
// }}
//             >
//               <Animated.View
//                 style={[
//                   styles.card,
//                   { transform: [{ scale: scalesRef.current[index] }] },
//                 ]}
//               >
//                 <View style={styles.cardContent}>
//                   <View style={styles.iconWrapper}>
//                     <Icon
//                       name={iconMap[item.screen]}
//                       size={Layout.font(2.5)}
//                       color={colors.primary}
//                     />
//                   </View>
//                   <Text style={styles.cardText}>{item.title}</Text>
//                 </View>
//               </Animated.View>
//             </Pressable>
//           ))}

//           <Pressable onPress={handleLogout}>
//             <View style={styles.logout}>
//               <View style={styles.cardContent}>
//                 <View style={styles.iconWrapperLogout}>
//                   <Icon
//                     name={iconMap["Logout"]}
//                     size={Layout.font(2.5)}
//                     color="red"
//                   />
//                 </View>
//                 <Text style={styles.logoutText}>تسجيل الخروج</Text>
//               </View>
//             </View>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }


// const ICON_SIZE = Layout.font(2.5);
// const ICON_RADIUS = ICON_SIZE + Layout.width(2.5);

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     backgroundColor: colors.background,
//   },
//   container: {
//     flex: 1,
//     padding: Layout.width(5),
//     backgroundColor: colors.background,
//     paddingVertical: Layout.height(5),
//   },
//   header: {
//     fontSize: Layout.font(3.8),
//     fontWeight: "bold",
//     marginBottom: Layout.height(4),
//     alignSelf: "center",
//     color: colors.black,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: Layout.height(2),
//     borderRadius: Layout.width(4),
//     marginBottom: Layout.height(1.2),
//     width: "100%",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: Layout.height(0.8) },
//     shadowOpacity: 0.1,
//     shadowRadius: Layout.width(1.5),
//   },
//   cardContent: {
//     flexDirection: "row-reverse",
//     alignItems: "center",
//   },
//   iconWrapper: {
//     backgroundColor: colors.primary + "20",
//     padding: Layout.width(2),
//     borderRadius: ICON_RADIUS,
//     marginLeft: Layout.width(3),
//   },
//   iconWrapperLogout: {
//     backgroundColor: "#ff000020",
//     padding: Layout.width(2),
//     borderRadius: ICON_RADIUS,
//     marginLeft: Layout.width(3),
//   },
//   cardText: {
//     fontSize: Layout.font(2.3),
//     color: colors.black,
//     fontWeight: "500",
//   },
//   logout: {
//     backgroundColor: "#fff0f0",
//     padding: Layout.height(2),
//     borderRadius: Layout.width(4),
//     width: "100%",
//     marginTop: Layout.height(4),
//     elevation: 1,
//   },
//   logoutText: {
//     fontSize: Layout.font(2.3),
//     color: "red",
//     fontWeight: "bold",
//   },
// });

import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { ProfileStackParamList } from "../../navigation/types";

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout } = useAuth();

  const menuItems = [
    { title: "البيانات الشخصية", screen: "UserInfo" },
    { title: "طلباتي", screen: "OrdersHistory" },
    { title: "المفضلة", screen: "FavoritesScreen" },
    { title: "شركات التعامل معها", screen: "PreviousCompanies" },
    { title: "العناوين المحفوظة", screen: "SavedAddresses" },
    { title: "تواصل معنا", screen: "ContactUs" },
    { title: "دعوة صديق", screen: "InviteFriend" },
  ] as const;

  const iconMap: Record<keyof ProfileStackParamList | "Logout", React.ComponentProps<typeof Icon>["name"]> = {
    UserInfo: "account",
    OrdersHistory: "history",
    FavoritesScreen: "heart",
    PreviousCompanies: "office-building",
    SavedAddresses: "map-marker",
    ContactUs: "chat",
    InviteFriend: "account-multiple-plus",
    LoginScreen: "logout", // مش مستخدمة بس نحطها عشان الأنواع
    Logout: "logout",
    SplashScreen: "account-multiple-plus",
    ProfileMain: "account",
    OrderDetailsScreen: "clipboard-text",
    CompanyDetailsScreen: "domain",
  };

  const scalesRef = useRef(menuItems.map(() => new Animated.Value(1)));

  const handlePressIn = (index: number) => {
    Animated.spring(scalesRef.current[index], {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scalesRef.current[index], {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // حذف التوكن من التخزين
      logout(); // تصفير الحالة من الكونتكست

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        })
      );
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج");
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.tobSection}>
          {/* <Text style={styles.header}>👤 حسابي</Text> */}

          {/* سكشن الكروت العلوية مع خلفيات صور */}
          <View style={styles.topCardsContainer}>
            {menuItems.slice(0, 4).map((item, index) => (
              <Pressable
                key={index}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                onPress={() => navigation.navigate(item.screen)}
                style={styles.gridItem}
              >
                <Animated.View
                  style={[styles.topCard, { transform: [{ scale: scalesRef.current[index] }] }]}
                >
                  <ImageBackground
                    source={require("../../imags/R.webp")} // غير الصورة حسب الحاجة
                    style={styles.topCardImage}
                    imageStyle={{ borderRadius: Layout.width(4) }}
                  >
                    <View style={styles.overlay}>
                      <Icon name={iconMap[item.screen]} size={Layout.font(3)} color="#fff" />
                      <Text style={styles.topCardText}>{item.title}</Text>
                    </View>
                  </ImageBackground>
                </Animated.View>
              </Pressable>
            ))}
          </View>

          </View>

          {/* الخلفية الغامقة المنحنية تحت الكروت */}
          <View style={styles.bottomSection}>
            {menuItems.slice(4).map((item, index) => {
              const realIndex = index + 4;
              return (
                <Pressable
                  key={realIndex}
                  onPressIn={() => handlePressIn(realIndex)}
                  onPressOut={() => handlePressOut(realIndex)}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <Animated.View style={[styles.card, { transform: [{ scale: scalesRef.current[realIndex] }] }]}>
                    <View style={styles.cardContent}>
                      <View style={styles.iconWrapper}>
                        <Icon name={iconMap[item.screen]} size={Layout.font(2.5)} color={colors.primary} />
                      </View>
                      <Text style={styles.cardText}>{item.title}</Text>
                    </View>
                  </Animated.View>
                </Pressable>
              );
            })}

            {/* تسجيل الخروج */}
            <Pressable onPress={handleLogout}>
              <View style={styles.logout}>
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapperLogout}>
                    <Icon name="logout" size={Layout.font(2.5)} color="red" />
                  </View>
                  <Text style={styles.logoutText}>تسجيل الخروج</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ICON_SIZE = Layout.font(2.5);
const ICON_RADIUS = ICON_SIZE + Layout.width(2.5);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.DarkBlue,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    //padding: Layout.width(5),
    backgroundColor: colors.background,
    paddingVertical: Layout.height(5),
  },
  tobSection: {    
  //width: "100%", // ياخد العرض كاملًا
  height: Layout.height(40), // تقريبًا نص الشاشة (50% من الارتفاع بوحدة Layout)
  backgroundColor: colors.DarkBlue, // مؤقت للتجربة
  paddingHorizontal: 10, // تأكيد إنه مفيش padding
  marginHorizontal: 12, 
  borderRadius: 50,
  
  overflow: 'hidden',
//  alignItems: 'center',
  justifyContent: 'center',

  },
  header: {
    fontSize: Layout.font(3.8),
    fontWeight: "bold",
    marginBottom: Layout.height(4),
    alignSelf: "center",
    color: colors.black,
  },
  topCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: Layout.height(3),
    //backgroundColor: colors.background,
    paddingVertical: 20,
    
  },
  gridItem: {
    width: "38%",
    marginBottom: Layout.height(2),
  },
  topCard: {
    borderRadius: Layout.width(4),
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Layout.height(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: Layout.width(1.5),
  },
  topCardImage: {
    width: "100%",
    height: Layout.height(12),
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  topCardText: {
    marginTop: Layout.height(1.2),
    fontSize: Layout.font(2.2),
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: Layout.height(2),
    borderRadius: Layout.width(4),
    marginBottom: Layout.height(1.2),
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Layout.height(0.8) },
    shadowOpacity: 0.1,
    shadowRadius: Layout.width(1.5),
  },
  cardContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: colors.primary + "20",
    padding: Layout.width(2),
    borderRadius: ICON_RADIUS,
    marginLeft: Layout.width(3),
  },
  iconWrapperLogout: {
    backgroundColor: "#ff000020",
    padding: Layout.width(2),
    borderRadius: ICON_RADIUS,
    marginLeft: Layout.width(3),
  },
  cardText: {
    fontSize: Layout.font(2.3),
    color: colors.black,
    fontWeight: "500",
  },
  bottomSection: {
    paddingTop: Layout.height(4),
    paddingBottom: Layout.height(6),
    paddingHorizontal: Layout.width(3),
  },
  logout: {
    backgroundColor: "#fff0f0",
    padding: Layout.height(2),
    borderRadius: Layout.width(4),
    width: "100%",
    marginTop: Layout.height(4),
    elevation: 1,
  },
  logoutText: {
    fontSize: Layout.font(2.3),
    color: "red",
    fontWeight: "bold",
  },
});
