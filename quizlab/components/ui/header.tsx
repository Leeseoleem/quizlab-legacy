import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native";

import { GestureResponderEvent, ViewStyle } from "react-native";

import { GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  rightIcon?: "search" | "edit" | "menu" | "time";
  clockColor?: string;
  timeText?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function Header({
  title,
  showBack,
  rightIcon,
  onPress,
  clockColor,
  timeText,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{
              marginRight: 24,
            }}
          >
            <Feather name="arrow-left" size={24} color={GrayColors.black} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        {rightIcon === "search" && (
          <TouchableOpacity>
            <Feather name="search" size={24} color={GrayColors.black} />
          </TouchableOpacity>
        )}
        {rightIcon === "edit" && (
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={GrayColors.black}
            />
          </TouchableOpacity>
        )}
        {rightIcon === "menu" && (
          <TouchableOpacity>
            <Feather name="more-vertical" size={24} color={GrayColors.black} />
          </TouchableOpacity>
        )}
        {rightIcon === "time" && (
          <View style={styles.timeFram}>
            <Feather name="clock" size={24} color={clockColor} />
            <Text style={styles.timeText}>{timeText}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: 64,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: GrayColors.black,
    ...FontStyle.title,
  },
  timeFram: {
    flexDirection: "row",
    justifyContent: "center",
  },
  timeText: {
    marginLeft: 8,
    fontFamily: "Pretendard-Regular",
    color: GrayColors.gray30,
  },
});
