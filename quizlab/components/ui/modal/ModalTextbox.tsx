import React from "react";
import { View, TextInput } from "react-native";
import { StyleSheet } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import Octicons from "@expo/vector-icons/Octicons";

type ModalTextboxProps = {
  folderText: string;
  placeholder: string;
  onChangeFolderText: (text: string) => void;
  onPressClear: () => void;
  maxLength?: number;
};

export default function ModalTextbox({
  folderText,
  placeholder,
  onChangeFolderText,
  onPressClear,
  maxLength,
}: ModalTextboxProps) {
  return (
    <View style={styles.headerContainer}>
      <TextInput
        placeholder={placeholder}
        style={{
          ...styles.searchInput,
          borderColor: folderText ? MainColors.primary : GrayColors.gray20,
          borderWidth: folderText ? 1.5 : 1,
        }}
        value={folderText}
        onChangeText={onChangeFolderText}
        multiline={false}
        numberOfLines={1}
        maxLength={maxLength}
      />
      {folderText && (
        <Octicons
          name="x-circle-fill"
          size={18}
          color={GrayColors.gray30}
          style={{
            position: "absolute",
            right: 16,
          }}
          onPress={onPressClear}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 50,
    paddingVertical: 12,
    borderRadius: 8,
    fontFamily: "Pretendard-Medium",
  },
});
