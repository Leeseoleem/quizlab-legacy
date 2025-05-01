import { StyleSheet, View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import Octicons from "@expo/vector-icons/Octicons";

export default function PercentList({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.continer}>
      <View style={styles.titleSec}>
        <Octicons name="dot-fill" size={32} color={color} />
        <Text style={styles.text}>{title}</Text>
      </View>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  continer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleSec: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  text: {
    ...FontStyle.bedgeText,
    color: GrayColors.black,
  },
});
