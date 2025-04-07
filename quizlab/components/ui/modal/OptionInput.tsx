import { StyleSheet } from "react-native";
import { TouchableOpacity, TextInput, View, Text } from "react-native";
import { KeyboardAvoidingView } from "react-native";

import { MainColors, GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

import Octicons from "@expo/vector-icons/Octicons";

type OptionInputProps = {
  id: string;
  text: string;
  isCorrect: boolean;
  handleTextChange: (id: string, text: string) => void; // 텍스트 변경 함수
  checkAnswer: (id: string) => void; // 정담 선택 함수
  onRemove: (id: string) => void; // 삭제 힘수
  onFocus?: () => void;
};

export const OptionInput = ({
  id,
  text,
  isCorrect,
  checkAnswer,
  handleTextChange,
  onRemove,
}: OptionInputProps) => {
  return (
    <View style={styles.optionContainer}>
      <TouchableOpacity onPress={() => checkAnswer(id)} activeOpacity={0.8}>
        {isCorrect ? (
          <Octicons
            name="check-circle-fill"
            size={20}
            color={MainColors.primary}
          />
        ) : (
          <Octicons name="circle" size={20} color={MainColors.primary} />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          numberOfLines={1}
          onChangeText={(updatText) => {
            console.log("🔥 사용자가 입력한 값:", updatText);
            handleTextChange(id, updatText);
          }}
          style={styles.input}
          placeholder="답을 입력하세요..."
        />
      </View>
      <TouchableOpacity onPress={() => onRemove(id)}>
        <Text style={styles.remove}>－</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
  remove: {},
});
