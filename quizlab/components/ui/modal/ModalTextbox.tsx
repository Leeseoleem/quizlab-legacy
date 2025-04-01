import React from "react";
import { View, TextInput } from "react-native";
import { StyleSheet } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import Octicons from "@expo/vector-icons/Octicons";

type ModalTextboxProps = {
  folderText: string;
  onChangeFolderText: (text: string) => void;
  onPressClear: () => void;
};

export default function ModalTextbox({
  folderText,
  onChangeFolderText,
  onPressClear,
}: ModalTextboxProps) {
  return (
    <View style={styles.headerContainer}>
      <TextInput
        placeholder="폴더명을 입력하세요"
        style={{
          ...styles.searchInput,
          borderColor: folderText ? MainColors.primary : GrayColors.gray20,
        }}
        value={folderText}
        onChangeText={onChangeFolderText}
        multiline={false}
        numberOfLines={1}
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
    borderWidth: 1,
    borderRadius: 8,
    fontFamily: "Pretendard-Medium",
  },
});
