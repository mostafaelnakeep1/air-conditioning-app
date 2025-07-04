import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { BASE_URL } from "../../config/config";
import apiClient from "../../api/apiClient";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function NotificationsScreen() {
  const { userToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(0);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("فشل في جلب الإشعارات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [userToken]);

  const markAllAsRead = async () => {
    setMarking(true);
    try {
      apiClient.put(
        "/notifications/mark-all-read");
        
      
      fetchNotifications();
    } catch (error) {
      console.error("فشل تحديد الكل كمقروء", error);
    } finally {
      setMarking(false);
    }
  };

  const handleNotificationPress = async (id: string) => {
    try {
      await apiClient.put("/notifications/mark-read/${id}");
        
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("فشل تحديد الإشعار كمقروء:", error);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollOffset.current ? "down" : "up";
    scrollOffset.current = currentOffset;

    Animated.timing(headerTranslateY, {
      toValue: direction === "down" ? -80 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Header ثابت مع أنيميشن */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        <Text style={styles.title}>الإشعارات</Text>
        <TouchableOpacity
          disabled={marking}
          onPress={markAllAsRead}
          style={styles.markButton}
        >
          <Text style={styles.markButtonText}>
            {marking ? "جارِ التحديث..." : "تحديد الكل كمقروء"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {notifications.length === 0 && (
          <Text style={styles.noNotificationsText}>لا توجد إشعارات حالياً</Text>
        )}

        {notifications.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleNotificationPress(item._id)}
            activeOpacity={0.8}
            style={[
              styles.card,
              {
                backgroundColor: item.isRead ? colors.white : "#e8f0ff",
                flexDirection: "column",
                alignItems: "flex-end",
              },
            ]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
            <Text style={styles.cardDate}>
              {new Date(item.createdAt).toLocaleString("ar-EG", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Layout.height(4),
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Layout.width(4),
    paddingTop: Layout.height(5),
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "right",
  },
  markButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  markButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    paddingTop: Layout.height(8),
    paddingHorizontal: Layout.width(4),
    paddingBottom: Layout.height(4),
  },
  noNotificationsText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.gray,
  },
  card: {
    padding: Layout.width(4),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
    borderWidth: 0.1,
    borderColor: colors.black,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: Layout.font(2.2),
    fontWeight: "700",
    color: colors.black,
    marginBottom: Layout.height(0.5),
    textAlign: "right",
  },
  cardMessage: {
    fontSize: Layout.font(1.8),
    color: colors.black,
    marginBottom: Layout.height(0.3),
    textAlign: "right",
  },
  cardDate: {
    fontSize: Layout.font(1.6),
    color: colors.gray,
    textAlign: "right",
  },
});
