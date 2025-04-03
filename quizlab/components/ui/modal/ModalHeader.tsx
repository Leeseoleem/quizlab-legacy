import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors } from "@/constants/Colors";

import Feather from "@expo/vector-icons/Feather";

export type ModalHeaderProps = {
  type?: "back" | "exist" | "simple";
  title: string;
  onPressBack?: () => void;
  onPressExist?: () => void;
};

export default function ModalHeader({
  type,
  title,
  onPressBack,
  onPressExist,
}: ModalHeaderProps) {
  return (
    <View style={styles.Modalheader}>
      {type === "back" && (
        <View style={styles.backConainer}>
          <Text style={styles.title}>{title}</Text>
          <Feather
            name="x"
            size={24}
            color={GrayColors.black}
            onPress={onPressBack}
          />
        </View>
      )}
      {type === "exist" && (
        <View style={styles.existConainer}>
          <Feather
            name="arrow-left"
            size={24}
            color={GrayColors.black}
            style={{
              marginRight: 24,
            }}
            onPress={onPressExist}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {type === "simple" && (
        <View style={styles.backConainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Modalheader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backConainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  existConainer: {
    flexDirection: "row",
  },
  title: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
  },
});
