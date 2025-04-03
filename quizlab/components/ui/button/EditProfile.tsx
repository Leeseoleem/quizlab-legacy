import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

type EditProfileProps = {
  onPress: () => void;
};

export default function EditProfile({ onPress }: EditProfileProps) {
  return (
    <TouchableOpacity style={styles.editContainer} onPress={onPress}>
      <Feather name="edit-2" size={16} color={GrayColors.black} />
      <Text
        style={{
          ...FontStyle.bedgeText,
          color: GrayColors.black,
          marginLeft: 8,
        }}
      >
        닉네임 수정하기
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
});
