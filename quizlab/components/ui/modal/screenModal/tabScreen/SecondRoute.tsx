import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { StyleSheet, Platform } from "react-native";
import { useRef } from "react";

import { MainColors, GrayColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";
import Feather from "@expo/vector-icons/Feather";

import ModalLargeTextbox from "../../ModalLargeTextBox";
import { OptionInput } from "../../OptionInput";

type ProblemList = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type SecondRouteProps = {
  problemText: string;
  setProblemText: React.Dispatch<React.SetStateAction<string>>;
  onAddProblem: () => void;
  option: ProblemList[];
  handleTextChange: (id: string, text: string) => void;
  checkAnswer: (id: string) => void;
  onRemove: (id: string) => void;
  scrollListRef: React.RefObject<ScrollView>;
};

const SecondRoute = ({
  problemText,
  setProblemText,
  onAddProblem,
  option,
  handleTextChange,
  checkAnswer,
  onRemove,
  scrollListRef,
}: SecondRouteProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tabStyles.container}
    >
      <View>
        <ModalLargeTextbox
          label="문제"
          placeholder="문제를 입력하세요"
          text={problemText}
          onChangetText={setProblemText}
        />
      </View>

      <ScrollView
        ref={scrollListRef}
        style={{ height: 180, marginTop: 24, marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {option.map((opt, idx) => (
          <View key={opt.id}>
            <OptionInput
              id={opt.id}
              text={opt.text}
              isCorrect={opt.isCorrect}
              handleTextChange={handleTextChange}
              checkAnswer={() => checkAnswer(opt.id)}
              onRemove={() => onRemove(opt.id)}
            />
          </View>
        ))}
      </ScrollView>
      <View>
        <TouchableOpacity
          style={tabStyles.addBtn}
          onPress={onAddProblem}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={20} color={GrayColors.black} />
          <Text style={tabStyles.btnTitle}>문제 추가하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  addBtn: {
    height: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
  },
  btnTitle: {
    marginLeft: 4,
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
    color: GrayColors.black,
  },
});

export { SecondRouteProps, SecondRoute };
