// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/config";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import axios from "axios";


// نوع الدور
type UserRole = "client" | "company" | "admin" | null;

// شكل بيانات المستخدم
interface UserData {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthReady: boolean;
  user: UserData | null;
  token: string;
  setUser: (user: UserData | null) => void;
  userRole: UserRole;
  isAdmin: boolean;
  isCompany: boolean;
  isClient: boolean;
   userToken: string | null;
  setUserToken: (token: string | null) => void;
  login: (userData: UserData, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAuthReady: false,
  user: null,
  token: "",
  setUser: () => {},
  userRole: null,
  isAdmin: false,
  isCompany: false,
  isClient: false,
  userToken: null,
  setUserToken: () => {},
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userToken, setUserToken] = useState<string | null>(null);


  const isAdmin = userRole === "admin";
  const isCompany = userRole === "company";
  const isClient = userRole === "client";

  const login = (userData: UserData, tokenData: string) => {
  const fixedUser = {
    ...userData,
    _id: userData._id || userData.id, // ✨ أهو الحل الذهبي هنا
    token: tokenData,
  };
  setUser(fixedUser);
  setToken(tokenData);
  setUserToken(tokenData); 
  setUserRole(fixedUser.role);
  setIsLoggedIn(true);
  AsyncStorage.setItem("token", tokenData);
  AsyncStorage.setItem("user", JSON.stringify(fixedUser));
};


  const logout = () => {
    setUser(null);
    setToken("");
    setUserRole(null);
    setIsLoggedIn(false);
    AsyncStorage.removeItem("token");
  };

useEffect(() => {
  const checkStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user"); // جلب بيانات المستخدم لو محفوظة
      if (storedToken) {
        setToken(storedToken);
        setUserToken(storedToken);
        setIsLoggedIn(true);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setUserRole(userData.role);
        }
      }
    } catch (error) {
      console.error("Error loading token or user from storage", error);
    } finally {
      setIsAuthReady(true);
    }
  };
  checkStoredToken();
}, []);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthReady,
        user,
        token,
        userRole,
        isAdmin,
        setUser,
        isCompany,
        isClient,
        login,
        logout,
        userToken,       
        setUserToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useRegisterPushToken = (userToken: string) => {
  useEffect(() => {
    const getAndSendToken = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        try {
          await axios.put(
            `${BASE_URL}/api/users/save-token`,
            { token },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
        } catch (error) {
          console.error("Error sending push token:", error);
        }
      }
    };

    getAndSendToken();
  }, []);
};