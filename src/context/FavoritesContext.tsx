// src/context/FavoritesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../navigation/types";

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const toggleFavorite = (product: Product) => {
    const exists = favorites.some((p) => p._id === product._id);
    if (exists) {
      setFavorites((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      if (favorites.length >= 5) {
        // ممكن تضيف Toast هنا لو حابب
        return;
      }
      setFavorites((prev) => [product, ...prev]);
    }
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
