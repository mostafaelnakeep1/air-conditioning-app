import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";
import { AdsContext } from "../../context/AdsContext";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function AdBanner() {
  const flatListRef = useRef<FlatList>(null);
  const { ads } = useContext(AdsContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // ✅ كتم الصوت مبدئيًا

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      const invertedIndex = ads.length - 1 - nextIndex;
      flatListRef.current?.scrollToIndex({ index: invertedIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", height: Layout.height(15) }]}>
        <Text style={{ textAlign: "center", color: colors.gray }}>لا توجد إعلانات حالياً</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ads}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        inverted
        initialScrollIndex={ads.length - 1}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.banner}>
            <Video
              source={{ uri: item.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              useNativeControls={false}
              shouldPlay
              isLooping
              isMuted={isMuted} // ✅ هنا كتم الصوت
            />
            <TouchableOpacity
              onPress={() => setIsMuted((prev) => !prev)}
              style={styles.soundButton}
            >
              <Ionicons
                name={isMuted ? "volume-mute" : "volume-high"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        )}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: Layout.height(2) },
  banner: {
    width: screenWidth - Layout.width(6),
    height: Layout.height(15),
    backgroundColor: colors.DarkBlue,
    borderRadius: Layout.width(5),
    marginHorizontal: Layout.width(3),
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  soundButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },
  text: {
    fontSize: Layout.font(2.2),
    fontWeight: "600",
    color: colors.white,
    writingDirection: "rtl",
    textAlign: "center",
  },
});
