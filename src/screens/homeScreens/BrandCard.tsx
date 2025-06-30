import React from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import colors from "../../constants/colors";
import { Layout } from "../../constants/layout";

interface Props {
  item: { id: string; name: string };
  index: number;
  scrollX: SharedValue<number>;
  cardWidth: number;
  spacing: number;
}

export default function BrandCard({
  item,
  index,
  scrollX,
  cardWidth,
  spacing,
}: Props) {
  const inputRange = [
    (index - 1) * (cardWidth + spacing),
    index * (cardWidth + spacing),
    (index + 1) * (cardWidth + spacing),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], "clamp");
    const zIndex = interpolate(scrollX.value, inputRange, [0, 2, 0], "clamp");

    return {
      transform: [{ scale }],
      zIndex,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.cardText}>{item.name}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: Layout.width(50),
    height: Layout.height(12),
    backgroundColor: colors.white,
    borderRadius: Layout.width(3),
    marginHorizontal: Layout.width(1.5),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: Layout.font(2),
    color: colors.black,
    fontWeight: "bold",
  },
});