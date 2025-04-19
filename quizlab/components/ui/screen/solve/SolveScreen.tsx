import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GrayColors, MainColors } from "@/constants/Colors";

import safeParam from "@/utils/params";
import { formatTime } from "@/utils/formatTime";
import { ProblemType, SolvedMode } from "@/types/problems";

import Header from "@/components/ui/header";
import SolveFooterButtons, {
  SolveFooterButtonsProps,
} from "./SolveFooterButtons";
import ProblemCard, { CardProps } from "@/components/ui/card/ProblemCard";
import SolvedCountSection, { SolvedCountProps } from "./SolvedCounterSection";

type SolveProps = {
  folderId?: string;
  title: string;
  remainingSeconds?: number;

  mode: SolvedMode;
  onSubmit: () => void;
  onTimeout?: () => void; // ✅ 시간 초과 발생 시 호출
} & SolvedCountProps &
  CardProps &
  Omit<SolveFooterButtonsProps, "isSubmitting" | "onSubmit">;

export default function SolveScreen({
  folderId,
  title,
  mode,
  remainingSeconds,

  // 총 문제 수
  current,
  total,
  // 문제 카드
  type, // 문제 타입: 서술형 / 선택형
  questionText,
  answerText,
  onChangeText,
  options, // 서술형 문제
  onSelectOption,

  viewType = "default", // 문제 보임 여부
  answerVisible = false,
  setAnswerVisible,
  correctAnswer, // 실제 정답
  // 하단 버튼
  isFirst,
  isLast,
  onPrev,
  onNext,
  onSubmit,
  onTimeout,
}: SolveProps) {
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부

  useEffect(() => {
    if (
      mode !== "timed" || // 🔒 타임드 모드가 아니면 패스
      typeof remainingSeconds !== "number" || // 🔒 undefined 방어
      remainingSeconds > 0 || // 🔒 0초 아니면 패스
      !onTimeout // 🔒 핸들러 없으면 패스
    ) {
      return;
    }

    // ⏰ 시간이 정확히 0초일 때만 실행
    onTimeout();
  }, [remainingSeconds]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={safeParam(title)}
        rightIcon={mode === "timed" ? "time" : undefined}
        timeText={
          mode === "timed" ? formatTime(remainingSeconds || 0) : undefined
        }
        clockColor={
          remainingSeconds && remainingSeconds <= 30
            ? MainColors.danger
            : MainColors.primary
        }
      />
      <View
        style={{
          flexGrow: 1,
          justifyContent: "flex-start",
        }}
      >
        <View style={styles.contents}>
          <SolvedCountSection current={current} total={total} />
          <ProblemCard
            answerVisible={answerVisible} // 정답 확인 여부
            questionText={questionText} // firebase 문제
            answerText={answerText} // 사용자 입력값
            onChangeText={onChangeText}
            options={options}
            onSelectOption={onSelectOption}
            setAnswerVisible={setAnswerVisible}
            type={type}
            viewType={viewType}
            correctAnswer={correctAnswer} // 실제 값
          />
        </View>
      </View>
      <SolveFooterButtons
        isFirst={isFirst}
        isLast={isLast}
        isSubmitting={isSubmitting}
        onPrev={onPrev}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contents: {
    padding: 16,
    paddingTop: 24,
  },
});
