// src/constants/layout.ts
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Dimensions } from "react-native";

export const Layout = {
  height: responsiveHeight,
  width: responsiveWidth,
  font: responsiveFontSize,
  defaultPadding: 16,
  defaultMargin: 16,
  defaultRadius: 12,
  screenWidth: Dimensions.get("window").width,
};
