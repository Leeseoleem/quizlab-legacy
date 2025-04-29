import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from "react-native";
import { StyleSheet } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

type BtnListProps = {
  text: string;
  textColorStyle: StyleProp<TextStyle>;
  onPress: () => void;
};

export default function BtnList({
  text,
  textColorStyle,
  onPress,
}: BtnListProps) {
  return (
    <TouchableOpacity
      style={styles.btnContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[textColorStyle, FontStyle.contentsText]}>{text}</Text>
      <Feather name="chevron-right" size={24} color={GrayColors.grayHax} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contents: {
    padding: 16,
  },
  btnText: {
    ...FontStyle.modalTitle,
  },
});
