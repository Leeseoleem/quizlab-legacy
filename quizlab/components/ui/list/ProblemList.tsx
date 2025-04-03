import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { FontStyle } from "@/constants/Font";

type ProblemListProps = {
  folderName: string;
  folderSub: string;
  onPressSolve: () => void;
  deleteList?: () => void;
};

export default function ProblemList({
  folderName,
  folderSub,
  onPressSolve,
  deleteList,
}: ProblemListProps) {
  return (
    <TouchableOpacity
      style={styles.listContainer}
      activeOpacity={0.8}
      onPress={onPressSolve}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View style={styles.floderRounded}>
          <Feather name="folder" size={24} color={MainColors.primary} />
        </View>
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text
            style={{
              ...FontStyle.listTitle,
              color: GrayColors.black,
              marginBottom: 4,
              flexWrap: "wrap",
              flexShrink: 1,
            }}
          >
            {folderName}
          </Text>
          <Text
            style={{
              ...FontStyle.subText,
              color: GrayColors.gray30,
              flexWrap: "wrap",
              flexShrink: 1,
            }}
          >
            {folderSub}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={deleteList}
        style={{
          alignItems: "center",
          paddingLeft: 16,
        }}
      >
        <Feather name="edit" size={20} color={GrayColors.gray40} />
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
  floderRounded: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MainColors.tertiary,
    borderRadius: 1000,
  },
});
