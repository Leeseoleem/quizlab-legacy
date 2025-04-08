import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import { MainColors, GrayColors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";

import ModalLargeTextbox from "../../ModalLargeTextBox";
import { OptionInput } from "../../OptionInput";
import {
  handleAddOption,
  handleOptionTextChange,
  handleCheckAnswer,
  handleRemoveOption,
} from "@/utils/problemOptionsHandler/problemOptionHandlers";

type ProblemList = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type SecondRouteProps = {
  problemText: string;
  setProblemText: React.Dispatch<React.SetStateAction<string>>;
  option: ProblemList[];
  setOptions: React.Dispatch<React.SetStateAction<ProblemList[]>>;
  scrollListRef: React.RefObject<ScrollView>;
};

const SecondRoute = ({
  problemText,
  setProblemText,
  option,
  setOptions,
  scrollListRef,
}: SecondRouteProps) => {
  const scrollToBottom = () => {
    scrollListRef.current?.scrollToEnd({ animated: true });
  };
  return (
    <View style={tabStyles.container}>
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
              handleTextChange={(id, text) =>
                handleOptionTextChange(id, text, setOptions)
              }
              checkAnswer={() => handleCheckAnswer(opt.id, option, setOptions)}
              onRemove={() => handleRemoveOption(opt.id, option, setOptions)}
            />
          </View>
        ))}
      </ScrollView>
      <View>
        <TouchableOpacity
          style={tabStyles.addBtn}
          onPress={() => handleAddOption(option, setOptions, scrollToBottom)}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={20} color={GrayColors.black} />
          <Text style={tabStyles.btnTitle}>문제 추가하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  container: {},
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
