import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";

export type ModalBtnProps = {
  btnType?: "default" | "cancle";
  title: string;
  onPressOk?: () => void;
  onPressCancle?: () => void;
};

export default function ModalBtn({
  btnType,
  title,
  onPressOk,
  onPressCancle,
}: ModalBtnProps) {
  return (
    <View>
      {btnType === "default" && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btnContainer}
          onPress={onPressOk}
        >
          <Text style={{ ...styles.title, color: GrayColors.white }}>
            {title}
          </Text>
        </TouchableOpacity>
      )}
      {btnType === "cancle" && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btnContainerC}
          onPress={onPressCancle}
        >
          <Text style={{ ...styles.title, color: GrayColors.black }}>
            {title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    width: 100,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: MainColors.primary,
  },
  btnContainerC: {
    width: 100,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: GrayColors.white,
    borderColor: GrayColors.gray20,
  },
  title: {
    ...FontStyle.subTitle,
  },
});
