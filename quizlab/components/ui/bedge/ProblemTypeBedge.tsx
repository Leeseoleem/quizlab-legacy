import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

export type PropblemTypeBedgeProps = {
  type: "descriptive" | "choice";
};

export default function PropblemTypeBedge({ type }: PropblemTypeBedgeProps) {
  return (
    <View style={styles.bedgeContainer}>
      {type === "descriptive" && (
        <View style={styles.typeContents}>
          <Feather name="list" size={12} color={GrayColors.black} />
          <Text style={styles.bedgeTitle}>서술형</Text>
        </View>
      )}
      {type === "choice" && (
        <View style={styles.typeContents}>
          <Feather name="check-square" size={12} color={GrayColors.black} />
          <Text style={styles.bedgeTitle}>선택형</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bedgeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: GrayColors.white,
    borderWidth: 1,
    borderColor: GrayColors.grayHax,
  },
  typeContents: {
    flexDirection: "row",
    alignItems: "center",
  },
  bedgeTitle: {
    ...FontStyle.bedgeText,
    color: GrayColors.black,
    marginLeft: 6,
  },
});
