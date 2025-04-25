import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity, Pressable } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { FontStyle } from "@/constants/Font";

type ProblemListProps = {
  folderName: string;
  folderSub?: string;
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
      <View style={styles.folderContainer}>
        <View style={styles.floderRounded}>
          <Feather name="folder" size={20} color={MainColors.primary} />
        </View>
        <View style={styles.contentsContainer}>
          <Text style={styles.folderName}>{folderName}</Text>
          {folderSub && <Text style={styles.folderSub}>{folderSub}</Text>}
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          paddingLeft: 16,
        }}
      >
        <Pressable
          onPress={deleteList}
          style={({ pressed }) => [
            styles.editBtn,
            pressed && { backgroundColor: MainColors.tertiary },
          ]}
        >
          <Feather name="more-vertical" size={20} color={GrayColors.gray40} />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GrayColors.grayHax,
    backgroundColor: GrayColors.white,
  },
  folderContainer: { flex: 1, flexDirection: "row", alignItems: "center" },
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
  folderSub: {
    ...FontStyle.subText,
    color: GrayColors.gray30,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
