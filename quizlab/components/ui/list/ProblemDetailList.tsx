import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";

import PropblemTypeBedge from "../bedge/ProblemTypeBedge";
import { PropblemTypeBedgeProps } from "../bedge/ProblemTypeBedge";
import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import Feather from "@expo/vector-icons/Feather";

type ProblemDetailListProps = {
  questionTitle: string;
  answerTitle: string;
  onEditProblem: () => void;
} & PropblemTypeBedgeProps;

export default function ProblemDetailList({
  type,
  questionTitle,
  answerTitle,
  onEditProblem,
}: ProblemDetailListProps) {
  return (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <PropblemTypeBedge type={type} />
        <TouchableOpacity activeOpacity={0.8} onPress={onEditProblem}>
          <Feather name="more-vertical" size={24} color={GrayColors.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.listContent}>
        <Text
          style={styles.problemTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {questionTitle}
        </Text>
      </View>
      <View style={styles.listFooter}>
        <Text style={{ ...styles.footerText, color: GrayColors.gray30 }}>
          정답:
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...styles.footerText,
            color: MainColors.primary,
            paddingLeft: 4,
            paddingRight: 24,
          }}
        >
          {answerTitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray30,
    backgroundColor: GrayColors.white,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContent: {
    marginVertical: 16,
  },
  problemTitle: {
    ...FontStyle.contentsText,
  },
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
});
