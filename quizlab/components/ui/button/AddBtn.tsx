import React from "react";
import { View, TouchableOpacity, GestureResponderEvent } from "react-native";
import { StyleSheet } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { GrayColors, MainColors } from "@/constants/Colors";

type AddBtnProps = {
  onPress: (event: GestureResponderEvent) => void;
};

export default function AddBtn({ onPress }: AddBtnProps) {
  return (
    <TouchableOpacity
      style={styles.addBtn}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Feather name="plus" size={24} color={GrayColors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 1000,
    backgroundColor: MainColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
