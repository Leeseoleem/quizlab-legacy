import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity, Pressable } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import Feather from "@expo/vector-icons/Feather";
import PercentList from "./PercentList";

type ProblemListProps = {
  folderName: string;
  onPressDetail: () => void;
  totalDuration: string;
  averageAccuracy: string;
};

export default function ProblemTotalList({
  folderName,
  onPressDetail,
  totalDuration,
  averageAccuracy,
}: ProblemListProps) {
  return (
    <TouchableOpacity
      style={styles.listContainer}
      activeOpacity={0.8}
      onPress={onPressDetail}
    >
      <View style={styles.folderHeader}>
        <View style={styles.floderRounded}>
          <Feather name="folder" size={20} color={MainColors.primary} />
        </View>
        <Text style={styles.folderName}>{folderName}</Text>
      </View>
      <View style={styles.listSec}>
        <PercentList
          title="총 학습 시간"
          value={totalDuration}
          color={MainColors.safe}
        />
        <PercentList
          title="정확도"
          value={averageAccuracy}
          color={GrayColors.gray20}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    backgroundColor: GrayColors.white,
    gap: 20,
  },
  folderHeader: { flexDirection: "row", alignItems: "center", gap: 20 },
  floderRounded: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MainColors.tertiary,
    borderRadius: 1000,
  },
  contentsContainer: { marginLeft: 20, flex: 1 },
  folderName: {
    ...FontStyle.listTitle,
    color: GrayColors.black,
    marginBottom: 4,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  listSec: {
    paddingHorizontal: 16,
  },
});
