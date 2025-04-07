import React from "react";
import { View, TextInput } from "react-native";
import { StyleSheet, Text } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

type ModalLargeTextboxProps = {
  label: string;
  placeholder: string;
  text: string;
  onChangetText: (text: string) => void;
};

export default function ModalLargeTextbox({
  label,
  placeholder,
  text,
  onChangetText,
}: ModalLargeTextboxProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={{
          ...styles.searchInput,
          borderColor: text ? MainColors.primary : GrayColors.gray20,
          borderWidth: text ? 1.5 : 1,
        }}
        value={text}
        onChangeText={onChangetText}
        multiline={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.black,
    marginBottom: 8,
  },
  searchInput: {
    height: 96,
    textAlignVertical: "top",
    padding: 16,
    borderRadius: 8,
    fontFamily: "Pretendard-Medium",
  },
});
