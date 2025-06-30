import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

// بيانات وهمية
const offers = [
  {
    id: 1,
    title: "خصم 20% على تكييف شارب",
    company: "شركة المستقبل",
    expires: "حتى 30 يونيو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg" ,
  },
  {
    id: 2,
    title: "تركيب مجاني عند شراء LG",
    company: "الرواد للتكييف",
    expires: "حتى 15 يوليو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg",
  },
  {
    id: 3,
    title: "خصم 20% على تكييف شارب",
    company: "شركة المستقبل",
    expires: "حتى 30 يونيو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg" ,
  },
  {
    id: 4,
    title: "تركيب مجاني عند شراء LG",
    company: "الرواد للتكييف",
    expires: "حتى 15 يوليو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg",
  },
  {
    id: 5,
    title: "خصم 20% على تكييف شارب",
    company: "شركة المستقبل",
    expires: "حتى 30 يونيو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg" ,
  },
  {
    id: 6,
    title: "تركيب مجاني عند شراء LG",
    company: "الرواد للتكييف",
    expires: "حتى 15 يوليو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg",
  },
  {
    id: 7,
    title: "خصم 20% على تكييف شارب",
    company: "شركة المستقبل",
    expires: "حتى 30 يونيو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg" ,
  },
  {
    id: 8,
    title: "تركيب مجاني عند شراء LG",
    company: "الرواد للتكييف",
    expires: "حتى 15 يوليو",
    image: "https://cdn.pixabay.com/photo/2020/05/26/08/50/air-conditioner-5222620_960_720.jpg",
  },
];

export default function OffersScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={styles.title}>العروض المتاحة</Text>


  
    



      {offers.map((offer) => (
        <View key={offer.id} style={styles.card}>
          <Image source={{ uri: offer.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{offer.title}</Text>
            <Text style={styles.cardCompany}>مقدم من: {offer.company}</Text>
            <Text style={styles.cardDate}>{offer.expires}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: Layout.height(5),
  },
  content: {
    padding: Layout.width(4),
  },
  title: {
    fontSize: Layout.font(2.4),
    fontWeight: "bold",
    marginBottom: Layout.height(2),
    textAlign: "right",
    color: colors.primary,
  },
  card: {
    flexDirection: "row-reverse", // علشان RTL
    backgroundColor: "#F9FAFB",
    padding: Layout.width(3),
    borderRadius: Layout.width(3),
    marginBottom: Layout.height(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 0.1,
    borderColor: colors.black,
    alignItems: "center",
  },
  image: {
    width: Layout.width(24),
    height: Layout.width(24),
    borderRadius: Layout.width(2),
    marginLeft: Layout.width(3),
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Layout.font(2.2),
    fontWeight: "700",
    color: "#111827",
    marginBottom: Layout.height(0.5),
    textAlign: "right",
  },
  cardCompany: {
    fontSize: Layout.font(1.8),
    color: "#4B5563",
    marginBottom: Layout.height(0.3),
    textAlign: "right",
  },
  cardDate: {
    fontSize: Layout.font(1.6),
    color: "#9CA3AF",
    textAlign: "right",
  },
});
