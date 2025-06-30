import React, { createContext, useState, useEffect, ReactNode } from "react";
import apiClient from "../api/apiClient";

export interface Ad {
  _id: string;
  videoUrl: string;
  position: number;
  durationDays: number;
  status: "active" | "paused";
  expiryDate: string;
  title?: string;
}

interface AdsContextType {
  ads: Ad[];
  fetchAds: () => Promise<void>;
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
}

export const AdsContext = createContext<AdsContextType>({
  ads: [],
  fetchAds: async () => {},
  setAds: () => {},
});

export const AdsProvider = ({ children }: { children: ReactNode }) => {
  const [ads, setAds] = useState<Ad[]>([]);

  const fetchAds = async () => {
    try {
      const res = await apiClient.get("/ads");
      setAds(res.data.ads);
    } catch (error) {
      console.error("Failed to fetch ads", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <AdsContext.Provider value={{ ads, fetchAds, setAds }}>
      {children}
    </AdsContext.Provider>
  );
};
