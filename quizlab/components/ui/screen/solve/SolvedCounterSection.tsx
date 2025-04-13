import { View, Text, StyleSheet } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

export type SolvedCountProps = {
  current: string;
  total: string;
};

export default function SolvedCountSection({
  current,
  total,
}: SolvedCountProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 24,
      }}
    >
      <Text style={styles.problemText}>문제</Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={[
            styles.problemTotalText,
            {
              color: current === total ? MainColors.primary : GrayColors.black,
            },
          ]}
        >
          {current}
        </Text>
        <Text style={styles.problemTotalText}>/</Text>
        <Text style={styles.problemTotalText}>{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  problemText: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
    marginRight: 6,
  },
  problemTotalText: {
    ...FontStyle.subText,
    color: GrayColors.black,
    marginRight: 4,
  },
});
