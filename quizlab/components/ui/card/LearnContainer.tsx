import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { ReactElement } from "react";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

export type LearnProps = {
  keyTitle: string;
  value: string;
  icon: ReactElement;
};

export default function LearnContainer({ keyTitle, value, icon }: LearnProps) {
  return (
    <View style={styles.todayLearnContainer}>
      <View
        style={{
          gap: 8,
        }}
      >
        <Text
          style={[
            styles.subDesTitle,
            {
              color: GrayColors.gray30,
            },
          ]}
        >
          {keyTitle}
        </Text>
        <Text style={styles.title}>{value}</Text>
      </View>
      <View style={styles.iconCircle}>{icon}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    // 유지
    ...FontStyle.listTitle,
    color: GrayColors.black,
  },

  subDesTitle: {
    // 유지
    ...FontStyle.bedgeText,
  },

  todayLearnContainer: {
    // 유지
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconCircle: {
    // 유지
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    width: 48,
    borderRadius: 1000,
    backgroundColor: MainColors.tertiary,
  },
});
