import React from "react";
import { submitAndRedirect } from "../submitAndRedirect";
import { SolvedMode, SolvedProblemDoc } from "@/types/solved";
import { saveTodayLearning } from "../cloud/learning";

// 현재 문제의 사용자 입력 반영
export function updateSolvingAnswer(
  solving: SolvedProblemDoc[],
  index: number,
  answer: string,
  selectedOptionId?: string
) {
  return solving.map((item, i) => {
    if (i !== index) return item;
    if (item.type === "choice" && item.options && selectedOptionId) {
      const updatedOptions = item.options.map((opt) => ({
        ...opt,
        userCheck: opt.id === selectedOptionId,
      }));
      return {
        ...item,
        index,
        options: updatedOptions,
        userAnswer: selectedOptionId,
      };
    }
    return { ...item, index, userAnswer: answer };
  });
}

type SubmitArgs = {
  startedAt: Date;
  setStartAt: React.Dispatch<React.SetStateAction<Date>>;
  solving: SolvedProblemDoc[];
  currentIndex: number;
  answerText: string;
  setIncompleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
  mode: SolvedMode;
  remainingSeconds?: number;
};

// 문제 제출 함수
export const handleSubmit = async (args: SubmitArgs) => {
  const {
    startedAt,
    setStartAt,
    solving,
    currentIndex,
    answerText,
    setIncompleteModal,
    folderId,
    mode,
    remainingSeconds,
  } = args;

  const updatedSolving = solving.map((item, i) => {
    if (i !== currentIndex) return item;
    if (item.type === "descriptive") {
      return { ...item, index: currentIndex, userAnswer: answerText };
    }
    return item;
  });

  const hasEmpty = updatedSolving.some((p) =>
    p.type === "descriptive"
      ? p.userAnswer === ""
      : !p.options?.some((opt) => opt.userCheck)
  );

  if (hasEmpty) {
    setStartAt(startedAt);
    setIncompleteModal(true);
    return;
  }

  try {
    await saveTodayLearning(); // ✅ 학습 기록 먼저 저장
  } catch (error) {
    console.error("❌ 학습 기록 저장 실패:", error);
    // 기록 실패해도 퀴즈 제출은 막지 않고 계속 진행
  }

  submitAndRedirect({
    folderId,
    mode,
    solving: updatedSolving,
    startedAt,
    remainingSeconds,
  });
};

type SubmitProps = {
  startedAt: Date;
  folderId: string;
  mode: SolvedMode;
  solving: SolvedProblemDoc[];
  remainingSeconds?: number;
};

// 강제 제출 함수: 사용자가 모든 문제를 다 풀지 않았더라도 강제로 제출을 실행함
export const forceSubmit = async ({
  startedAt,
  folderId,
  mode,
  solving,
  remainingSeconds,
}: SubmitProps) => {
  if (!startedAt) return;

  try {
    await saveTodayLearning(); // ✅ 강제 제출 시에도 학습 기록 남기기
  } catch (error) {
    console.error("❌ 학습 기록 저장 실패 (forceSubmit):", error);
    // 학습 기록 실패해도 제출은 계속 진행
  }

  // 제출 및 페이지 전환 함수 호출
  submitAndRedirect({
    folderId,
    mode,
    solving,
    startedAt,
    remainingSeconds,
  });
};
