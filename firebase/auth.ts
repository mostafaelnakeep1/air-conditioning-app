// // firebase/auth.ts
// import {
//   initializeAuth,
//   getReactNativePersistence,
//   getAuth,
//   Auth,
// } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { app } from "./config";

// let auth: Auth;

// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// } catch (e) {
//   auth = getAuth(app);
// }

// //export { auth };