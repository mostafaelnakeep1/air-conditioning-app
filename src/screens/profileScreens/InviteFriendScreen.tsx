// screens/client/InviteFriendScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share, SafeAreaView } from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

const InviteFriendScreen = () => {
  const handleInvite = async () => {
    try {
      await Share.share({
        message: "جرب تطبيقنا لتكييفات الهواء واحصل على أفضل عروض الشركات: https://example.com",
      });
    } catch (error) {
      console.log("Error sharing", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.section}>
        <Text style={styles.header}>دعوة صديق</Text>
        <Text style={styles.text}>شارك التطبيق مع أصدقائك واحصل على مزايا!</Text>

        <TouchableOpacity style={styles.button} onPress={handleInvite} activeOpacity={0.7}>
          <Text style={styles.buttonText}>مشاركة التطبيق</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: Layout.width(5),
    paddingVertical: Layout.height(4),
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: Layout.width(4),
    paddingHorizontal: Layout.width(5),
    paddingVertical: Layout.height(5),
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: Layout.font(3.8),
    fontWeight: "bold",
    marginBottom: Layout.height(2.5),
    color: colors.black,
    textAlign: "center",
  },
  text: {
    fontSize: Layout.font(2.3),
    color: colors.gray,
    textAlign: "center",
    marginBottom: Layout.height(4),
    paddingHorizontal: Layout.width(5),
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: Layout.height(2.2),
    borderRadius: Layout.width(3),
    minWidth: Layout.width(40),
  },
  buttonText: {
    color: colors.white,
    fontSize: Layout.font(2.7),
    textAlign: "center",
    fontWeight: "600",
  },
});

export default InviteFriendScreen;
