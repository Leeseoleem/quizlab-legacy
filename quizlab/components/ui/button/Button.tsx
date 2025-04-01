import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { StyleSheet } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

type AddBtnProps = {
  type: "default" | "non" | "other" | "add";
  onPress?: (event: GestureResponderEvent) => void;
  btnTitle?: string;
};

export default function Button({ type, onPress, btnTitle }: AddBtnProps) {
  return (
    <TouchableOpacity
      style={{
        ...styles.btnContainer,
        backgroundColor:
          type === "default"
            ? MainColors.primary
            : type === "non"
            ? MainColors.secondary
            : GrayColors.white,
        borderWidth: type === "add" || type === "other" ? 1 : 0,
        borderColor:
          type === "add"
            ? GrayColors.gray30
            : "other"
            ? GrayColors.gray20
            : undefined,
      }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {type === "default" && (
        <Text
          style={{
            ...FontStyle.subTitle,
            color: GrayColors.white,
          }}
        >
          {btnTitle}
        </Text>
      )}
      {type === "non" && (
        <Text
          style={{
            ...FontStyle.subTitle,
            color: GrayColors.white,
          }}
        >
          {btnTitle}
        </Text>
      )}
      {type === "other" && (
        <Text
          style={{
            ...FontStyle.subTitle,
            color: GrayColors.black,
          }}
        >
          {btnTitle}
        </Text>
      )}
      {type === "add" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather name="plus" size={24} color={GrayColors.gray40} />
          <Text
            style={{
              ...FontStyle.subTitle,
              color: GrayColors.gray40,
              marginLeft: 8,
            }}
          >
            문제 추가하기
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    width: "100%",
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTitle: {
    ...FontStyle.subTitle,
    color: GrayColors.white,
  },
});
