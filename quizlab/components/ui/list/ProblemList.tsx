import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { FontStyle } from "@/constants/Font";

type ProblemListProps = {
  folderName: string;
  onPressSolve: () => void;
  deleteList?: () => void;
};

export default function ProblemList({
  folderName,
  onPressSolve,
  deleteList,
}: ProblemListProps) {
  return (
    <TouchableOpacity
      style={styles.listContainer}
      activeOpacity={0.8}
      onPress={onPressSolve}
    >
      <View style={{ flexDirection: "row" }}>
        <Feather name="folder" size={24} color="black" />
        <Text
          style={{
            ...FontStyle.contentsText,
            color: GrayColors.black,
            marginLeft: 16,
          }}
        >
          {folderName}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={deleteList}>
        <Feather name="trash" size={24} color={GrayColors.gray40} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GrayColors.gray30,
    backgroundColor: GrayColors.white,
  },
});
