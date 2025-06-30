// src/screens/adminScreens/ManageClientsScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import apiClient from "../../api/apiClient";


interface Client {
  _id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  ordersCount: number;
}

type AdminStackParamList = {
  ClientDetailsScreen: { clientId: string };
};

export default function ManageClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchText, setSearchText] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  useEffect(() => {
    fetchClients();
  }, []);

const fetchClients = async () => {
  try {
    const res = await apiClient.get("/users?role=client");
    // المفروض الرد هيكون { users: [...] }
    const filteredClients = Array.isArray(res.data.users)
      ? res.data.users.filter((user: any) => user.role === "client")
      : [];
    setClients(filteredClients);
  } catch (err) {
    console.error("Fetch clients error:", err);
  }
};



  const deleteClient = (id: string) => {
  Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذا العميل؟", [
    { text: "إلغاء" },
    {
      text: "حذف",
      onPress: async () => {
        try {
          await apiClient.delete(`/users/${id}`);
          setClients((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
          console.error("Delete client error:", err);
        }
      },
    },
  ]);
};


  const filteredClients = searchText.trim() === ""
  ? clients
  : clients.filter((client) =>
    [client.name, client.phone, client.email].some((val) =>
      val.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 إدارة العملاء</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="ابحث بالاسم أو الهاتف أو الإيميل"
        onChangeText={setSearchText}
        value={searchText}
      />

      {filteredClients.length === 0 ? (
        <View style={styles.noClientsCard}>
          <Text style={styles.noClientsText}>لا يوجد عملاء مطابقين للبحث</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ direction: "rtl" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ClientDetailsScreen", {
                  clientId: item._id,
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.serial}>#{index + 1}</Text>
                <TouchableOpacity onPress={() => deleteClient(item._id)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>

              <Text style={styles.name}>👤 {item.name}</Text>
              <Text style={styles.phone}>📞 {item.phone}</Text>
              <Text style={styles.date}>
                🗓 منذ:{" "}
                {new Date(item.createdAt).toLocaleDateString("ar-EG")}
              </Text>
              <Text style={styles.orders}>
                🛒 عدد الطلبات: {item.ordersCount}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Layout.width(4),
  },
  title: {
    fontSize: Layout.font(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.height(2),
    color: colors.black,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: Layout.width(3),
    padding: Layout.height(1.5),
    marginBottom: Layout.height(2),
    backgroundColor: colors.white,
    textAlign: "right",
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
  serial: { fontWeight: "bold", color: colors.gray },
  name: {
    fontSize: Layout.font(2.3),
    fontWeight: "600",
    color: colors.black,
    marginTop: 5,
  },
  phone: { fontSize: Layout.font(2), color: colors.gray },
  date: { fontSize: Layout.font(2), color: colors.gray },
  orders: { fontSize: Layout.font(2), color: colors.primary },
  noClientsCard: {
    backgroundColor: colors.white,
    padding: Layout.height(3),
    borderRadius: Layout.width(3),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: Layout.height(2),
    alignItems: "center",
  },
  noClientsText: {
    fontSize: Layout.font(2.3),
    color: colors.gray,
  },
});
