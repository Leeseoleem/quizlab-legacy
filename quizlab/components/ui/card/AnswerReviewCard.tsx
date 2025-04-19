import { GrayColors, MainColors } from "@/constants/Colors";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

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

  text: string;
  onChangetText: (text: string) => void;
};

export default function AnswerReviewCard({
  type,
  isCorrect,
  question,
  userAnswer,
  correctAnswer,
  options,

  text,
  onChangetText,
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

            if (isCorrectSelected)
              bgColor = MainColors.safeSec; // 초록색 (정답 + 선택함)
            else if (isWrong)
              bgColor = MainColors.dangerSec; // 빨간색 (오답 + 선택함)
            else if (isAnswer) bgColor = "#FFF3BF";

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
                      isCorrectSelected
                        ? MainColors.safe
                        : isAnswer
                        ? "#FFD43B"
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
      <View style={styles.padding} />
      <View>
        <View>
          <Text style={styles.label}>오답 노트</Text>
          <TextInput
            placeholder="메모를 남겨보세요"
            style={{
              ...styles.searchInput,
              borderColor: text ? MainColors.primary : GrayColors.gray20,
              borderWidth: text ? 1.5 : 1,
            }}
            value={text}
            onChangeText={onChangetText}
            multiline={true}
          />
        </View>
      </View>
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
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
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
  label: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.black,
    marginBottom: 8,
  },
  searchInput: {
    height: 96,
    textAlignVertical: "top",
    padding: 16,
    borderRadius: 8,
    fontFamily: "Pretendard-Medium",
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
    paddingVertical: 6,
  },
  title: {
    ...FontStyle.textBoxLabel,
    color: GrayColors.black,
    marginLeft: 6,
  },
});

const SaveBedge = () => {
  return (
    <TouchableOpacity>
      <Feather name="save" size={24} color={GrayColors.gray40} />
    </TouchableOpacity>
  );
};
