import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";

type Offer = {
  _id: string;
  title: string;
  company: { name: string };
  expiresAt?: string;
  mediaUrl?: string;
};

export default function OffersScreen() {
  const { userToken } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = (() => {
    try {
      const decoded: any = jwtDecode(userToken || "");
      return decoded.role === "admin";
    } catch {
      return false;
    }
  })();

  const fetchApprovedOffers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/offers/approved", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setOffers(res.data.offers);
    } catch (error) {
      Alert.alert("خطأ", "فشل جلب العروض");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken) return;
    fetchApprovedOffers();
  }, [userToken]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (offers.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.noDataContainer}>
        <Text style={styles.noDataText}>لا توجد عروض متاحة حالياً</Text>
      </ScrollView>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={offers}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <OfferCard item={item} isAdmin={isAdmin} userToken={userToken} onDeleted={fetchApprovedOffers} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const OfferCard = ({
  item,
  isAdmin,
  userToken,
  onDeleted,
}: {
  item: Offer;
  isAdmin: boolean;
  userToken: string | null | undefined;
  onDeleted: () => void;
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const isVideo = item.mediaUrl?.endsWith(".mp4");
  const mediaUrl = item.mediaUrl || "https://via.placeholder.com/300x200";

  const handleDelete = () => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذا العرض؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/offers/${item._id}`, {
              headers: { Authorization: `Bearer ${userToken}` },
            });
            Alert.alert("تم الحذف", "تم حذف العرض بنجاح");
            onDeleted();
          } catch (err) {
            Alert.alert("خطأ", "فشل في حذف العرض");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {isVideo ? (
        <View style={{ position: "relative", width: "100%", height: 200 }}>
          <Video
            source={{ uri: mediaUrl }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={isMuted}
          />
          <TouchableOpacity
            onPress={() => setIsMuted((prev) => !prev)}
            style={styles.soundButton}
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Image source={{ uri: mediaUrl }} style={styles.media} resizeMode="cover" />
      )}
      <View >
        {/* <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
        <Text style={{ color: colors.gray, marginTop: 4 }}>
          من: {item.company?.name || "غير معروف"}
        </Text> */}
        {isAdmin && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={{ color: "#fff" }}>حذف العرض</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: Layout.height(5),
  },
  content: {
    padding: Layout.width(4),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  noDataContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.width(4),
  },
  noDataText: {
    fontSize: Layout.font(2),
    color: colors.gray,
  },
  card: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(2),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 0.1,
    borderColor: colors.black,
  },
  media: {
    width: "100%",
    height: 200,
  },
  soundButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: "#D11A2A",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
});
