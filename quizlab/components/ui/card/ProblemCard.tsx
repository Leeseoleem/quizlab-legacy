import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";
import { CheckOption } from "@/types/solved";

import ModalLargeTextbox from "../modal/ModalLargeTextBox";
import PropblemTypeBedge from "../bedge/ProblemTypeBedge";
import ChoiceSection from "./ChoiceSection";

import Feather from "@expo/vector-icons/Feather";

export type CardProps = {
  type: "descriptive" | "choice";
  questionText: string;

  // 공통
  correctAnswer?: string;
  viewType?: "default" | "toggle";
  answerVisible?: boolean;
  setAnswerVisible?: React.Dispatch<React.SetStateAction<boolean>>;

  // 서술형 전용
  answerText?: string; // 선택형에서는 optionId로 대체됨
  onChangeText?: (text: string) => void;

  // 선택형 전용
  options?: CheckOption[]; // ✅ 선택형 옵션 (CheckOption 타입)
  onSelectOption?: (optionId: string) => void; // ✅ 선택 시 호출
};

export default function ProblemCard({
  type,
  viewType = "default",
  questionText,
  answerText,
  correctAnswer,
  onChangeText,
  answerVisible = false,
  setAnswerVisible,
  options,
  onSelectOption,
}: CardProps) {
  return (
    <View style={cardStyles.cardContainer}>
      <PropblemTypeBedge type={type} />

      <Text style={cardStyles.problemText}>{questionText}</Text>

      <View
        style={{
          width: "100%",
        }}
      >
        {type === "descriptive" && (
          <ModalLargeTextbox
            label="정답"
            placeholder="정답을 입력해주세요."
            text={answerText ?? ""}
            onChangetText={onChangeText!}
          />
        )}
        {type === "choice" && (
          <ChoiceSection
            options={options ?? []}
            selectedId={answerText} // ✅ 현재 선택된 옵션의 id
            onSelectOption={onSelectOption!} // ✅ 선택 시 호출될 콜백}
          />
        )}
      </View>
      {viewType === "toggle" && (
        <View style={{ width: "100%" }}>
          <View style={cardStyles.line} />
          {answerVisible && (
            <View style={cardStyles.answerContainer}>
              <Text style={cardStyles.answerTitle}>정답</Text>
              <Text style={cardStyles.answerText}>{correctAnswer}</Text>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={cardStyles.toggleBtn}
            onPress={() => {
              if (setAnswerVisible) {
                setAnswerVisible(!answerVisible);
              }
            }}
          >
            <Text style={cardStyles.toggleText}>
              {!answerVisible ? "정답 펼치기" : "정답 숨기기"}
            </Text>
            {!answerVisible ? (
              <Feather
                name="chevron-down"
                size={20}
                color={GrayColors.grayHax}
              />
            ) : (
              <Feather name="chevron-up" size={20} color={GrayColors.grayHax} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  cardContainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.grayHax,
  },
  problemText: {
    ...FontStyle.subTitle,
    color: GrayColors.black,
    marginVertical: 20,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: GrayColors.gray20,
    alignItems: "center",
    marginVertical: 24,
  },
  toggleBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    ...FontStyle.bedgeText,
    color: GrayColors.grayHax,
    marginRight: 4,
  },
  answerContainer: {
    marginBottom: 16,
  },
  answerTitle: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
    marginBottom: 6,
  },
  answerText: {
    ...FontStyle.contentsText,
    color: GrayColors.black,
  },
});
