import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import Feather from "@expo/vector-icons/Feather";

type ProblemBtn = {
  type: "prev" | "prev-non" | "next" | "done";
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function ProblemBtn({
  type,
  title,
  onPress,
  disabled = false,
}: ProblemBtn) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.btnContainer,
        {
          borderWidth: type === "prev" || type === "prev-non" ? 1 : undefined,
          borderColor:
            type === "prev" || type === "prev-non"
              ? GrayColors.gray20
              : undefined,
          backgroundColor:
            type === "next" || type === "done"
              ? MainColors.primary
              : GrayColors.white,
        },
      ]}
    >
      {(type === "prev" || type === "prev-non") && (
        <Feather
          name="chevron-left"
          size={24}
          color={type === "prev-non" ? GrayColors.gray20 : GrayColors.black}
        />
      )}
      <Text
        style={[
          styles.btnTitle,
          {
            color:
              type === "prev"
                ? GrayColors.black
                : type === "prev-non"
                ? GrayColors.gray20
                : GrayColors.white,
          },
        ]}
      >
        {title}
      </Text>
      {type === "next" && (
        <Feather name="chevron-right" size={24} color={GrayColors.white} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    width: 100,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    ...FontStyle.contentsText,
    marginLeft: 8,
    textAlign: "center",
  },
});
