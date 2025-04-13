import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GrayColors, MainColors } from "@/constants/Colors";
import { FontStyle } from "@/constants/Font";

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
  remainingSeconds: number;

  mode: SolvedMode;
} & SolvedCountProps &
  CardProps &
  SolveFooterButtonsProps;

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
}: SolveProps) {
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
            correctAnswer={correctAnswer} // 실제 값
            onChangeText={onChangeText}
            setAnswerVisible={setAnswerVisible}
            type={type}
            viewType={viewType}
          />
        </View>
      </View>
      <SolveFooterButtons
        isFirst={isFirst}
        isLast={isLast}
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
