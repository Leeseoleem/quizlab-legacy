import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import Feather from "@expo/vector-icons/Feather";

type ListMenuProps = {
  onPress: () => void;
  title: string;
};

export default function ProblemListMenu({ onPress, title }: ListMenuProps) {
  return (
    <TouchableOpacity
      style={styles.contanier}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Feather name="list" size={24} color={GrayColors.black} />
      <Text style={styles.listTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contanier: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: GrayColors.gray10,
  },
  listTitle: {
    marginLeft: 12,
    ...FontStyle.subTitle,
    color: GrayColors.black,
  },
});
