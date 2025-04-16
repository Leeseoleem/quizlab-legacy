import { TouchableOpacity, View, Text } from "react-native";
import { StyleSheet } from "react-native";

import { FontStyle } from "@/constants/Font";
import { MainColors, GrayColors } from "@/constants/Colors";

import Octicons from "@expo/vector-icons/Octicons";

export type ChoiceSectionProps = {
  options: { id: string; text: string }[];
  selectedId?: string; // ✅ 현재 선택된 보기의 id
  onSelectOption: (id: string) => void; // ✅ 선택 이벤트 콜백
};

export default function ChoiceSection({
  options,
  selectedId,
  onSelectOption,
}: ChoiceSectionProps) {
  return (
    <View>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          onPress={() => onSelectOption(opt.id)} // ✅ 선택된 optionId를 상위로 전달
          style={styles.optionContainer}
          activeOpacity={0.8}
        >
          {selectedId === opt.id ? (
            <Octicons
              name="check-circle-fill"
              size={20}
              color={MainColors.primary}
            />
          ) : (
            <Octicons name="circle" size={20} color={MainColors.primary} />
          )}
          <Text style={styles.inputText}>{opt.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  inputText: {
    ...FontStyle.subText,
    color: GrayColors.black,
    marginLeft: 10,
  },
});
