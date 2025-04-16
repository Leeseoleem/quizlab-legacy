import { GrayColors, MainColors } from "@/constants/Colors";
import { StyleSheet, View, Text } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import { FontStyle } from "@/constants/Font";

import { CheckOption } from "@/types/solved";

type AnswerReviewProps = {
  type: "descriptive" | "choice";
  isCorrect: boolean;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  options?: CheckOption[]; // 서술형의 경우
};

export default function AnswerReviewCard({
  type,
  isCorrect,
  question,
  userAnswer,
  correctAnswer,
  options,
}: AnswerReviewProps) {
  return (
    <View style={styles.contanier}>
      <CorrectBedge isCorrect={isCorrect} />
      <View style={styles.padding} />
      <Text style={styles.question}>{question}</Text>
      <View style={styles.padding} />
      {type === "descriptive" && (
        <View>
          <View>
            <Text style={styles.answerLabl}>작성한 답</Text>
            <Text style={styles.answer}>{userAnswer}</Text>
          </View>
          <View
            style={{
              height: 12,
            }}
          />
          <View>
            <Text style={styles.answerLabl}>정답</Text>
            <Text style={styles.answer}>{correctAnswer}</Text>
          </View>
        </View>
      )}
      {type === "choice" && (
        <View>
          {options?.map((opt) => {
            const isSelected = opt.userCheck; // 사용자 선택 보기
            const isAnswer = opt.isCorrect; // 실제 정답
            const isWrong = isSelected && !isAnswer; // 선택했으나 오류
            const isCorrectSelected = isSelected && isAnswer; // 선택했으며 정답

            let bgColor = "transparent"; // 기본: 배경 없음

            if (isAnswer || isCorrectSelected)
              bgColor = MainColors.safeSec; // 초록색 (정답 + 선택함)
            else if (isWrong) bgColor = MainColors.dangerSec; // 빨간색 (오답 + 선택함)

            return (
              <View
                key={opt.id}
                style={[
                  styles.checkOption,
                  {
                    backgroundColor: bgColor,
                  },
                ]}
              >
                {isSelected || isAnswer ? (
                  <Octicons
                    name="check-circle-fill"
                    size={18}
                    color={
                      isCorrectSelected || isAnswer
                        ? MainColors.safe
                        : MainColors.danger
                    }
                  />
                ) : (
                  <Octicons
                    name="circle"
                    size={18}
                    color={MainColors.primary}
                  />
                )}
                <Text style={styles.optionText}>{opt.text}</Text>
              </View>
            );
          })}
        </View>
      )}
      <View style={styles.padding} />
    </View>
  );
}

const styles = StyleSheet.create({
  contanier: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GrayColors.gray20,
    padding: 16,
  },
  padding: {
    height: 24,
  },
  question: {
    ...FontStyle.modalTitle,
    color: GrayColors.black,
  },
  answerLabl: {
    ...FontStyle.bedgeText,
    color: GrayColors.gray30,
  },
  answer: {
    ...FontStyle.contentsText,
    color: GrayColors.black,
  },
  checkOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    ...FontStyle.contentsText,
    color: GrayColors.black,
    marginLeft: 12,
  },
});

type CorrectBedgeProps = {
  isCorrect: boolean;
};

const CorrectBedge = ({ isCorrect }: CorrectBedgeProps) => {
  return (
    <View
      style={[
        bedgeStyles.contanier,
        {
          backgroundColor: isCorrect ? MainColors.safe : MainColors.danger,
        },
      ]}
    >
      {isCorrect ? (
        <Feather name="circle" size={16} color={GrayColors.white} />
      ) : (
        <Feather name="x" size={16} color={GrayColors.white} />
      )}
      <Text style={bedgeStyles.title}>{isCorrect ? "정답" : "오답"}</Text>
    </View>
  );
};

const bedgeStyles = StyleSheet.create({
  contanier: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.black,
    marginLeft: 6,
  },
});
