// src/screens/admin/PromoteUserScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { BASE_URL } from "../../config/config";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string;
  email: string;
  promotedAt?: string;

  coverageAreas?: any[];
  companyImages?: string[];
}

export default function PromoteUserScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"promote" | "demote">("promote");
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    getCurrentAdmin();
  }, [mode]);

  const getCurrentAdmin = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentAdminId(user._id);
    }
  };

const fetchUsers = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const role = mode === "promote" ? "client" : "admin";
    const res = await fetch(`${BASE_URL}/users?role=${role}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    let filtered = Array.isArray(data.users) ? data.users : [];

    if (mode === "promote") {
      filtered = filtered.filter((user: User) => user.role === "client");
    }

    setUsers(filtered);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};


  const handlePromote = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`${BASE_URL}/admin/users/${id}/promote`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMode("demote");
    } catch (err) {
      console.error("Promote error:", err);
    }
  };

const handleDemote = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await fetch(`${BASE_URL}/admin/users/${id}/demote`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newRole: "client" }),  // أو "company"
    });
    fetchUsers();
  } catch (err) {
    console.error("Demote error:", err);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ إدارة صلاحيات المستخدمين</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, mode === "promote" && styles.active]}
          onPress={() => setMode("promote")}
        >
          <Text style={styles.switchText}>ترقية عميل</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, mode === "demote" && styles.active]}
          onPress={() => setMode("demote")}
        >
          <Text style={styles.switchText}>حذف أدمن</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ direction: "rtl" }}
          renderItem={({ item }) => {
            const isMainAdmin = item.email === "admin@amanapp.com";
            const isSelf = item._id === currentAdminId;
            const canBeDemoted = !isMainAdmin && !isSelf;

            return (
              <View style={styles.card}>
                <Text style={styles.name}>👤 {item.name}</Text>
                <Text style={styles.phone}>📞 {item.phone || "بدون رقم"}</Text>
                {mode === "demote" && item.promotedAt && (
                  <Text style={styles.date}>
                    📆 تمت الترقية في:{" "}
                    {new Date(item.promotedAt).toLocaleDateString("ar-EG")}
                  </Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.btn,
                    mode === "demote" && !canBeDemoted && {
                      backgroundColor: colors.LightGray,
                    },
                  ]}
                  disabled={mode === "demote" && !canBeDemoted}
                  onPress={() =>
                    mode === "promote"
                      ? handlePromote(item._id)
                      : handleDemote(item._id)
                  }
                >
                  <Text style={styles.btnText}>
                    {mode === "promote"
                      ? "ترقية"
                      : canBeDemoted
                      ? "إلغاء صلاحية الأدمن"
                      : "لا يمكن الحذف"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Layout.width(5),
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
    marginBottom: Layout.height(2),
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Layout.height(2),
  },
  switchButton: {
    paddingVertical: Layout.height(1.2),
    paddingHorizontal: Layout.width(4),
    backgroundColor: colors.LightGray,
    borderRadius: Layout.width(2.5),
  },
  active: {
    backgroundColor: colors.primary,
  },
  switchText: {
    color: colors.black,
    fontSize: Layout.font(2.3),
  },
  card: {
    backgroundColor: colors.white,
    padding: Layout.height(2),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: Layout.font(2.4),
    fontWeight: "600",
    marginBottom: 4,
    color: colors.black,
  },
  phone: {
    fontSize: Layout.font(2),
    color: colors.gray,
  },
  date: {
    fontSize: Layout.font(2),
    color: colors.gray,
    marginTop: 4,
  },
  btn: {
    backgroundColor: colors.primary,
    marginTop: Layout.height(1.5),
    paddingVertical: Layout.height(1.2),
    borderRadius: Layout.width(2),
    alignItems: "center",
  },
  btnText: {
    color: colors.white,
    fontSize: Layout.font(2.2),
  },
});
