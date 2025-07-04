// src/navigation/types.ts


export interface Order {
   _id: string;
  product: {
    name: string;
    brand: string;
  };
  company: {
    name: string;
    email: string;
  };
  user: {
    name: string;
    phone: string;
  };
  createdAt: string;
  status: string;
  totalPrice: number;
  address?: string;
  code?: string;
};

export interface Company {
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
  city?: string;
}
export type Product = {
  _id: string;
  name: string;
  brand: string;
  description?: string;
  price?: number;
  createdAt?: string;
  image?: string;
  type: string;
  capacity: number;
  installDuration: number;
  isHidden: boolean;
  isSuspended: boolean;
  power?: string;       // القدرة
  sold?: number;        // عدد المبيعات
  rating?: number;
  company?: {
    _id: string;
    name: string;
  };
 };


export type RootStackParamList = {
  OrdersHistoryScreen: undefined;
  OrderDetailsScreen: { order: Order };
  PreviousCompaniesScreen: undefined;
  SplashScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  MainApp: undefined;
  ManageCompaniesScreen: undefined;
  CompanyDetailsScreen: { companyId: string };
  ManageProductsScreen: undefined;
  ProductDetailsScreen: { product: Product  };
  Register: undefined;
  MainTabs: undefined;
  UserInfo: undefined;
  OrdersHistory: undefined;
  PreviousCompanies: undefined;
  SavedAddresses: undefined;
  ContactUs: undefined;
  InviteFriend: undefined;
  FavoritesScreen: undefined;
  ProfileMain: undefined;
  
  ForgotPasswordScreen: undefined;
};



export type ProfileStackParamList = {
  ProfileMain: undefined;
  UserInfo: undefined;
  OrdersHistory: undefined;
  FavoritesScreen: undefined;
  PreviousCompanies: undefined;
  SavedAddresses: undefined;
  ContactUs: undefined;
  InviteFriend: undefined;
  LoginScreen: undefined;
  SplashScreen: undefined;
  OrderDetailsScreen: { orderId: string };
  CompanyDetailsScreen: { companyId: string };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  AllVendorsScreen: undefined; // ✅ أضف ده هنا
  // باقي الشاشات...
};


