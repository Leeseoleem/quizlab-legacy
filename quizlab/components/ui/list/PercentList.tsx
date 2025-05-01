import { StyleSheet, View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import Octicons from "@expo/vector-icons/Octicons";

export default function PercentList({ title }: { title: string }) {
  return (
    <View style={styles.continer}>
      <View style={styles.titleSec}>
        <Octicons name="dot-fill" size={24} color="black" />
        <Text>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  continer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleSec: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
