// src/utils/favoritesStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "FAVORITE_PRODUCTS";

export const getFavorites = async () => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveFavorites = async (favorites: any[]) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const addFavorite = async (product: any) => {
  const favorites = await getFavorites();
  if (favorites.length >= 5) throw new Error("لا يمكنك تحديد أكثر من 5 منتجات");
  const exists = favorites.find((f: any) => f._id === product._id);
  if (exists) return favorites;
  const updated = [...favorites, product];
  await saveFavorites(updated);
  return updated;
};

export const removeFavorite = async (id: string) => {
  const favorites = await getFavorites();
  const updated = favorites.filter((item: any) => item._id !== id);
  await saveFavorites(updated);
  return updated;
};
