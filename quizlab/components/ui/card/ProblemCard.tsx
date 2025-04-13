import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

import { FontStyle } from "@/constants/Font";
import { GrayColors, MainColors } from "@/constants/Colors";
import ModalLargeTextbox from "../modal/ModalLargeTextBox";
import PropblemTypeBedge from "../bedge/ProblemTypeBedge";

import Feather from "@expo/vector-icons/Feather";

export type CardProps = {
  type: "descriptive" | "choice";
  viewType?: "default" | "toggle";
  questionText: string;
  answerText: string; // 사용자가 입력한 값
  correctAnswer?: string; // 실제 정답 (toggle 펼치기에 사용)
  onChangeText: (text: string) => void;
  answerVisible?: boolean;
  setAnswerVisible?: React.Dispatch<React.SetStateAction<boolean>>;
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
        <ModalLargeTextbox
          label="정답"
          placeholder="정답을 입력해주세요."
          text={answerText}
          onChangetText={onChangeText}
        />
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
