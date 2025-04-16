import { useState, useEffect } from "react";
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
  remainingSeconds: number;

  mode: SolvedMode;
  onSubmit: (startedAt: Date) => void;
  onTimeout?: (startedAt: Date) => void; // ✅ 시간 초과 발생 시 호출
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
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!startedAt) {
      setStartedAt(new Date()); // ✅ 첫 마운트 시점 저장
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부

  const handleSubmit = () => {
    if (!startedAt || isSubmitting) return; // 이미 제출 중이면 막기
    try {
      onSubmit(startedAt); // 🔄 실제 저장 처리 (props로 전달된 함수)
    } catch (error) {
      console.error("❌ 제출 중 오류:", error);
      // TODO: Toast 메시지 띄우기 등 추가 가능
    } finally {
      setIsSubmitting(false); // 제출 완료 후 로딩 종료
    }
  };

  useEffect(() => {
    console.log(remainingSeconds);
    if (mode === "timed" && remainingSeconds === 0 && startedAt && onTimeout) {
      onTimeout(startedAt); // ⏰ 시간이 0초 됐을 때 상위로 알림
    }
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
            setAnswerVisible={setAnswerVisible}
            type={type}
            viewType={viewType}
            options={options}
            onSelectOption={onSelectOption}
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
        onSubmit={handleSubmit}
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
